const QRCode = require('qrcode');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const Voucher = require('../models/Voucher');

// Helper to generate unique booking code HT-2026-XXXX
const generateBookingCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `HT-2026-${random}`;
};

// @desc Create a new booking
// @route POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      roomQuantity = 1,
      guestInfo,
      voucherCode,
      paymentMethod = 'mock'
    } = req.body;

    const room = await Room.findById(roomId).populate('hotel');
    if (!room || room.isDeleted || room.isLocked) {
      return res.status(400).json({ success: false, message: 'Phòng hiện không khả dụng hoặc đã bị khóa' });
    }

    if (room.availableRooms < roomQuantity) {
      return res.status(400).json({ success: false, message: 'Rất tiếc, số lượng phòng trống không đủ' });
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Check pricing: calculate original total
    let roomRate = room.pricePerNight;
    let originalTotal = roomRate * nights * roomQuantity;

    // Apply voucher if provided
    let discountAmount = 0;
    let voucherDoc = null;

    if (voucherCode) {
      voucherDoc = await Voucher.findOne({
        code: voucherCode.toUpperCase(),
        isActive: true,
        endDate: { $gte: new Date() }
      });

      if (voucherDoc) {
        if (voucherDoc.usedCount >= voucherDoc.totalUsageLimit) {
          return res.status(400).json({ success: false, message: 'Mã voucher này đã hết lượt sử dụng' });
        }
        if (originalTotal < voucherDoc.minSpend) {
          return res.status(400).json({
            success: false,
            message: `Đơn hàng tối thiểu để áp dụng mã là ${voucherDoc.minSpend.toLocaleString('vi-VN')} VNĐ`
          });
        }

        if (voucherDoc.discountType === 'percent') {
          discountAmount = (originalTotal * voucherDoc.discountValue) / 100;
          if (voucherDoc.maxDiscount > 0 && discountAmount > voucherDoc.maxDiscount) {
            discountAmount = voucherDoc.maxDiscount;
          }
        } else {
          discountAmount = voucherDoc.discountValue;
        }

        if (discountAmount > originalTotal) discountAmount = originalTotal;
      }
    }

    const finalTotal = Math.max(0, originalTotal - discountAmount);
    const bookingCode = generateBookingCode();
    const qrCodeToken = crypto.randomBytes(16).toString('hex');

    // Generate QR Code data URL containing check-in token & booking info
    const qrPayload = JSON.stringify({
      code: bookingCode,
      token: qrCodeToken,
      guest: guestInfo.name,
      hotel: room.hotel.name,
      room: room.name,
      checkIn: checkInDate,
      checkOut: checkOutDate
    });
    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload);

    // Create booking record
    const booking = await Booking.create({
      bookingCode,
      customer: req.user.id,
      hotel: room.hotel._id,
      room: room._id,
      checkInDate: start,
      checkOutDate: end,
      nights,
      roomQuantity,
      guestInfo,
      pricing: {
        roomRate,
        originalTotal,
        discountAmount,
        finalTotal
      },
      voucher: voucherDoc ? voucherDoc._id : null,
      paymentMethod,
      paymentStatus: paymentMethod === 'mock' ? 'paid' : 'pending',
      status: paymentMethod === 'mock' ? 'confirmed' : 'pending',
      qrCodeToken,
      qrCodeDataUrl
    });

    // If mock payment, immediately decrement available rooms
    if (paymentMethod === 'mock') {
      room.availableRooms = Math.max(0, room.availableRooms - roomQuantity);
      await room.save();

      if (voucherDoc) {
        voucherDoc.usedCount += 1;
        await voucherDoc.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Khởi tạo đơn đặt phòng thành công',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current customer's bookings
// @route GET /api/bookings/my-bookings
const getMyBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = { customer: req.user.id };
    if (status && status !== 'all') query.status = status;

    const bookings = await Booking.find(query)
      .populate('hotel', 'name address district coverImage phone')
      .populate('room', 'name type bedType coverImage')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc Get hotelier's bookings
// @route GET /api/bookings/hotelier
const getHotelierBookings = async (req, res, next) => {
  try {
    const { hotelId, status, search } = req.query;
    let hotelFilter = {};

    if (req.user.role === 'hotelier') {
      const hotels = await Hotel.find({ owner: req.user.id, isDeleted: false });
      const hotelIds = hotels.map(h => h._id);
      hotelFilter.hotel = { $in: hotelIds };
    }

    if (hotelId) hotelFilter.hotel = hotelId;
    if (status && status !== 'all') hotelFilter.status = status;

    if (search) {
      hotelFilter.$or = [
        { bookingCode: { $regex: search, $options: 'i' } },
        { 'guestInfo.name': { $regex: search, $options: 'i' } },
        { 'guestInfo.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(hotelFilter)
      .populate('hotel', 'name address district')
      .populate('room', 'name type')
      .populate('customer', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc Get booking by code or id (E-ticket)
// @route GET /api/bookings/:idOrCode
const getBookingDetail = async (req, res, next) => {
  try {
    const { idOrCode } = req.params;
    let booking;

    if (idOrCode.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findById(idOrCode);
    } else {
      booking = await Booking.findOne({ bookingCode: idOrCode.toUpperCase() });
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt phòng' });
    }

    await booking.populate('hotel');
    await booking.populate('room');
    await booking.populate('customer', 'name email phone avatar');

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc Cancel booking
// @route PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn' });

    // Authorization check
    const isOwner = booking.customer.toString() === req.user.id;
    const isStaff = req.user.role === 'admin' || req.user.role === 'hotelier';
    if (!isOwner && !isStaff) {
      return res.status(403).json({ success: false, message: 'Không có quyền hủy đơn này' });
    }

    if (booking.status === 'completed' || booking.status === 'checked_in') {
      return res.status(400).json({ success: false, message: 'Không thể hủy đơn đang lưu trú hoặc đã hoàn thành' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason || 'Khách hàng yêu cầu hủy';
    await booking.save();

    // Re-increase available room count
    const room = await Room.findById(booking.room);
    if (room) {
      room.availableRooms = Math.min(room.totalRooms, room.availableRooms + booking.roomQuantity);
      await room.save();
    }

    res.json({
      success: true,
      message: 'Hủy đơn đặt phòng thành công',
      booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getHotelierBookings,
  getBookingDetail,
  cancelBooking
};
