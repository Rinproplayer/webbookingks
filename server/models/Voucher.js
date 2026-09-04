const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Vui lòng nhập mã voucher'],
    unique: true,
    uppercase: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tiêu đề khuyến mãi']
  },
  description: {
    type: String,
    default: ''
  },
  discountType: {
    type: String,
    enum: ['percent', 'fixed'],
    required: true,
    default: 'percent'
  },
  discountValue: {
    type: Number,
    required: true,
    min: 1
  },
  maxDiscount: {
    type: Number,
    default: 0 // 0 means no cap for percentage
  },
  minSpend: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  totalUsageLimit: {
    type: Number,
    default: 100
  },
  usedCount: {
    type: Number,
    default: 0
  },
  userUsageLimit: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Voucher', voucherSchema);
