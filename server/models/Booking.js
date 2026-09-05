const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingCode: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  nights: {
    type: Number,
    required: true,
    min: 1
  },
  roomQuantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  guestInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    adults: { type: Number, default: 2 },
    children: { type: Number, default: 0 },
    specialRequests: { type: String, default: '' }
  },
  pricing: {
    roomRate: { type: Number, required: true },
    originalTotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalTotal: { type: Number, required: true }
  },
  voucher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voucher'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['vnpay', 'momo', 'cash', 'mock'],
    default: 'mock'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show'],
    default: 'pending'
  },
  cancellationReason: {
    type: String,
    default: ''
  },
  qrCodeToken: {
    type: String,
    required: true
  },
  qrCodeDataUrl: {
    type: String
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  canReview: {
    type: Boolean,
    default: false
  },
  isReviewed: {
    type: Boolean,
    default: false
  },
  confirmationEmailSent: {
    type: Boolean,
    default: false
  },
  confirmationEmailSentAt: {
    type: Date
  },
  reminderEmailSent: {
    type: Boolean,
    default: false
  },
  reminderEmailSentAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
