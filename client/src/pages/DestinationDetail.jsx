import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Ticket, 
  Calendar, 
  Lightbulb, 
  Building2, 
  Star, 
  ArrowLeft, 
  Heart,
  Share2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DaNangMap from '../components/DaNangMap';
import { formatVND } from '../utils/formatters';

export default function DestinationDetail() {
  const { idOrSlug } = useParams();
  const { user, refreshUser } = useAuth();

  const [destination, setDestination] = useState(null);
  const [nearbyHotels, setNearbyHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/destinations/${idOrSlug}`);
        if (res.data.success) {
          setDestination(res.data.destination);
          setNearbyHotels(res.data.nearbyHotels || []);
        }
      } catch (err) {
        console.error('Error fetching destination detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [idOrSlug]);

  const handleToggleWishlist = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để lưu điểm đến');
      return;
    }
    try {
      await api.post(`/destinations/${destination._id}/wishlist`);
      refreshUser();
    } catch (err) {
      console.error(err);
    }
  };

  const isWishlisted = user?.wishlist?.some(w => (w._id || w) === destination?._id);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-xs text-slate-500 mt-2">Đang tải thông tin điểm đến...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-slate-700">Không tìm thấy thông tin điểm đến</h2>
        <Link to="/destinations" className="mt-3 inline-block text-xs font-bold text-teal-600">
          Quay lại danh mục
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back button & title */}
      <div className="space-y-3">
        <Link to="/destinations" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách điểm đến
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-bold rounded-lg uppercase">
                {destination.district}, Đà Nẵng
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Danh mục: {destination.category}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {destination.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleToggleWishlist}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:text-red-500 hover:border-red-200 shadow-sm transition-all"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-red-500' : ''}`} />
              {isWishlisted ? 'Đã lưu' : 'Lưu điểm đến'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Cover & Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[420px]">
        <div className="lg:col-span-2 h-full rounded-3xl overflow-hidden shadow-sm">
          <img 
            src={destination.coverImage} 
            alt={destination.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden lg:grid grid-rows-2 gap-4 h-full">
          {destination.images && destination.images.length > 1 ? (
            destination.images.slice(0, 2).map((img, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden shadow-sm">
                <img src={img} alt="detail" className="w-full h-full object-cover" />
              </div>
            ))
          ) : (
            <div className="row-span-2 rounded-2xl overflow-hidden shadow-sm bg-slate-100">
              <img src={destination.coverImage} alt="detail" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Quick Specs Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Ticket className="w-4 h-4 text-teal-600" /> Giá vé tham quan
          </div>
          <p className="text-sm font-black text-slate-900">{destination.ticketPrice || 'Miễn phí'}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Clock className="w-4 h-4 text-teal-600" /> Giờ mở cửa
          </div>
          <p className="text-sm font-black text-slate-900">{destination.openingHours}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Calendar className="w-4 h-4 text-teal-600" /> Thời điểm đẹp nhất
          </div>
          <p className="text-sm font-black text-slate-900">{destination.bestTimeToVisit || 'Quanh năm'}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <MapPin className="w-4 h-4 text-teal-600" /> Địa bàn
          </div>
          <p className="text-sm font-black text-slate-900 truncate">{destination.district}</p>
        </div>
      </div>

      {/* Main Content & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Col: Description & Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Tổng quan & Cẩm nang trải nghiệm</h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-4 border-teal-500 pl-4">
              "{destination.description}"
            </p>
            <div className="text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line pt-2">
              {destination.content}
            </div>
          </div>

          {destination.travelTips && (
            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 text-amber-950 space-y-2">
              <h3 className="text-sm font-black flex items-center gap-2 text-amber-900">
                <Lightbulb className="w-5 h-5 text-amber-600" /> Kinh nghiệm du lịch địa phương:
              </h3>
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                {destination.travelTips}
              </p>
            </div>
          )}

          {/* Map Location */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" /> Vị trí trên bản đồ Đà Nẵng
            </h3>
            <p className="text-xs text-slate-500">{destination.address}</p>
            <DaNangMap 
              items={[destination]} 
              center={[destination.location.lat, destination.location.lng]} 
              zoom={14} 
              height="300px" 
            />
          </div>
        </div>

        {/* Right Col: Nearby Hotels */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-3xl border border-teal-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-700" />
              <h3 className="text-base font-black text-slate-900">Khách sạn gần điểm này</h3>
            </div>
            <p className="text-xs text-slate-600">
              Gợi ý cơ sở lưu trú tại <span className="font-bold text-teal-800">{destination.district}</span> thuận tiện di chuyển:
            </p>

            {nearbyHotels.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Chưa có khách sạn nào gần điểm này.</p>
            ) : (
              <div className="space-y-3">
                {nearbyHotels.map((hotel) => (
                  <div key={hotel._id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex gap-3">
                    <img 
                      src={hotel.coverImage} 
                      alt={hotel.name} 
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{hotel.rating?.average || 4.8}</span>
                        <span className="text-slate-400 text-[10px]">({hotel.starRating} sao)</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900 truncate">{hotel.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{hotel.address}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-black text-teal-600">
                          {hotel.minPrice ? `${formatVND(hotel.minPrice)}` : 'Xem giá'}
                        </span>
                        <Link
                          to={`/hotels/${hotel._id}`}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-teal-600 text-white text-[10px] font-bold rounded-lg transition-colors"
                        >
                          Đặt ngay
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              to={`/hotels?district=${destination.district}`}
              className="block w-full py-2.5 text-center text-xs font-bold text-teal-700 bg-teal-100 hover:bg-teal-200 rounded-xl transition-colors"
            >
              Xem tất cả khách sạn tại {destination.district}
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
