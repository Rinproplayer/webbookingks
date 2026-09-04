const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gateway: {
    type: String,
    enum: ['vnpay', 'momo', 'cash', 'mock'],
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending', 'refunded'],
    default: 'pending'
  },
  bankCode: {
    type: String,
    default: ''
  },
  cardType: {
    type: String,
    default: ''
  },
  orderInfo: {
    type: String,
    default: ''
  },
  rawResponse: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
