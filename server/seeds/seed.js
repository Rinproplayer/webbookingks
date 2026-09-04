const mongoose = require('mongoose');
const dotenv = require('dotenv');
const QRCode = require('qrcode');
const crypto = require('crypto');

dotenv.config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Destination = require('../models/Destination');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Voucher = require('../models/Voucher');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Payment = require('../models/Payment');

const seedData = async () => {
  try {
    console.log('[Seed] Starting database seeding for Hostay Da Nang...');

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

    console.log('[Seed] Created default users (admin, hotelier, customer).');

    // 2. Seed Da Nang Destinations
    const destinations = await Destination.create([
      {
        name: 'Sun World Bà Nà Hills & Cầu Vàng',
        slug: 'ba-na-hills-cau-vang',
        category: 'nature',
        district: 'Hòa Vang',
        description: 'Chốn bồng lai tiên cảnh giữa lòng Đà Nẵng với biểu tượng Cầu Vàng nâng đỡ bởi đôi bàn tay khổng lồ.',
        content: 'Bà Nà Hills nằm ở độ cao 1.487m so với mực nước biển, khí hậu mát mẻ quanh năm với 4 mùa trong một ngày. Du khách trải nghiệm tuyến cáp treo đạt nhiều kỷ lục thế giới, Làng Pháp cổ kính, Hầm rượu Debay và công viên giải trí trong nhà Fantasy Park.',
        coverImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'
        ],
        address: 'Thôn An Sơn, Xã Hòa Ninh, Huyện Hòa Vang, Đà Nẵng',
        location: { lat: 15.9986, lng: 107.9959 },
        openingHours: '07:30 - 21:00 hàng ngày',
        ticketPrice: '900.000 VNĐ (Người lớn), 750.000 VNĐ (Trẻ em)',
        bestTimeToVisit: 'Tháng 3 đến tháng 9 trời trong xanh ít mưa',
        travelTips: 'Nên chuẩn bị áo khoác nhẹ vì trên đỉnh Bà Nà nhiệt độ thấp hơn trung tâm từ 7-8 độ C.',
        isFeatured: true,
        status: 'published'
      },
      {
        name: 'Cầu Rồng Đà Nẵng & Cầu Tình Yêu',
        slug: 'cau-rong-cau-tinh-yeu',
        category: 'heritage',
        district: 'Hải Châu',
        description: 'Biểu tượng vươn mình của thành phố Đà Nẵng với màn trình diễn phun lửa và phun nước độc đáo cuối tuần.',
        content: 'Cầu Rồng bắc qua dòng sông Hàn thơ mộng dài 666m mang hình dáng rồng thời Lý. Vào mỗi 21:00 thứ Bảy và Chủ Nhật hàng tuần, cầu tổ chức trình diễn phun lửa 2 đợt và phun nước 3 đợt. Liền kề là Cầu Tình Yêu với tượng cá chép hóa rồng.',
        coverImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80'
        ],
        address: 'Đường Nguyễn Văn Linh nối Võ Văn Kiệt, Hải Châu, Đà Nẵng',
        location: { lat: 16.0611, lng: 108.2272 },
        openingHours: 'Mở cửa tự do cả ngày, phun lửa 21:00 T7 & CN',
        ticketPrice: 'Miễn phí tham quan',
        bestTimeToVisit: 'Buổi chiều hoàng hôn và buổi tối ngắm cầu lên đèn rực rỡ',
        travelTips: 'Nên chọn vị trí đứng tránh hướng gió khi rồng phun nước để không bị ướt áo.',
        isFeatured: true,
        status: 'published'
      },
      {
        name: 'Chùa Linh Ứng & Bán Đảo Sơn Trà',
        slug: 'chua-linh-ung-son-tra',
        category: 'spiritual',
        district: 'Sơn Trà',
        description: 'Ngôi chùa linh thiêng tựa lưng vào núi Sơn Trà với tượng Phật Bà Quan Âm cao 67m ngắm trọn biển Đông.',
        content: 'Chùa Linh Ứng Bãi Bụt là một trong ba ngôi chùa Linh Ứng danh tiếng của Đà Nẵng. Nơi đây sở hữu bức tượng Bồ Tát Quán Thế Âm cao nhất Việt Nam (tương đương tòa nhà 30 tầng), không gian thanh tịnh cùng cảnh quan thiên nhiên tráng lệ.',
        coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
        ],
        address: 'Hoàng Sa, Thọ Quang, Sơn Trà, Đà Nẵng',
        location: { lat: 16.1002, lng: 108.2778 },
        openingHours: '06:00 - 18:30 hàng ngày',
        ticketPrice: 'Miễn phí',
        bestTimeToVisit: 'Buổi sáng sớm đón bình minh trên biển',
        travelTips: 'Trang phục lịch sự kín đáo khi vào chánh điện.',
        isFeatured: true,
        status: 'published'
      },
      {
        name: 'Bãi Biển Mỹ Khê',
        slug: 'bai-bien-my-khe',
        category: 'beach',
        district: 'Sơn Trà',
        description: 'Tạp chí Forbes bình chọn là một trong sáu bãi biển quyến rũ nhất hành tinh với cát trắng mịn và làn nước ấm.',
        content: 'Bãi biển Mỹ Khê có chiều dài gần 10km, sóng biển êm dịu, hàng dừa xanh mát và chuỗi dịch vụ thể thao biển sôi động (cano lướt sóng, dù bay, chèo SUP, dù lượn).',
        coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
        ],
        address: 'Đường Võ Nguyên Giáp, Phường Phước Mỹ, Sơn Trà, Đà Nẵng',
        location: { lat: 16.0594, lng: 108.2467 },
        openingHours: 'Mở cửa tự do 24/7 (Cứu hộ trực 05:00 - 19:00)',
        ticketPrice: 'Miễn phí tắm biển',
        bestTimeToVisit: 'Từ tháng 4 đến tháng 9 nắng đẹp nước biển trong vắt',
        travelTips: 'Tuân thủ cờ hiệu cứu hộ và phao bơi an toàn khi tắm biển.',
        isFeatured: true,
        status: 'published'
      },
      {
        name: 'Danh Thắng Ngũ Hành Sơn & Làng Đá Non Nước',
        slug: 'danh-thang-ngu-hanh-son',
        category: 'heritage',
        district: 'Ngũ Hành Sơn',
        description: 'Quần thể 5 ngọn núi đá vôi Kim - Mộc - Thủy - Hỏa - Thổ kỳ vĩ cùng hệ thống hang động thạch nhũ huyền bí.',
        content: 'Ngũ Hành Sơn nổi tiếng với Động Huyền Không ánh nắng rọi từ vòm đá, Động Âm Phủ tái hiện 10 tầng địa ngục, cùng Chùa Tam Thai cổ kính từ thời nhà Nguyễn. Dưới chân núi là Làng nghề điêu khắc đá mỹ nghệ Non Nước hơn 300 năm tuổi.',
        coverImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80'
        ],
        address: '81 Huyền Trân Công Chúa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng',
        location: { lat: 16.0041, lng: 108.2636 },
        openingHours: '07:00 - 17:30',
        ticketPrice: '40.000 VNĐ / vé tham quan',
        bestTimeToVisit: 'Mọi thời điểm trong ngày, nên dùng thang máy kính nếu ngại leo bậc đá',
        travelTips: 'Nên đi giày thể thao chống trơn trượt khi khám phá hang động ẩm ướt.',
        isFeatured: false,
        status: 'published'
      },
      {
        name: 'Chợ Đêm Sơn Trà & Thiên Đường Ẩm Thực Đà Thành',
        slug: 'cho-dem-son-tra-am-thuc',
        category: 'cuisine',
        district: 'Sơn Trà',
        description: 'Khu chợ đêm sầm uất ngay bờ sông Hàn với hàng trăm món hải sản nướng, mỳ Quảng, bánh xèo nem lụi.',
        content: 'Chợ đêm Sơn Trà là điểm hẹn về đêm không thể bỏ qua của giới trẻ và du khách. Nơi đây quy tụ hơn 150 gian hàng ẩm thực đường phố đặc sản miền Trung, quà lưu niệm và biểu diễn nghệ thuật âm nhạc đường phố sôi nổi.',
        coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
        ],
        address: 'Đường Mai Hắc Đế giao Lý Nam Đế, An Hải Tây, Sơn Trà, Đà Nẵng',
        location: { lat: 16.0645, lng: 108.2298 },
        openingHours: '18:00 - 24:00 hàng ngày',
        ticketPrice: 'Vào cửa miễn phí',
        bestTimeToVisit: 'Từ 19:30 đến 22:00 không khí náo nhiệt nhất',
        travelTips: 'Nên thử mực nướng muối ớt, ốc hút và kem bơ dừa Đà Nẵng.',
        isFeatured: false,
        status: 'published'
      }
    ]);

    console.log(`[Seed] Created ${destinations.length} Da Nang destinations.`);

    // 3. Seed Hotels & Homestays
    const hotel1 = await Hotel.create({
      name: 'Sơn Trà Ocean Luxury Resort & Spa',
      type: 'resort',
      starRating: 5,
      owner: hotelier._id,
      address: 'Hoàng Sa, Bán đảo Sơn Trà, Đà Nẵng',
      district: 'Sơn Trà',
      phone: '0236 3999 888',
      email: 'reservation@sontraocean.hostay.vn',
      description: 'Khu nghỉ dưỡng sinh thái cao cấp nép mình giữa rừng nguyên sinh Sơn Trà và vịnh biển riêng tư trong vắt. Trải nghiệm hồ bơi vô cực ngắm hoàng hôn, spa trị liệu thảo dược và nhà hàng hải sản cao cấp.',
      amenities: ['Hồ bơi vô cực', 'Giáp biển', 'Bữa sáng buffet miễn phí', 'Xe đưa đón sân bay', 'Spa & Massage', 'Wi-Fi tốc độ cao', 'Phòng Gym', 'Quầy Bar'],
      coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80'
      ],
      policies: {
        checkInTime: '14:00',
        checkOutTime: '12:00',
        cancellationPolicy: 'Hủy miễn phí trước 48 giờ nhận phòng',
        petAllowed: false,
        childPolicy: 'Miễn phí tối đa 2 trẻ em dưới 6 tuổi ngủ chung giường với bố mẹ'
      },
      location: { lat: 16.1042, lng: 108.2652 },
      rating: { average: 4.9, count: 28, cleanliness: 5.0, location: 4.9, service: 4.9, amenities: 4.8, value: 4.7 },
      minPrice: 1850000,
      isOpen: true,
      status: 'active',
      isFeatured: true
    });

    const hotel2 = await Hotel.create({
      name: 'Hải Châu Riverfront Grand Hotel',
      type: 'hotel',
      starRating: 4,
      owner: hotelier._id,
      address: '228 Bạch Đằng, Phường Phước Ninh, Hải Châu, Đà Nẵng',
      district: 'Hải Châu',
      phone: '0236 3888 777',
      email: 'booking@haichauriverfront.hostay.vn',
      description: 'Nằm ngay đại lộ Bạch Đằng ven sông Hàn danh giá, tầm nhìn trực diện Cầu Rồng và Cầu Sông Hàn. Vị trí trung tâm thuận tiện dạo bộ phố đi bộ, chợ Hàn và các tụ điểm giải trí sầm uất.',
      amenities: ['View sông Hàn & Cầu Rồng', 'Hồ bơi tầng thượng', 'Bữa sáng miễn phí', 'Bãi đỗ xe ô tô', 'Thang máy', 'Wi-Fi miễn phí', 'Nhà hàng Á - Âu'],
      coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
      ],
      policies: {
        checkInTime: '14:00',
        checkOutTime: '12:00',
        cancellationPolicy: 'Hủy miễn phí trước 24 giờ nhận phòng',
        petAllowed: false,
        childPolicy: 'Trẻ em dưới 6 tuổi miễn phí'
      },
      location: { lat: 16.0648, lng: 108.2235 },
      rating: { average: 4.7, count: 45, cleanliness: 4.8, location: 5.0, service: 4.7, amenities: 4.6, value: 4.6 },
      minPrice: 950000,
      isOpen: true,
      status: 'active',
      isFeatured: true
    });

    const hotel3 = await Hotel.create({
      name: 'Mỹ Khê Sea Breeze Boutique Homestay',
      type: 'homestay',
      starRating: 3,
      owner: hotelier._id,
      address: '45 Hà Bổng, Phước Mỹ, Sơn Trà, Đà Nẵng',
      district: 'Sơn Trà',
      phone: '0905 333 222',
      email: 'seabreeze.mykhe@hostay.vn',
      description: 'Homestay phong cách Địa Trung Hải trẻ trung, chỉ cách bãi tắm Mỹ Khê 2 phút đi bộ. Cung cấp dịch vụ cho thuê xe máy giá rẻ, bếp chung tiện nghi và không gian chill sân thượng ngắm biển.',
      amenities: ['Cách biển Mỹ Khê 150m', 'Bếp nấu ăn tự do', 'Cho thuê xe máy', 'Máy giặt sấy', 'Wi-Fi tốc độ cao', 'Ban công thoáng mát'],
      coverImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
      ],
      policies: {
        checkInTime: '14:00',
        checkOutTime: '12:00',
        cancellationPolicy: 'Hủy miễn phí trước 24 giờ',
        petAllowed: true,
        childPolicy: 'Phù hợp nhóm bạn và gia đình trẻ'
      },
      location: { lat: 16.0625, lng: 108.2435 },
      rating: { average: 4.8, count: 32, cleanliness: 4.7, location: 4.9, service: 4.9, amenities: 4.6, value: 4.9 },
      minPrice: 420000,
      isOpen: true,
      status: 'active',
      isFeatured: true
    });

    const hotel4 = await Hotel.create({
      name: 'An Thượng Bohemian Eco Homestay',
      type: 'homestay',
      starRating: 3,
      owner: hotelier._id,
      address: '12 An Thượng 2, Mỹ An, Ngũ Hành Sơn, Đà Nẵng',
      district: 'Ngũ Hành Sơn',
      phone: '0935 444 555',
      email: 'anthuong.boho@hostay.vn',
      description: 'Nằm ngay trung tâm Khu phố Tây An Thượng nhộn nhịp với nhiều quán cafe nghệ thuật, quán bar và nhà hàng quốc tế. Không gian xanh eco-friendly thư thái.',
      amenities: ['Gần phố Tây An Thượng', 'Vườn cây xanh', 'Wi-Fi tốc độ cao', 'Cho thuê xe đạp miễn phí', 'Bếp chung'],
      coverImage: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80'
      ],
      policies: {
        checkInTime: '14:00',
        checkOutTime: '12:00',
        cancellationPolicy: 'Linh hoạt trước 24 giờ',
        petAllowed: true,
        childPolicy: 'Miễn phí trẻ dưới 8 tuổi'
      },
      location: { lat: 16.0495, lng: 108.2458 },
      rating: { average: 4.6, count: 19, cleanliness: 4.6, location: 4.8, service: 4.7, amenities: 4.5, value: 4.7 },
      minPrice: 380000,
      isOpen: true,
      status: 'active',
      isFeatured: false
    });

    console.log(`[Seed] Created 4 hotels/homestays.`);

    // 4. Seed Rooms for each property
    // Hotel 1 Rooms
    const r1 = await Room.create({
      hotel: hotel1._id,
      name: 'Phòng Deluxe Ocean View Ban Công Riêng',
      type: 'Deluxe',
      standardGuests: 2,
      maxGuests: 3,
      roomSize: 42,
      bedType: '1 Giường đôi King size cực lớn',
      pricePerNight: 1850000,
      weekendPrice: 2150000,
      diffFestivalPrice: 2450000,
      totalRooms: 8,
      availableRooms: 6,
      amenities: ['Ban công view biển 100%', 'Bồn tắm nằm cao cấp', 'Điều hòa 2 chiều', 'Tivi thông minh 55 inch', 'Mini-bar & Máy pha cà phê', 'Áo choàng tắm & Két sắt an toàn'],
      coverImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
      ]
    });

    const r2 = await Room.create({
      hotel: hotel1._id,
      name: 'Biệt Thự Suite Gia Đình Hướng Vườn & Biển',
      type: 'Suite',
      standardGuests: 4,
      maxGuests: 5,
      roomSize: 78,
      bedType: '2 Giường King + 1 Sofa bed',
      pricePerNight: 3600000,
      weekendPrice: 4100000,
      diffFestivalPrice: 4600000,
      totalRooms: 4,
      availableRooms: 3,
      amenities: ['Phòng khách riêng biệt', 'Hồ bơi mini plunge pool', 'Bếp mở hiện đại', 'Bồn tắm massage Jacuzzi', 'Bữa sáng phục vụ tại phòng'],
      coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80']
    });

    // Hotel 2 Rooms
    const r3 = await Room.create({
      hotel: hotel2._id,
      name: 'Phòng Superior Hướng Cầu Rồng Sông Hàn',
      type: 'Superior',
      standardGuests: 2,
      maxGuests: 2,
      roomSize: 32,
      bedType: '1 Giường đôi Queen size hoặc 2 giường đơn',
      pricePerNight: 950000,
      weekendPrice: 1150000,
      diffFestivalPrice: 1650000, // Giá mùa pháo hoa DIFF
      totalRooms: 12,
      availableRooms: 10,
      amenities: ['View ngắm trực diện Cầu Rồng phun lửa', 'Cửa sổ kính Low-E cách âm', 'Bàn làm việc', 'Nước suối miễn phí', 'Tủ lạnh mini'],
      coverImage: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80']
    });

    const r4 = await Room.create({
      hotel: hotel2._id,
      name: 'Phòng Executive Suite Panorama Sông Hàn',
      type: 'Suite',
      standardGuests: 2,
      maxGuests: 3,
      roomSize: 55,
      bedType: '1 Giường King cao cấp',
      pricePerNight: 1650000,
      weekendPrice: 1950000,
      diffFestivalPrice: 2600000,
      totalRooms: 6,
      availableRooms: 5,
      amenities: ['Góc nhìn panorama 180 độ sông Hàn', 'Bồn tắm view kính ngoài trời', 'Ghế sofa thư giãn', 'Bữa sáng buffet thượng hạng'],
      coverImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80']
    });

    // Hotel 3 Rooms (Mỹ Khê Sea Breeze)
    const r5 = await Room.create({
      hotel: hotel3._id,
      name: 'Phòng Studio Balcony Gần Biển Mỹ Khê',
      type: 'Standard',
      standardGuests: 2,
      maxGuests: 2,
      roomSize: 26,
      bedType: '1 Giường đôi Queen size 1m6',
      pricePerNight: 420000,
      weekendPrice: 490000,
      diffFestivalPrice: 650000,
      totalRooms: 10,
      availableRooms: 8,
      amenities: ['Ban công đón gió biển', 'Điều hòa inverter', 'Máy sấy tóc & ấm siêu tốc', 'Nước nóng lạnh mặt trời', 'Wi-Fi 100Mbps'],
      coverImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80']
    });

    const r6 = await Room.create({
      hotel: hotel3._id,
      name: 'Phòng Gia Đình Family 2 Giường Đôi Tiện Nghi',
      type: 'Family',
      standardGuests: 4,
      maxGuests: 4,
      roomSize: 38,
      bedType: '2 Giường đôi 1m6',
      pricePerNight: 690000,
      weekendPrice: 790000,
      diffFestivalPrice: 990000,
      totalRooms: 5,
      availableRooms: 4,
      amenities: ['2 Giường ngủ êm ái', 'Bàn trà ngắm phố biển', 'Tủ lạnh 120L', 'Bếp dùng chung tầng 1'],
      coverImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80']
    });

    // Hotel 4 Rooms
    const r7 = await Room.create({
      hotel: hotel4._id,
      name: 'Phòng Boho Studio Xanh Khu Phố Tây An Thượng',
      type: 'Standard',
      standardGuests: 2,
      maxGuests: 2,
      roomSize: 24,
      bedType: '1 Giường đôi gỗ mộc',
      pricePerNight: 380000,
      weekendPrice: 450000,
      diffFestivalPrice: 550000,
      totalRooms: 8,
      availableRooms: 7,
      amenities: ['Phong cách trang trí Bohemian', 'Cửa sổ thoáng sáng', 'Đèn decor ấm cúng', 'Gần các quán pub phố Tây'],
      coverImage: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=800&q=80']
    });

    console.log(`[Seed] Created 7 room types.`);

    // 5. Seed Vouchers
    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31);

    const v1 = await Voucher.create({
      code: 'CHAODANANG2026',
      title: 'Chào Hè Đà Nẵng 2026 - Giảm 15%',
      description: 'Giảm 15% tối đa 150.000đ cho đơn đặt phòng từ 500.000đ áp dụng toàn bộ khách sạn và homestay Đà Nẵng.',
      discountType: 'percent',
      discountValue: 15,
      maxDiscount: 150000,
      minSpend: 500000,
      startDate: new Date(now.getFullYear(), 0, 1),
      endDate: endOfYear,
      totalUsageLimit: 500,
      usedCount: 24,
      isActive: true
    });

    const v2 = await Voucher.create({
      code: 'DIFF50K',
      title: 'Đại Tiệc Pháo Hoa DIFF - Giảm 50.000đ',
      description: 'Giảm ngay 50.000đ trực tiếp trên tổng đơn phòng ngắm pháo hoa bên sông Hàn.',
      discountType: 'fixed',
      discountValue: 50000,
      maxDiscount: 50000,
      minSpend: 400000,
      startDate: new Date(now.getFullYear(), 0, 1),
      endDate: endOfYear,
      totalUsageLimit: 200,
      usedCount: 15,
      isActive: true
    });

    const v3 = await Voucher.create({
      code: 'HEVIETNAM',
      title: 'Du Lịch Việt Nam - Giảm 10%',
      description: 'Ưu đãi dành cho chuyến lưu trú nghỉ dưỡng hè tại các resort và homestay Đà Nẵng.',
      discountType: 'percent',
      discountValue: 10,
      maxDiscount: 200000,
      minSpend: 800000,
      startDate: new Date(now.getFullYear(), 0, 1),
      endDate: endOfYear,
      totalUsageLimit: 300,
      usedCount: 5,
      isActive: true
    });

    const v4 = await Voucher.create({
      code: 'HOSTAYNEW',
      title: 'Thành Viên Mới Hostay - Giảm 100.000đ',
      description: 'Món quà ra mắt chào đón khách hàng lần đầu trải nghiệm đặt phòng tại Hostay Đà Nẵng.',
      discountType: 'fixed',
      discountValue: 100000,
      maxDiscount: 100000,
      minSpend: 1000000,
      startDate: new Date(now.getFullYear(), 0, 1),
      endDate: endOfYear,
      totalUsageLimit: 100,
      usedCount: 8,
      isActive: true
    });

    console.log(`[Seed] Created 4 promotion vouchers.`);

    // 6. Seed Sample Bookings & QR Codes
    // Booking 1: Completed Booking with verified review
    const bCode1 = 'HT-2026-9A82';
    const qrToken1 = crypto.randomBytes(16).toString('hex');
    const qrUrl1 = await QRCode.toDataURL(JSON.stringify({ code: bCode1, token: qrToken1 }));

    const checkInDate1 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const checkOutDate1 = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

    const booking1 = await Booking.create({
      bookingCode: bCode1,
      customer: customer._id,
      hotel: hotel1._id,
      room: r1._id,
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

    // Seed Verified Review for Booking 1
    await Review.create({
      booking: booking1._id,
      hotel: hotel1._id,
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

    // Booking 2: Checked-in Booking (Currently staying - test Check-out)
    const bCode2 = 'HT-2026-B3K7';
    const qrToken2 = crypto.randomBytes(16).toString('hex');
    const qrUrl2 = await QRCode.toDataURL(JSON.stringify({ code: bCode2, token: qrToken2 }));

    const checkInDate2 = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    const checkOutDate2 = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

    const booking2 = await Booking.create({
      bookingCode: bCode2,
      customer: customer._id,
      hotel: hotel2._id,
      room: r3._id,
      checkInDate: checkInDate2,
      checkOutDate: checkOutDate2,
      nights: 2,
      roomQuantity: 1,
      guestInfo: {
        name: 'Trần Thị Thu Khách Hàng',
        phone: '0912345678',
        email: 'customer@hostay.vn',
        adults: 2,
        children: 0,
        specialRequests: 'Nhận phòng sớm'
      },
      pricing: {
        roomRate: 950000,
        originalTotal: 1900000,
        discountAmount: 50000,
        finalTotal: 1850000
      },
      voucher: v2._id,
      paymentStatus: 'paid',
      paymentMethod: 'momo',
      status: 'checked_in',
      qrCodeToken: qrToken2,
      qrCodeDataUrl: qrUrl2,
      checkInTime: checkInDate2,
      canReview: false,
      isReviewed: false
    });

    // Booking 3: Confirmed Booking (Upcoming - ready to test Check-in QR scanning)
    const bCode3 = 'HT-2026-C8V1';
    const qrToken3 = crypto.randomBytes(16).toString('hex');
    const qrUrl3 = await QRCode.toDataURL(JSON.stringify({ code: bCode3, token: qrToken3 }));

    const checkInDate3 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const checkOutDate3 = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);

    const booking3 = await Booking.create({
      bookingCode: bCode3,
      customer: customer._id,
      hotel: hotel3._id,
      room: r5._id,
      checkInDate: checkInDate3,
      checkOutDate: checkOutDate3,
      nights: 2,
      roomQuantity: 1,
      guestInfo: {
        name: 'Trần Thị Thu Khách Hàng',
        phone: '0912345678',
        email: 'customer@hostay.vn',
        adults: 2,
        children: 0,
        specialRequests: 'Thuê 1 xe máy tay ga tại homestay'
      },
      pricing: {
        roomRate: 420000,
        originalTotal: 840000,
        discountAmount: 0,
        finalTotal: 840000
      },
      paymentStatus: 'paid',
      paymentMethod: 'vnpay',
      status: 'confirmed',
      qrCodeToken: qrToken3,
      qrCodeDataUrl: qrUrl3,
      canReview: false,
      isReviewed: false
    });

    console.log(`[Seed] Created 3 sample bookings with QR codes.`);
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
