const mongoose = require('mongoose');
const dotenv = require('dotenv');
const QRCode = require('qrcode');
const crypto = require('crypto');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '/../.env') });

const User = require('../models/User');
const Destination = require('../models/Destination');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Voucher = require('../models/Voucher');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Payment = require('../models/Payment');

const destinationsData = require('./destinationsData');
const hotelsData = require('./hotelsData');

const seedData = async () => {
  try {
    console.log('[Seed] Starting comprehensive database seeding for Hostay Da Nang...');

    // Clear existing collections
    await User.deleteMany();
    await Destination.deleteMany();
    await Hotel.deleteMany();
    await Room.deleteMany();
    await Voucher.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();
    await Payment.deleteMany();

    console.log('[Seed] Cleared existing data.');

    // 1. Seed Users
    const admin = await User.create({
      name: 'Hostay Quản Trị Viên',
      email: 'admin@hostay.vn',
      password: 'Admin@123',
      phone: '0905123456',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      address: '01 Lê Duẩn, Hải Châu, Đà Nẵng'
    });

    const hotelier = await User.create({
      name: 'Nguyễn Văn Chủ Khách Sạn',
      email: 'hotelier@hostay.vn',
      password: 'Hotelier@123',
      phone: '0905888999',
      role: 'hotelier',
      partnerStatus: 'approved',
      partnerInfo: {
        businessName: 'Công ty TNHH Dịch vụ Du lịch Sơn Trà',
        taxOrIdNumber: '0401988899',
        contactPhone: '0905888999',
        address: 'Bán đảo Sơn Trà, TP Đà Nẵng',
        approvedDate: new Date()
      },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      address: 'Võ Nguyên Giáp, Sơn Trà, Đà Nẵng'
    });

    const customer = await User.create({
      name: 'Trần Thị Thu Khách Hàng',
      email: 'customer@hostay.vn',
      password: 'Customer@123',
      phone: '0912345678',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
      address: 'Hà Nội'
    });

    console.log('[Seed] Created default users.');

    // 2. Seed Destinations (12 destinations)
    const destinations = await Destination.create(destinationsData);
    console.log(`[Seed] Created ${destinations.length} Da Nang destinations.`);

    // 3. Seed Hotels and Rooms (10 hotels, 20+ rooms)
    let createdHotels = [];
    let firstHotel = null;
    let firstRoom = null;

    for (const item of hotelsData) {
      const hotel = await Hotel.create({
        ...item.hotel,
        owner: hotelier._id
      });
      createdHotels.push(hotel);
      if (!firstHotel) firstHotel = hotel;

      for (const r of item.rooms) {
        const room = await Room.create({
          ...r,
          hotel: hotel._id
        });
        if (!firstRoom) firstRoom = room;
      }
    }
    console.log(`[Seed] Created ${createdHotels.length} hotels & resorts with full rooms.`);

    // 4. Seed Promotion Vouchers
    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31);

    const v1 = await Voucher.create({
      code: 'DANANG2026',
      title: 'Chào Hè Rực Rỡ Đà Nẵng - Giảm 150.000đ',
      description: 'Mã giảm giá trực tiếp cho toàn bộ khách sạn và resort ven biển Đà Nẵng.',
      discountType: 'fixed',
      discountValue: 150000,
      maxDiscount: 150000,
      minSpend: 1500000,
      startDate: new Date(now.getFullYear(), 0, 1),
      endDate: endOfYear,
      totalUsageLimit: 500,
      usedCount: 12,
      isActive: true
    });

    const v2 = await Voucher.create({
      code: 'HOMESTAY50',
      title: 'Trải Nghiệm Homestay - Giảm 50.000đ',
      description: 'Dành riêng cho đơn đặt phòng homestay phong cách giới trẻ tại Đà Nẵng.',
      discountType: 'fixed',
      discountValue: 50000,
      maxDiscount: 50000,
      minSpend: 400000,
      startDate: new Date(now.getFullYear(), 0, 1),
      endDate: endOfYear,
      totalUsageLimit: 200,
      usedCount: 18,
      isActive: true
    });

    // 5. Seed Sample Bookings & QR Codes
    const bCode1 = 'HT-2026-9A82';
    const qrToken1 = crypto.randomBytes(16).toString('hex');
    const qrUrl1 = await QRCode.toDataURL(JSON.stringify({ code: bCode1, token: qrToken1 }));

    const checkInDate1 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const checkOutDate1 = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

    const booking1 = await Booking.create({
      bookingCode: bCode1,
      customer: customer._id,
      hotel: firstHotel._id,
      room: firstRoom._id,
      checkInDate: checkInDate1,
      checkOutDate: checkOutDate1,
      nights: 2,
      roomQuantity: 1,
      guestInfo: {
        name: 'Trần Thị Thu Khách Hàng',
        phone: '0912345678',
        email: 'customer@hostay.vn',
        adults: 2,
        children: 0,
        specialRequests: 'Yêu cầu phòng tầng cao yên tĩnh ngắm biển'
      },
      pricing: {
        roomRate: 1850000,
        originalTotal: 3700000,
        discountAmount: 150000,
        finalTotal: 3550000
      },
      voucher: v1._id,
      paymentStatus: 'paid',
      paymentMethod: 'vnpay',
      status: 'completed',
      qrCodeToken: qrToken1,
      qrCodeDataUrl: qrUrl1,
      checkInTime: checkInDate1,
      checkOutTime: checkOutDate1,
      canReview: true,
      isReviewed: true
    });

    await Review.create({
      booking: booking1._id,
      hotel: firstHotel._id,
      user: customer._id,
      ratings: {
        cleanliness: 5,
        location: 5,
        service: 5,
        amenities: 5,
        value: 5,
        overall: 5.0
      },
      comment: 'Kỳ nghỉ tuyệt vời ngoài mong đợi! Khách sạn Sơn Trà Ocean Resort có bãi biển riêng nước trong vắt, ban công phòng Deluxe view biển thơ mộng. Nhân viên lễ tân phục vụ chu đáo, thủ tục Check-in bằng mã QR trên app Hostay cực kỳ nhanh chóng chỉ mất 10 giây.',
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
      ],
      hotelierReply: {
        comment: 'Sơn Trà Ocean Luxury Resort xin chân thành cảm ơn chị Thu đã tin chọn cơ sở cho kỳ nghỉ của mình. Chúc chị và gia đình thật nhiều sức khỏe, hẹn gặp lại chị trong mùa hè tới!',
        replyDate: new Date()
      }
    });

    console.log('[Seed] Database seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('[Seed Error]', error);
    throw error;
  }
};

if (require.main === module) {
  const connectDB = require('../config/db');
  connectDB().then(async () => {
    await seedData();
    process.exit(0);
  });
}

module.exports = seedData;
