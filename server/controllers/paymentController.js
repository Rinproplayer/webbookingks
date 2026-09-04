const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Room = require('../models/Room');
const Voucher = require('../models/Voucher');
const { createVNPayPaymentUrl, verifyVNPayReturn } = require('../utils/vnpay');
const { createMoMoPaymentUrl, verifyMoMoReturn } = require('../utils/momo');

// @desc Create VNPay checkout URL
// @route POST /api/payments/create-vnpay-url
const createVNPayUrl = async (req, res, next) => {
  try {
    const { bookingId, bankCode } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt phòng' });

    const paymentUrl = createVNPayPaymentUrl(req, {
      bookingCode: booking.bookingCode,
      amount: booking.pricing.finalTotal,
      bankCode: bankCode || 'NCB',
      orderInfo: `Thanh toán phòng Hostay ${booking.bookingCode}`
    });

    res.json({ success: true, paymentUrl });
  } catch (error) {
    next(error);
  }
};

// @desc Process VNPay Return callback
// @route POST /api/payments/vnpay-return
const processVNPayReturn = async (req, res, next) => {
  try {
    const result = verifyVNPayReturn(req.body);
    const booking = await Booking.findOne({ bookingCode: result.bookingCode });

    if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt phòng' });

    if (result.isSuccess) {
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      booking.paymentMethod = 'vnpay';
      await booking.save();

      // Decrement room available count if not already done
      const room = await Room.findById(booking.room);
      if (room && booking.status !== 'confirmed') {
        room.availableRooms = Math.max(0, room.availableRooms - booking.roomQuantity);
        await room.save();
      }

      // Record Payment log
      await Payment.create({
        booking: booking._id,
        user: booking.customer,
        gateway: 'vnpay',
        transactionId: result.transactionNo,
        amount: result.amount || booking.pricing.finalTotal,
        status: 'success',
        bankCode: result.bankCode,
        orderInfo: `VNPay ${booking.bookingCode}`,
        rawResponse: req.body
      });

      return res.json({ success: true, message: 'Thanh toán VNPay thành công', bookingCode: booking.bookingCode });
    } else {
      booking.paymentStatus = 'failed';
      await booking.save();
      return res.status(400).json({ success: false, message: 'Giao dịch VNPay không thành công hoặc bị hủy' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Create MoMo checkout URL
// @route POST /api/payments/create-momo-url
const createMoMoUrl = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt phòng' });

    const momoResult = createMoMoPaymentUrl({
      bookingCode: booking.bookingCode,
      amount: booking.pricing.finalTotal,
      orderInfo: `Hostay - Thanh toán đơn ${booking.bookingCode}`
    });

    res.json({ success: true, paymentUrl: momoResult.payUrl });
  } catch (error) {
    next(error);
  }
};

// @desc Process MoMo Return callback
// @route POST /api/payments/momo-return
const processMoMoReturn = async (req, res, next) => {
  try {
    const result = verifyMoMoReturn(req.body);
    const booking = await Booking.findOne({ bookingCode: result.bookingCode });

    if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt phòng' });

    if (result.isSuccess) {
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      booking.paymentMethod = 'momo';
      await booking.save();

      // Record Payment log
      await Payment.create({
        booking: booking._id,
        user: booking.customer,
        gateway: 'momo',
        transactionId: result.transactionNo,
        amount: result.amount || booking.pricing.finalTotal,
        status: 'success',
        orderInfo: `MoMo ${booking.bookingCode}`,
        rawResponse: req.body
      });

      return res.json({ success: true, message: 'Thanh toán MoMo thành công', bookingCode: booking.bookingCode });
    } else {
      booking.paymentStatus = 'failed';
      await booking.save();
      return res.status(400).json({ success: false, message: 'Giao dịch MoMo thất bại' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Mock Direct / Sandbox Instant Payment Simulation
// @route POST /api/payments/mock-checkout
const mockCheckout = async (req, res, next) => {
  try {
    const { bookingCode, method = 'mock' } = req.body;
    const booking = await Booking.findOne({ bookingCode });

    if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt phòng' });

    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.paymentMethod = method;
    await booking.save();

    // Decrement room inventory
    const room = await Room.findById(booking.room);
    if (room) {
      room.availableRooms = Math.max(0, room.availableRooms - booking.roomQuantity);
      await room.save();
    }

    // Record Payment
    await Payment.create({
      booking: booking._id,
      user: booking.customer,
      gateway: method,
      transactionId: `SIM_${Date.now()}`,
      amount: booking.pricing.finalTotal,
      status: 'success',
      orderInfo: `Simulated Sandbox Payment ${booking.bookingCode}`
    });

    res.json({
      success: true,
      message: 'Thanh toán mô phỏng thành công!',
      bookingCode: booking.bookingCode
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get payment transaction logs (Admin / Hotelier)
// @route GET /api/payments/logs
const getPaymentLogs = async (req, res, next) => {
  try {
    const logs = await Payment.find()
      .populate('booking', 'bookingCode pricing')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVNPayUrl,
  processVNPayReturn,
  createMoMoUrl,
  processMoMoReturn,
  mockCheckout,
  getPaymentLogs
};
