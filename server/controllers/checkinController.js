const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

// @desc Lookup booking for receptionist (by QR token, bookingCode or phone)
// @route POST /api/checkin/lookup
const lookupBooking = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mã vé hoặc token quét QR' });

    let booking;
    // Check if query is JSON from QR code
    let parsedCode = query;
    try {
      const parsed = JSON.parse(query);
      if (parsed.code) parsedCode = parsed.code;
    } catch (e) {
      // not JSON, use as-is
    }

    booking = await Booking.findOne({
      $or: [
        { bookingCode: parsedCode.toUpperCase() },
        { qrCodeToken: parsedCode },
        { 'guestInfo.phone': parsedCode }
      ]
    })
      .populate('hotel')
      .populate('room')
      .populate('customer', 'name email phone avatar');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin đơn đặt phòng tương ứng' });
    }

    // Check hotelier ownership if role is hotelier
    if (req.user.role === 'hotelier' && booking.hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Đơn đặt này không thuộc khách sạn do bạn quản lý' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc Confirm Check-in (Receptionist)
// @route POST /api/checkin/confirm-in
const confirmCheckIn = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate('hotel');

    if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt phòng' });

    if (req.user.role === 'hotelier' && booking.hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Không có quyền thao tác trên cơ sở này' });
    }

    if (booking.status === 'checked_in') {
      return res.status(400).json({ success: false, message: 'Khách đã làm thủ tục nhận phòng trước đó' });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: `Đơn phòng đang ở trạng thái ${booking.status}, không thể Check-in` });
    }

    booking.status = 'checked_in';
    booking.checkInTime = new Date();
    await booking.save();

    res.json({
      success: true,
      message: `Xác nhận Check-in thành công cho khách hàng ${booking.guestInfo.name}!`,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc Confirm Check-out (Receptionist)
// @route POST /api/checkin/confirm-out
const confirmCheckOut = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate('hotel');

    if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt phòng' });

    if (req.user.role === 'hotelier' && booking.hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Không có quyền thao tác' });
    }

    if (booking.status !== 'checked_in' && booking.status !== 'confirmed') {
      return res.status(400).json({ success: false, message: 'Chỉ có thể Check-out đơn đang lưu trú hoặc đã xác nhận' });
    }

    booking.status = 'completed';
    booking.checkOutTime = new Date();
    booking.canReview = true; // Activate review permission for the guest
    await booking.save();

    // Release room inventory (room returns to available/cleaning)
    const room = await Room.findById(booking.room);
    if (room) {
      room.availableRooms = Math.min(room.totalRooms, room.availableRooms + booking.roomQuantity);
      await room.save();
    }

    res.json({
      success: true,
      message: `Xác nhận Check-out thành công cho phòng ${booking.bookingCode}. Đã kích hoạt quyền gửi đánh giá cho du khách.`,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc Mark No-Show
// @route POST /api/checkin/no-show
const markNoShow = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate('hotel');

    if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt phòng' });

    booking.status = 'no_show';
    await booking.save();

    // Free room inventory
    const room = await Room.findById(booking.room);
    if (room) {
      room.availableRooms = Math.min(room.totalRooms, room.availableRooms + booking.roomQuantity);
      await room.save();
    }

    res.json({ success: true, message: 'Đã ghi nhận khách vắng mặt (No-show) và giải phóng phòng', booking });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  lookupBooking,
  confirmCheckIn,
  confirmCheckOut,
  markNoShow
};
