const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên hạng phòng'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Standard', 'Superior', 'Deluxe', 'Suite', 'Family', 'Dorm', 'Villa', 'Studio'],
    default: 'Deluxe'
  },
  standardGuests: {
    type: Number,
    required: true,
    default: 2
  },
  maxGuests: {
    type: Number,
    required: true,
    default: 2
  },
  roomSize: {
    type: Number, // in m2
    required: true,
    default: 28
  },
  bedType: {
    type: String,
    required: true,
    default: '1 Giường đôi King size'
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Vui lòng nhập giá phòng / đêm'],
    min: 0
  },
  weekendPrice: {
    type: Number,
    default: 0 // If 0, uses pricePerNight
  },
  diffFestivalPrice: {
    type: Number,
    default: 0 // Special rate for DIFF festival season
  },
  totalRooms: {
    type: Number,
    required: true,
    default: 5
  },
  availableRooms: {
    type: Number,
    required: true,
    default: 5
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
  isLocked: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);
