import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Check, 
  Users, 
  Maximize2, 
  Bed, 
  ShieldCheck, 
  MessageSquare, 
  Calendar,
  ArrowRight,
  Info,
  Building2,
  Camera
} from 'lucide-react';
import api from '../services/api';
import DaNangMap from '../components/DaNangMap';
import ImageLightbox from '../components/ImageLightbox';
import { formatVND, formatDate } from '../utils/formatters';

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fullscreen Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Booking selection state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [roomQuantity, setRoomQuantity] = useState(1);

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/hotels/${id}`);
        if (res.data.success) {
          setHotel(res.data.hotel);
          setReviews(res.data.reviews || []);
          if (res.data.hotel.rooms?.length > 0) {
            setSelectedRoom(res.data.hotel.rooms[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching hotel', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-xs text-slate-500 mt-2">Đang tải thông tin khách sạn...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-slate-700">Không tìm thấy khách sạn</h2>
        <Link to="/hotels" className="mt-3 inline-block text-xs font-bold text-teal-600">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  // Calculate nights
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const nights = Math.max(1, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)));

  const handleBookNow = (room) => {
    navigate('/checkout', {
      state: {
        hotel,
        room,
        checkInDate,
        checkOutDate,
        nights,
        roomQuantity
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Hotel Title & Address */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-bold rounded-lg uppercase">
            {hotel.type}
          </span>
          <div className="flex items-center text-amber-400">
            {Array.from({ length: hotel.starRating || 3 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="text-xs text-slate-400 font-semibold">• {hotel.district}, TP Đà Nẵng</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {hotel.name}
          </h1>
          <div className="flex items-center gap-2 self-start sm:self-auto bg-teal-50 px-3.5 py-1.5 rounded-2xl border border-teal-200">
            <Star className="w-4 h-4 text-teal-600 fill-teal-600" />
            <span className="text-sm font-black text-teal-900">{hotel.rating?.average || 4.8}</span>
            <span className="text-xs text-teal-700">({hotel.rating?.count || 0} đánh giá)</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
          {hotel.address}, {hotel.district}, Đà Nẵng
        </p>
      </div>

      {/* Gallery Section */}
      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-4 h-[420px]">
        <div 
          className="lg:col-span-2 h-full rounded-3xl overflow-hidden shadow-sm cursor-pointer group relative"
          onClick={() => {
            setLightboxIndex(0);
            setLightboxOpen(true);
          }}
        >
          <img src={hotel.coverImage} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
        </div>
        <div className="hidden lg:grid grid-rows-2 gap-4 h-full">
          {hotel.images && hotel.images.length > 1 ? (
            hotel.images.slice(0, 2).map((img, idx) => (
              <div 
                key={idx} 
                className="rounded-2xl overflow-hidden shadow-sm cursor-pointer group relative"
                onClick={() => {
                  setLightboxIndex(idx + 1);
                  setLightboxOpen(true);
                }}
              >
                <img src={img} alt="gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              </div>
            ))
          ) : (
            <div 
              className="row-span-2 rounded-2xl overflow-hidden shadow-sm bg-slate-100 cursor-pointer group"
              onClick={() => {
                setLightboxIndex(0);
                setLightboxOpen(true);
              }}
            >
              <img src={hotel.coverImage} alt="gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          )}
        </div>

        {/* View all photos button */}
        <button
          onClick={() => {
            setLightboxIndex(0);
            setLightboxOpen(true);
          }}
          className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-lg border border-slate-200/80 dark:border-slate-700 flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Camera className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Xem tất cả ảnh ({[hotel.coverImage, ...(hotel.images || [])].filter(Boolean).length})
        </button>
      </div>

      {/* Stay Date Bar */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-teal-300 uppercase">Thời gian lưu trú</p>
            <p className="text-xs text-slate-300">Đã chọn: <span className="font-bold text-white">{nights} đêm</span></p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-400 font-semibold">Check-in:</span>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-white outline-none"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-400 font-semibold">Check-out:</span>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* Available Rooms Section (Core booking choices) */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Chọn Phòng Lưu Trú</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Các Hạng Phòng Còn Trống</h2>
        </div>

        <div className="space-y-4">
          {hotel.rooms?.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center bg-white rounded-2xl border">
              Cơ sở này hiện chưa thiết lập danh sách phòng.
            </p>
          ) : (
            hotel.rooms.map((room) => {
              const totalPriceForStay = room.pricePerNight * nights;
              return (
                <div 
                  key={room._id} 
                  className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-sm transition-all flex flex-col lg:flex-row gap-6 ${
                    room.availableRooms === 0 || room.isLocked 
                      ? 'opacity-60 bg-slate-50 border-slate-200' 
                      : 'border-slate-200/80 hover:border-teal-400 hover:shadow-md'
                  }`}
                >
                  <div className="w-full lg:w-64 h-44 rounded-2xl overflow-hidden shrink-0">
                    <img src={room.coverImage} alt={room.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg uppercase">
                        Hạng {room.type}
                      </span>
                      {room.availableRooms > 0 && !room.isLocked ? (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          Còn {room.availableRooms} phòng trống
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-200">
                          Tạm hết phòng
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-slate-900">{room.name}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-teal-600" /> Sức chứa: {room.standardGuests} khách (Tối đa {room.maxGuests})
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-teal-600" /> Diện tích: {room.roomSize} m²
                      </span>
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-teal-600" /> {room.bedType}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {room.amenities?.map((am, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 bg-slate-50 text-slate-600 text-[10px] font-medium rounded-md border border-slate-100">
                          ✓ {am}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="lg:w-56 flex flex-col justify-between pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6 text-right lg:text-right">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Giá 1 đêm:</span>
                      <span className="text-base font-bold text-slate-800">{formatVND(room.pricePerNight)}</span>
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <span className="text-[11px] text-slate-500 block font-semibold">Tổng {nights} đêm:</span>
                        <span className="text-xl font-black text-teal-600">{formatVND(totalPriceForStay)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookNow(room)}
                      disabled={room.availableRooms === 0 || room.isLocked}
                      className="w-full mt-4 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-xs font-black rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      Đặt phòng này <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Hotel Description, Policies & Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 cols: Description & Policies */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900">Giới thiệu cơ sở lưu trú</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {hotel.description}
            </p>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Tiện ích chung</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700">
                {hotel.amenities?.map((am, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900">Chính sách & Quy định nhận phòng</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">Giờ Check-in / Check-out</p>
                <p className="text-slate-600">Nhận phòng: từ <span className="font-bold text-teal-700">{hotel.policies?.checkInTime || '14:00'}</span></p>
                <p className="text-slate-600">Trả phòng: trước <span className="font-bold text-teal-700">{hotel.policies?.checkOutTime || '12:00'}</span></p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">Chính sách hủy phòng</p>
                <p className="text-slate-600">{hotel.policies?.cancellationPolicy || 'Hủy miễn phí trước 24 giờ'}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">Quy định trẻ em</p>
                <p className="text-slate-600">{hotel.policies?.childPolicy || 'Miễn phí trẻ em dưới 6 tuổi'}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">Thú cưng</p>
                <p className="text-slate-600">{hotel.policies?.petAllowed ? 'Cho phép mang theo thú cưng' : 'Không cho phép mang theo thú cưng'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right col: Map & Contact */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" /> Vị trí trên bản đồ
            </h3>
            <p className="text-xs text-slate-500">{hotel.address}</p>
            <DaNangMap
              items={[hotel]}
              center={[hotel.location.lat, hotel.location.lng]}
              zoom={14}
              height="240px"
            />
          </div>

          <div className="bg-teal-50 p-6 rounded-3xl border border-teal-200 text-teal-900 space-y-2">
            <h3 className="text-sm font-black text-teal-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" /> Cam kết Hostay Đà Nẵng
            </h3>
            <p className="text-xs text-teal-800 leading-relaxed">
              • Giá đã bao gồm thuế phí và xuất phiếu vé điện tử có mã QR Check-in.<br />
              • Đảm bảo 100% giữ phòng khi thanh toán thành công.
            </p>
          </div>
        </div>

      </div>

      {/* Guest Reviews Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-600" /> Đánh Giá Từ Khách Lưu Trú
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Chỉ những du khách đã Check-out thực tế mới được phép gửi đánh giá.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl font-black text-teal-600">{hotel.rating?.average || 4.8} / 5</span>
              <p className="text-[11px] text-slate-400">Dựa trên {reviews.length} đánh giá xác thực</p>
            </div>
          </div>
        </div>

        {/* 5-Criteria Ratings Breakdown */}
        {hotel.rating && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">Sạch sẽ</span>
              <span className="text-sm font-black text-slate-900">{hotel.rating.cleanliness || 4.9} ★</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">Vị trí</span>
              <span className="text-sm font-black text-slate-900">{hotel.rating.location || 5.0} ★</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">Dịch vụ lễ tân</span>
              <span className="text-sm font-black text-slate-900">{hotel.rating.service || 4.8} ★</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">Tiện nghi phòng</span>
              <span className="text-sm font-black text-slate-900">{hotel.rating.amenities || 4.7} ★</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">Đáng giá tiền</span>
              <span className="text-sm font-black text-slate-900">{hotel.rating.value || 4.8} ★</span>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4 pt-2">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">Chưa có đánh giá nào cho cơ sở này.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={rev.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                      alt="user" 
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{rev.user?.name || 'Du khách Hostay'}</p>
                      <p className="text-[10px] text-slate-400">{formatDate(rev.createdAt)} • Đã lưu trú thực tế</p>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="ml-1 text-slate-800">{rev.ratings?.overall || 5}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {rev.comment}
                </p>

                {rev.images && rev.images.length > 0 && (
                  <div className="flex gap-2">
                    {rev.images.map((img, idx) => (
                      <img key={idx} src={img} alt="review attachment" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                    ))}
                  </div>
                )}

                {/* Hotelier Reply */}
                {rev.hotelierReply?.comment && (
                  <div className="mt-2 p-3 bg-teal-50 rounded-xl border border-teal-200/60 text-xs space-y-1">
                    <p className="font-bold text-teal-900 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-teal-700" /> Phản hồi từ Ban Quản Lý Khách Sạn:
                    </p>
                    <p className="text-teal-800">{rev.hotelierReply.comment}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {hotel && (
        <ImageLightbox
          images={[hotel.coverImage, ...(hotel.images || [])].filter(Boolean)}
          currentIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(idx) => setLightboxIndex(idx)}
        />
      )}
    </div>
  );
}
