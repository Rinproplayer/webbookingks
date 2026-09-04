const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tiêu đề banner'],
    trim: true
  },
  highlightText: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: 'NỀN TẢNG ĐẶT PHÒNG CHUYÊN BIỆT ĐÀ NẴNG 2026'
  },
  imageUrl: {
    type: String,
    required: [true, 'Vui lòng tải ảnh banner']
  },
  linkUrl: {
    type: String,
    default: '/hotels'
  },
  ctaText: {
    type: String,
    default: 'Khám phá ngay'
  },
  position: {
    type: String,
    enum: ['hero', 'promo', 'sidebar'],
    default: 'hero'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Banner', bannerSchema);
