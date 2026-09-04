const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên khách sạn / homestay'],
    trim: true
  },
  type: {
    type: String,
    enum: ['hotel', 'homestay', 'resort', 'apartment'],
    default: 'hotel'
  },
  starRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    type: String,
    required: [true, 'Vui lòng nhập địa chỉ']
  },
  district: {
    type: String,
    enum: ['Hải Châu', 'Sơn Trà', 'Ngũ Hành Sơn', 'Thanh Khê', 'Liên Chiểu', 'Cẩm Lệ', 'Hòa Vang'],
    required: true
  },
  phone: {
    type: String,
    required: [true, 'Vui lòng nhập số điện thoại lễ tân']
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email']
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả khách sạn']
  },
  amenities: [{
    type: String
  }],
  images: [{
    type: String
  }],
  coverImage: {
    type: String,
    required: true
  },
  policies: {
    checkInTime: { type: String, default: '14:00' },
    checkOutTime: { type: String, default: '12:00' },
    cancellationPolicy: { type: String, default: 'Hủy miễn phí trước 24 giờ nhận phòng' },
    petAllowed: { type: Boolean, default: false },
    childPolicy: { type: String, default: 'Trẻ em dưới 6 tuổi ở miễn phí cùng bố mẹ' }
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  rating: {
    average: { type: Number, default: 4.8 },
    count: { type: Number, default: 0 },
    cleanliness: { type: Number, default: 4.8 },
    location: { type: Number, default: 4.9 },
    service: { type: Number, default: 4.8 },
    amenities: { type: Number, default: 4.7 },
    value: { type: Number, default: 4.8 }
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'blocked'],
    default: 'active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  minPrice: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate rooms
hotelSchema.virtual('rooms', {
  ref: 'Room',
  localField: '_id',
  foreignField: 'hotel',
  justOne: false
});

module.exports = mongoose.model('Hotel', hotelSchema);
