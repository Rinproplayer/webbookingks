import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Compass, 
  Building2, 
  Tag, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Percent
} from 'lucide-react';
import api from '../services/api';
import { formatVND, DANANG_DISTRICTS } from '../utils/formatters';

export default function Home() {
  const navigate = useNavigate();
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [promoBanners, setPromoBanners] = useState([]);

  // Search form state
  const [searchDistrict, setSearchDistrict] = useState('all');
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
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, hotelRes, voucherRes, bannerRes] = await Promise.all([
          api.get('/destinations?featured=true'),
          api.get('/hotels?featured=true'),
          api.get('/vouchers'),
          api.get('/banners')
        ]);
        if (destRes.data.success) setFeaturedDestinations(destRes.data.destinations.slice(0, 4));
        if (hotelRes.data.success) setFeaturedHotels(hotelRes.data.hotels.slice(0, 4));
        if (voucherRes.data.success) setVouchers(voucherRes.data.vouchers.slice(0, 3));
        if (bannerRes.data.success) {
          const heroes = bannerRes.data.banners.filter(b => b.position === 'hero');
          const promos = bannerRes.data.banners.filter(b => b.position === 'promo');
          setHeroBanners(heroes);
          setPromoBanners(promos);
        }
      } catch (err) {
        console.error('Error loading home data', err);
      }
    };
    fetchData();
  }, []);

  // Auto rotate banner if multiple exist
  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveBannerIdx(prev => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroBanners]);

  const currentHero = heroBanners[activeBannerIdx] || {
    title: 'Khám phá Đà Nẵng & Đặt phòng',
    highlightText: 'Tiết Kiệm Với Check-in QR',
    subtitle: 'Kết nối trực tiếp hàng trăm khách sạn, resort ven biển Mỹ Khê và homestay sông Hàn. Không phí trung gian, nhận phòng không chạm nhanh chóng.',
    badge: 'NỀN TẢNG ĐẶT PHÒNG CHUYÊN BIỆT ĐÀ NẴNG 2026',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1920&q=80'
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchDistrict && searchDistrict !== 'all') params.append('district', searchDistrict);
    params.append('checkIn', checkInDate);
    params.append('checkOut', checkOutDate);
    params.append('guests', guests);
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <div className="relative min-h-[620px] flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Background image overlay with smooth transition */}
        <div 
          key={currentHero.imageUrl}
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-all duration-1000 animate-in fade-in"
          style={{ backgroundImage: `url('${currentHero.imageUrl}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8 z-10">
          {currentHero.badge && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              {currentHero.badge}
            </div>
          )}

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            {currentHero.title} <br className="hidden sm:inline" />
            {currentHero.highlightText && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-amber-300">
                {currentHero.highlightText}
              </span>
            )}
          </h1>

          {currentHero.subtitle && (
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              {currentHero.subtitle}
            </p>
          )}

          {/* Dots Indicator for Hero Banners */}
          {heroBanners.length > 1 && (
            <div className="flex items-center justify-center gap-2 pt-1">
              {heroBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBannerIdx(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeBannerIdx ? 'w-8 bg-teal-400' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Search Widget */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-2xl border border-slate-200/80 max-w-4xl mx-auto text-left">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* District */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 hover:border-teal-400 transition-colors">
                <label className="block text-[11px] font-bold text-slate-500 uppercase">Khu vực Đà Nẵng</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                  <select
                    value={searchDistrict}
                    onChange={(e) => setSearchDistrict(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer"
                  >
                    <option value="all">Toàn bộ Đà Nẵng</option>
                    {DANANG_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Check-in */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 hover:border-teal-400 transition-colors">
                <label className="block text-[11px] font-bold text-slate-500 uppercase">Nhận phòng</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                  <input
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Check-out */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 hover:border-teal-400 transition-colors">
                <label className="block text-[11px] font-bold text-slate-500 uppercase">Trả phòng</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                  <input
                    type="date"
                    required
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Guests & Search Button */}
              <div className="flex items-center gap-2">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 flex-1 hover:border-teal-400 transition-colors">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Khách</label>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Users className="w-4 h-4 text-teal-600 shrink-0" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer"
                    >
                      <option value={1}>1 Khách</option>
                      <option value={2}>2 Khách</option>
                      <option value={4}>4 Khách</option>
                      <option value={6}>Gia đình (6+)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="h-full px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">Tìm</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* Promotion Vouchers Banner */}
        {vouchers.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 flex items-center gap-1.5">
                  <Tag className="w-4 h-4" /> Ưu Đãi Độc Quyền
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Mã Giảm Giá Đà Nẵng Hôm Nay</h2>
              </div>
              <Link to="/hotels" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                Xem tất cả phòng áp mã <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vouchers.map((v) => (
                <div key={v._id} className="relative p-5 rounded-3xl bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-white border border-teal-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-mono font-black text-xs tracking-wider">
                        {v.code}
                      </span>
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5" />
                        {v.discountType === 'percent' ? `Giảm ${v.discountValue}%` : `Giảm ${formatVND(v.discountValue)}`}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{v.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{v.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-teal-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Đơn từ {formatVND(v.minSpend)}</span>
                    <span className="font-semibold text-teal-700">Đã dùng: {v.usedCount}/{v.totalUsageLimit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Hotels in Da Nang */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> Lưu Trú Hàng Đầu
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Khách Sạn & Homestay Nổi Bật Đà Nẵng</h2>
            </div>
            <Link to="/hotels" className="text-xs sm:text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
              Xem tất cả ({featuredHotels.length}+) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredHotels.map((h) => (
              <div key={h._id} className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={h.coverImage} 
                      alt={h.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {h.rating?.average || 4.8}
                    </div>
                    <div className="absolute top-3 right-3 bg-teal-600 text-white px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase">
                      {h.type}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      {h.district}, Đà Nẵng
                    </p>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-1">
                      {h.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {h.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Giá chỉ từ</span>
                    <span className="text-base font-black text-teal-600">
                      {h.minPrice ? formatVND(h.minPrice) : 'Liên hệ'}
                    </span>
                    <span className="text-[10px] text-slate-400">/đêm</span>
                  </div>
                  <Link 
                    to={`/hotels/${h._id}`}
                    className="px-4 py-2 bg-slate-900 group-hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Xem phòng
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Da Nang Travel Destinations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> Cẩm Nang Điểm Đến
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Điểm Du Lịch Đẹp Nhất Đà Nẵng</h2>
            </div>
            <Link to="/destinations" className="text-xs sm:text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
              Khám phá toàn bộ <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((d) => (
              <Link 
                key={d._id} 
                to={`/destinations/${d.slug || d._id}`}
                className="group relative rounded-3xl overflow-hidden h-80 shadow-md hover:shadow-xl transition-all duration-300 block"
              >
                <img 
                  src={d.coverImage} 
                  alt={d.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent"></div>

                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md border border-white/30 text-white px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase">
                  {d.district}
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <h3 className="text-base font-black leading-snug group-hover:text-teal-300 transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {d.description}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-amber-300 font-semibold">
                    <span>{d.ticketPrice}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Xem chi tiết <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Why Choose Hostay */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Giải Pháp Công Nghệ 2 Trong 1</span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">Tại sao nên chọn Hostay Đà Nẵng?</h2>
            <p className="text-xs sm:text-sm text-slate-400">Thiết kế đáp ứng trọn vẹn tiêu chí quản trị dự án phần mềm theo mô hình SMART & MoSCoW</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Check-in QR Không Chạm</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tự động sinh phiếu đặt phòng có mã QR. Lễ tân quét bằng điện thoại/máy ảnh nhận diện khách trong chưa đầy 2 giây.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Thanh Toán Nội Địa An Toàn</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tích hợp cổng VNPay-QR và Ví MoMo với cơ chế bảo mật chữ ký điện tử HMAC-SHA512, không giữ dữ liệu thẻ nhạy cảm.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Percent className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Giá Gốc Địa Phương</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cắt giảm 15-20% phí hoa hồng OTA quốc tế, giúp du khách luôn nhận được giá phòng cạnh tranh nhất tại Đà Nẵng.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
