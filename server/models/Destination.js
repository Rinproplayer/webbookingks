const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên điểm du lịch'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  category: {
    type: String,
    enum: ['beach', 'heritage', 'spiritual', 'nature', 'cuisine'],
    required: true,
    default: 'nature'
  },
  district: {
    type: String,
    enum: ['Hải Châu', 'Sơn Trà', 'Ngũ Hành Sơn', 'Thanh Khê', 'Liên Chiểu', 'Cẩm Lệ', 'Hòa Vang', 'Hoàng Sa'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả ngắn']
  },
  content: {
    type: String,
    required: [true, 'Vui lòng nhập nội dung cẩm nang chi tiết']
  },
  images: [{
    type: String
  }],
  coverImage: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  openingHours: {
    type: String,
    default: '07:00 - 21:00'
  },
  ticketPrice: {
    type: String,
    default: 'Miễn phí'
  },
  bestTimeToVisit: {
    type: String,
    default: 'Tháng 3 - Tháng 9'
  },
  travelTips: {
    type: String,
    default: ''
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'hidden'],
    default: 'published'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Auto generate slug
destinationSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
  }
  next();
});

module.exports = mongoose.model('Destination', destinationSchema);
