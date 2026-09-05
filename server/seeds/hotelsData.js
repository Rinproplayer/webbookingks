module.exports = [
  {
    hotel: {
      name: 'Sơn Trà Ocean Luxury Resort & Spa',
      type: 'resort',
      starRating: 5,
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
    },
    rooms: [
      {
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
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        name: 'Biệt Thự 1 Phòng Ngủ Hồ Bơi Riêng',
        type: 'Villa',
        standardGuests: 2,
        maxGuests: 4,
        roomSize: 85,
        bedType: '1 Giường King lớn + 1 Sofa bed',
        pricePerNight: 3950000,
        weekendPrice: 4500000,
        diffFestivalPrice: 5200000,
        totalRooms: 4,
        availableRooms: 3,
        amenities: ['Hồ bơi vô cực riêng tư', 'Sân vườn riêng', 'Phòng khách sang trọng', 'Bếp nướng BBQ ngoài trời', 'Dịch vụ phục vụ bữa sáng tại hồ bơi'],
        coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    hotel: {
      name: 'Hải Châu Riverfront Grand Hotel',
      type: 'hotel',
      starRating: 4,
      address: '228 Bạch Đằng, Phường Phước Ninh, Hải Châu, Đà Nẵng',
      district: 'Hải Châu',
      phone: '0236 3888 777',
      email: 'booking@haichauriverfront.hostay.vn',
      description: 'Nằm ngay đại lộ Bạch Đằng ven sông Hàn danh giá, tầm nhìn trực diện Cầu Rồng và Cầu Sông Hàn. Vị trí trung tâm thuận tiện dạo bộ phố đi bộ, chợ Hàn và các tụ điểm giải trí sầm uất.',
      amenities: ['View sông Hàn & Cầu Rồng', 'Hồ bơi tầng thượng', 'Bữa sáng miễn phí', 'Bãi đỗ xe ô tô', 'Thang máy', 'Wi-Fi miễn phí', 'Nhà hàng Á - Âu'],
      coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
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
    },
    rooms: [
      {
        name: 'Phòng Superior City & River View Cầu Rồng',
        type: 'Superior',
        standardGuests: 2,
        maxGuests: 2,
        roomSize: 32,
        bedType: '1 Giường đôi Queen size hoặc 2 giường đơn',
        pricePerNight: 950000,
        weekendPrice: 1150000,
        diffFestivalPrice: 1350000,
        totalRooms: 12,
        availableRooms: 9,
        amenities: ['Cửa kính lớn ngắm Cầu Rồng', 'Smart TV 50 inch', 'Bàn làm việc doanh nhân', 'Bồn tắm đứng vòi sen tia nước', 'Miễn phí trà và cà phê'],
        coverImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        name: 'Phòng Executive Suite Ban Công Cầu Sông Hàn',
        type: 'Suite',
        standardGuests: 2,
        maxGuests: 3,
        roomSize: 55,
        bedType: '1 Giường đôi King size hoàng gia',
        pricePerNight: 1650000,
        weekendPrice: 1950000,
        diffFestivalPrice: 2250000,
        totalRooms: 6,
        availableRooms: 5,
        amenities: ['Ban công riêng ngắm sông Hàn', 'Bồn tắm massage Jacuzzi', 'Phòng khách riêng biệt', 'Quầy bar mini cao cấp'],
        coverImage: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    hotel: {
      name: 'Mỹ Khê Sea Breeze Boutique Homestay',
      type: 'homestay',
      starRating: 3,
      address: '45 Hà Bổng, Phước Mỹ, Sơn Trà, Đà Nẵng',
      district: 'Sơn Trà',
      phone: '0905 333 222',
      email: 'seabreeze.mykhe@hostay.vn',
      description: 'Homestay phong cách Địa Trung Hải trẻ trung, chỉ cách bãi tắm Mỹ Khê 2 phút đi bộ. Cung cấp dịch vụ cho thuê xe máy giá rẻ, bếp chung tiện nghi và không gian chill sân thượng ngắm biển.',
      amenities: ['Cách biển Mỹ Khê 150m', 'Bếp nấu ăn tự do', 'Cho thuê xe máy', 'Máy giặt sấy', 'Wi-Fi tốc độ cao', 'Ban công thoáng mát'],
      coverImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
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
    },
    rooms: [
      {
        name: 'Phòng Đôi Ban Công View Biển Mỹ Khê',
        type: 'Standard',
        standardGuests: 2,
        maxGuests: 2,
        roomSize: 26,
        bedType: '1 Giường đôi 1m6 x 2m',
        pricePerNight: 420000,
        weekendPrice: 480000,
        diffFestivalPrice: 580000,
        totalRooms: 8,
        availableRooms: 5,
        amenities: ['Ban công thoáng mát', 'Điều hòa Inverter', 'Máy nước nóng', 'Tủ lạnh mini', 'Máy sấy tóc & Đồ vệ sinh cá nhân'],
        coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    hotel: {
      name: 'An Thượng Bohemian Eco Homestay',
      type: 'homestay',
      starRating: 3,
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
    },
    rooms: [
      {
        name: 'Phòng Studio Bohemian Ban Công Xanh',
        type: 'Studio',
        standardGuests: 2,
        maxGuests: 3,
        roomSize: 30,
        bedType: '1 Giường đôi Queen + Đệm phụ',
        pricePerNight: 380000,
        weekendPrice: 430000,
        diffFestivalPrice: 520000,
        totalRooms: 6,
        availableRooms: 4,
        amenities: ['Trang trí phong cách Bohemian', 'Góc đọc sách thư giãn', 'Cây xanh thanh lọc không khí', 'Gương led sống ảo'],
        coverImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    hotel: {
      name: 'InterContinental Danang Sun Peninsula Resort',
      type: 'resort',
      starRating: 5,
      address: 'Bãi Bắc, Bán đảo Sơn Trà, Đà Nẵng',
      district: 'Sơn Trà',
      phone: '0236 3938 888',
      email: 'danang.reservations@ihg.com',
      description: 'Kiệt tác nghỉ dưỡng 5 sao do kiến trúc sư huyền thoại Bill Bensley thiết kế trải dài qua 4 tầng địa hình Thiên đường, Bầu trời, Trái đất và Biển cả. Sở hữu bãi biển riêng tư tuyệt mỹ cùng nhà hàng La Maison 1888 danh giá Michelin.',
      amenities: ['Bãi biển riêng tư', 'Cáp treo Nam Tram ngắm biển', 'Bể bơi vô cực ngắm vịnh', 'Michelin Guide Restaurant', 'Harnn Heritage Spa', 'Xe đưa đón sang trọng', 'Sân tennis & Phòng Gym'],
      coverImage: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80'
      ],
      policies: {
        checkInTime: '15:00',
        checkOutTime: '12:00',
        cancellationPolicy: 'Hủy miễn phí trước 72 giờ',
        petAllowed: false,
        childPolicy: 'Miễn phí 1 trẻ em dưới 12 tuổi ngủ cùng giường'
      },
      location: { lat: 16.1215, lng: 108.3075 },
      rating: { average: 5.0, count: 68, cleanliness: 5.0, location: 5.0, service: 5.0, amenities: 5.0, value: 4.9 },
      minPrice: 8500000,
      isOpen: true,
      status: 'active',
      isFeatured: true
    },
    rooms: [
      {
        name: 'Classic Panoramic Ocean View Terrace',
        type: 'Suite',
        standardGuests: 2,
        maxGuests: 3,
        roomSize: 70,
        bedType: '1 Giường đôi King size hoàng gia',
        pricePerNight: 8500000,
        weekendPrice: 9800000,
        diffFestivalPrice: 11500000,
        totalRooms: 10,
        availableRooms: 7,
        amenities: ['Ban công view trọn vịnh Bãi Bắc', 'Bồn tắm đá cẩm thạch nguyên khối', 'Máy pha cà phê Illy & Trà thượng hạng', 'Tủ lạnh rượu vang', 'Loa Bose Bluetooth'],
        coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        name: 'Sun Peninsula 2-Bedroom Seaside Villa Hồ Bơi Riêng',
        type: 'Villa',
        standardGuests: 4,
        maxGuests: 6,
        roomSize: 240,
        bedType: '2 Giường King size siêu lớn',
        pricePerNight: 24000000,
        weekendPrice: 28000000,
        diffFestivalPrice: 32000000,
        totalRooms: 3,
        availableRooms: 2,
        amenities: ['Hồ bơi vô cực riêng tư', 'Bãi biển riêng sát mép sóng', 'Quản gia phục vụ 24/7', 'Bếp ăn riêng & Phòng khách xa hoa', 'Bồn sục Jacuzzi ngoài trời'],
        coverImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    hotel: {
      name: 'Novotel Danang Premier Han River',
      type: 'hotel',
      starRating: 5,
      address: '36 Bạch Đằng, Thạch Thang, Hải Châu, Đà Nẵng',
      district: 'Hải Châu',
      phone: '0236 3929 999',
      email: 'H8287-RE@accor.com',
      description: 'Khách sạn 5 sao cao cấp bên bờ tây sông Hàn với Sky36 bar trên tầng thượng cao nhất Đà Nẵng. Vị trí đắc địa ngay trung tâm hành chính, thuận tiện khám phá ẩm thực và phố đêm Đà Nẵng.',
      amenities: ['Sky36 Rooftop Bar', 'Hồ bơi vô cực view sông Hàn', 'Phòng Gym InBalance', 'Nhà hàng quốc tế The Square', 'Khu vui chơi trẻ em Kid Club', 'Bãi đậu xe ô tô'],
      coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      ],
      policies: {
        checkInTime: '14:00',
        checkOutTime: '12:00',
        cancellationPolicy: 'Hủy miễn phí trước 24 giờ',
        petAllowed: false,
        childPolicy: 'Miễn phí trẻ em dưới 6 tuổi'
      },
      location: { lat: 16.0760, lng: 108.2238 },
      rating: { average: 4.8, count: 52, cleanliness: 4.9, location: 5.0, service: 4.8, amenities: 4.8, value: 4.6 },
      minPrice: 2200000,
      isOpen: true,
      status: 'active',
      isFeatured: true
    },
    rooms: [
      {
        name: 'Superior King Bed View Toàn Cảnh Sông Hàn',
        type: 'Superior',
        standardGuests: 2,
        maxGuests: 3,
        roomSize: 38,
        bedType: '1 Giường đôi King size',
        pricePerNight: 2200000,
        weekendPrice: 2500000,
        diffFestivalPrice: 2900000,
        totalRooms: 15,
        availableRooms: 12,
        amenities: ['Cửa kính chạm sàn view Cầu Sông Hàn', 'Bồn tắm đứng vòi sen nhiệt đới', 'Smart TV 55 inch', 'Bàn làm việc tiện nghi', 'Minibar & Két sắt'],
        coverImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        name: 'Executive Suite Ban Công Cầu Thuận Phước',
        type: 'Suite',
        standardGuests: 2,
        maxGuests: 4,
        roomSize: 65,
        bedType: '1 Giường King lớn + Sofa Bed',
        pricePerNight: 3600000,
        weekendPrice: 4100000,
        diffFestivalPrice: 4800000,
        totalRooms: 6,
        availableRooms: 5,
        amenities: ['Ban công riêng ngắm vịnh Đà Nẵng', 'Đặc quyền Executive Lounge & Trà chiều miễn phí', 'Bồn tắm nằm ngắm cảnh đêm', 'Máy pha cafe Nespresso'],
        coverImage: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    hotel: {
      name: 'TMS Hotel Danang Beach',
      type: 'hotel',
      starRating: 5,
      address: '292 Võ Nguyên Giáp, Mỹ An, Ngũ Hành Sơn, Đà Nẵng',
      district: 'Ngũ Hành Sơn',
      phone: '0236 3755 999',
      email: 'reservation@tmshoteldanang.com',
      description: 'Tọa lạc đối diện bãi biển Mỹ Khê xinh đẹp với hồ bơi vô cực đáy kính tầng 25 ngoạn mục. Thiết kế trẻ trung, hiện đại với chuỗi nhà hàng Á - Âu và dịch vụ Mel Spa chuẩn quốc tế.',
      amenities: ['Hồ bơi vô cực tầng 25', 'Trực diện biển Mỹ Khê', 'Bữa sáng Buffet phong phú', 'Mel Spa & Sauna', 'Magic Lounge tầng thượng', 'Xe đạp miễn phí'],
      coverImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80'
      ],
      policies: {
        checkInTime: '14:00',
        checkOutTime: '12:00',
        cancellationPolicy: 'Hủy miễn phí trước 48 giờ',
        petAllowed: false,
        childPolicy: 'Miễn phí tối đa 2 trẻ em dưới 6 tuổi'
      },
      location: { lat: 16.0505, lng: 108.2468 },
      rating: { average: 4.9, count: 41, cleanliness: 4.9, location: 5.0, service: 4.8, amenities: 4.9, value: 4.8 },
      minPrice: 1650000,
      isOpen: true,
      status: 'active',
      isFeatured: true
    },
    rooms: [
      {
        name: 'Premier Suite Ocean Front Ban Công Biển Mỹ Khê',
        type: 'Suite',
        standardGuests: 2,
        maxGuests: 3,
        roomSize: 45,
        bedType: '1 Giường đôi King size',
        pricePerNight: 1650000,
        weekendPrice: 1950000,
        diffFestivalPrice: 2350000,
        totalRooms: 12,
        availableRooms: 9,
        amenities: ['Ban công ngắm trọn bình minh biển Mỹ Khê', 'Bồn tắm nằm view kính', 'Điều hòa 2 chiều', 'TV 50 inch thông minh', 'Dép đi biển & Áo choàng'],
        coverImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        name: 'Family 2-Bedroom Connecting Suite',
        type: 'Family',
        standardGuests: 4,
        maxGuests: 6,
        roomSize: 75,
        bedType: '1 Giường King + 2 Giường đơn',
        pricePerNight: 2850000,
        weekendPrice: 3300000,
        diffFestivalPrice: 3800000,
        totalRooms: 6,
        availableRooms: 4,
        amenities: ['2 phòng ngủ thông nhau tiện lợi', '2 phòng tắm riêng biệt', 'Phòng khách sinh hoạt chung', 'Khu vực bếp mini & Bàn ăn'],
        coverImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    hotel: {
      name: 'Sala Danang Beach Hotel',
      type: 'hotel',
      starRating: 4,
      address: '36 Lâm Hoành, Phước Mỹ, Sơn Trà, Đà Nẵng',
      district: 'Sơn Trà',
      phone: '0236 3658 555',
      email: 'info@saladanangbeach.com',
      description: 'Khách sạn 4 sao cao cấp chỉ cách bãi tắm Mỹ Khê 100 mét. Nổi tiếng với hồ bơi vô cực trên tầng 25, ẩm thực buffet sáng phong phú và dịch vụ tận tâm.',
      amenities: ['Hồ bơi vô cực tầng 25', 'Cách bãi biển 100m', 'Phòng Gym & Yoga', 'Nhà hàng Sala Restaurant', 'Quầy bar tầng thượng', 'Wi-Fi cực nhanh'],
      coverImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
      ],
      policies: {
        checkInTime: '14:00',
        checkOutTime: '12:00',
        cancellationPolicy: 'Linh hoạt trước 24 giờ',
        petAllowed: false,
        childPolicy: 'Trẻ em dưới 6 tuổi miễn phí'
      },
      location: { lat: 16.0620, lng: 108.2440 },
      rating: { average: 4.8, count: 37, cleanliness: 4.8, location: 4.9, service: 4.8, amenities: 4.7, value: 4.8 },
      minPrice: 1150000,
      isOpen: true,
      status: 'active',
      isFeatured: false
    },
    rooms: [
      {
        name: 'Deluxe King Room Ban Công Hướng Biển',
        type: 'Deluxe',
        standardGuests: 2,
        maxGuests: 3,
        roomSize: 35,
        bedType: '1 Giường đôi King size',
        pricePerNight: 1150000,
        weekendPrice: 1350000,
        diffFestivalPrice: 1650000,
        totalRooms: 14,
        availableRooms: 10,
        amenities: ['Ban công hướng biển thoáng mát', 'Bồn tắm đứng hiện đại', 'Smart TV kết nối Netflix/Youtube', 'Két sắt an toàn', 'Bình đun siêu tốc & Trà miễn phí'],
        coverImage: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    hotel: {
      name: 'Furama Resort Danang',
      type: 'resort',
      starRating: 5,
      address: '105 Võ Nguyên Giáp, Khuê Mỹ, Ngũ Hành Sơn, Đà Nẵng',
      district: 'Ngũ Hành Sơn',
      phone: '0236 3847 333',
      email: 'reservation@furamavietnam.com',
      description: 'Biểu tượng nghỉ dưỡng di sản 5 sao đầu tiên của miền Trung Việt Nam. Khu nghỉ dưỡng phong cách Champa giao thoa kiến trúc Pháp nép mình bên hồ bơi ốc đảo giữa rừng nhiệt đới trù phú.',
      amenities: ['Hồ bơi ốc đảo nhiệt đới Lagoon', 'Bãi biển Bắc Mỹ An riêng biệt', 'Nhà hàng bò Wagyu cao cấp', 'Khu thể thao biển & Lặn bình dưỡng khí', 'Spa thảo mộc di sản'],
      coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
      ],
      policies: {
        checkInTime: '14:00',
        checkOutTime: '12:00',
        cancellationPolicy: 'Hủy miễn phí trước 48 giờ',
        petAllowed: false,
        childPolicy: 'Miễn phí tối đa 2 trẻ em dưới 12 tuổi'
      },
      location: { lat: 16.0380, lng: 108.2480 },
      rating: { average: 4.9, count: 58, cleanliness: 4.9, location: 4.9, service: 5.0, amenities: 4.9, value: 4.8 },
      minPrice: 3450000,
      isOpen: true,
      status: 'active',
      isFeatured: true
    },
    rooms: [
      {
        name: 'Garden Superior Room View Rừng Nhiệt Đới',
        type: 'Superior',
        standardGuests: 2,
        maxGuests: 3,
        roomSize: 40,
        bedType: '1 Giường đôi hoặc 2 Giường đơn',
        pricePerNight: 3450000,
        weekendPrice: 3950000,
        diffFestivalPrice: 4550000,
        totalRooms: 10,
        availableRooms: 8,
        amenities: ['Ban công gỗ nhìn ra khu vườn nhiệt đới', 'Sàn gỗ cao cấp phong cách thuộc địa', 'Bồn tắm nằm sang trọng', 'Trà & Cà phê espresso hảo hạng'],
        coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    hotel: {
      name: 'Mây Boutique Homestay & Coffee Đà Nẵng',
      type: 'homestay',
      starRating: 3,
      address: '45 Lê Thước, Phước Mỹ, Sơn Trà, Đà Nẵng',
      district: 'Sơn Trà',
      phone: '0935 777 888',
      email: 'mayhomestay.danang@gmail.com',
      description: 'Homestay phong cách mộc mạc Vintage kết hợp quán cafe check-in siêu xinh ngay tầng trệt. Nơi lưu trú bình yên, ấm cúng dành cho các bạn trẻ thích sống chậm và yêu thích chụp ảnh.',
      amenities: ['Quán Cafe Vintage tầng trệt', 'Cho thuê xe máy giá rẻ', 'Bếp nấu ăn chung đầy đủ gia vị', 'Sân thượng ngắm pháo hoa', 'Máy giặt & Bàn ủi miễn phí'],
      coverImage: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80'
      ],
      policies: {
        checkInTime: '14:00',
        checkOutTime: '12:00',
        cancellationPolicy: 'Linh hoạt trước 24 giờ',
        petAllowed: true,
        childPolicy: 'Thân thiện với thú cưng và gia đình'
      },
      location: { lat: 16.0665, lng: 108.2415 },
      rating: { average: 4.8, count: 29, cleanliness: 4.9, location: 4.7, service: 4.9, amenities: 4.6, value: 5.0 },
      minPrice: 350000,
      isOpen: true,
      status: 'active',
      isFeatured: false
    },
    rooms: [
      {
        name: 'Phòng Studio Ấm Áp Ban Công Ngập Hoa',
        type: 'Studio',
        standardGuests: 2,
        maxGuests: 2,
        roomSize: 25,
        bedType: '1 Giường đôi Queen size êm ái',
        pricePerNight: 350000,
        weekendPrice: 400000,
        diffFestivalPrice: 500000,
        totalRooms: 6,
        availableRooms: 5,
        amenities: ['Ban công ngập hoa giấy và cây xanh', 'Phòng tắm khép kín gương tròn led', 'Máy sấy tóc & Đồ vệ sinh cá nhân', 'Điều hòa êm ái'],
        coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        name: 'Phòng Gia Đình Cozy 2 Giường Đôi',
        type: 'Family',
        standardGuests: 4,
        maxGuests: 5,
        roomSize: 38,
        bedType: '2 Giường đôi Queen size',
        pricePerNight: 620000,
        weekendPrice: 700000,
        diffFestivalPrice: 850000,
        totalRooms: 4,
        availableRooms: 3,
        amenities: ['Không gian rộng rãi cho nhóm 4-5 bạn', 'Cửa sổ lớn đón ánh sáng tự nhiên', 'Tủ lạnh mini', 'Smart TV giải trí'],
        coverImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  }
];
