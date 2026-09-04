import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  MapPin, 
  Star, 
  SlidersHorizontal, 
  Grid, 
  Map as MapIcon, 
  Check, 
  ArrowRight,
  Filter
} from 'lucide-react';
import api from '../services/api';
import DaNangMap from '../components/DaNangMap';
import { formatVND, DANANG_DISTRICTS } from '../utils/formatters';

const PROPERTY_TYPES = [
  { id: 'all', label: 'Tất cả loại hình' },
  { id: 'hotel', label: 'Khách sạn' },
  { id: 'homestay', label: 'Homestay' },
  { id: 'resort', label: 'Khu nghỉ dưỡng (Resort)' },
  { id: 'apartment', label: 'Căn hộ dịch vụ' }
];

const AMENITY_OPTIONS = [
  'Hồ bơi',
  'Giáp biển',
  'Bữa sáng buffet miễn phí',
  'Xe đưa đón sân bay',
  'Wi-Fi tốc độ cao',
  'Bãi đỗ xe ô tô',
  'Bếp nấu ăn tự do',
  'Cho thuê xe máy'
];

export default function Hotels() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || 'all');
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [starRating, setStarRating] = useState(searchParams.get('starRating') || '');
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sort, setSort] = useState('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (district && district !== 'all') params.append('district', district);
        if (type && type !== 'all') params.append('type', type);
        if (starRating) params.append('starRating', starRating);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (selectedAmenities.length > 0) params.append('amenities', selectedAmenities.join(','));
        if (sort) params.append('sort', sort);

        const res = await api.get(`/hotels?${params.toString()}`);
        if (res.data.success) {
          setHotels(res.data.hotels);
        }
      } catch (err) {
        console.error('Error fetching hotels', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [search, district, type, starRating, maxPrice, selectedAmenities, sort]);

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const resetFilters = () => {
    setSearch('');
    setDistrict('all');
    setType('all');
    setStarRating('');
    setMaxPrice(5000000);
    setSelectedAmenities([]);
    setSort('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner / Search bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Khách Sạn & Homestay Tại Đà Nẵng
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tìm thấy <span className="font-bold text-teal-600">{hotels.length}</span> cơ sở lưu trú sẵn sàng đón khách
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" /> Bộ lọc
            </button>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                  viewMode === 'map' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Search and Sort */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên khách sạn, đường phố, homestay gần biển..."
              className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto self-end">
            <span className="text-xs text-slate-500 whitespace-nowrap font-medium">Sắp xếp:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="py-2 px-3 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl outline-none bg-slate-50 cursor-pointer"
            >
              <option value="popular">Phổ biến nhất</option>
              <option value="price_asc">Giá: Thấp đến cao</option>
              <option value="price_desc">Giá: Cao đến thấp</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="stars">Số sao (5★ - 1★)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Hotel Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm h-fit`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-600" /> Bộ Lọc Nâng Cao
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] font-bold text-teal-600 hover:text-teal-700"
            >
              Đặt lại
            </button>
          </div>

          {/* District */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase">Khu vực Đà Nẵng</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none"
            >
              <option value="all">Tất cả quận/huyện</option>
              {DANANG_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase">Loại hình lưu trú</label>
            <div className="space-y-1.5">
              {PROPERTY_TYPES.map((pt) => (
                <button
                  type="button"
                  key={pt.id}
                  onClick={() => setType(pt.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    type === pt.id ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{pt.label}</span>
                  {type === pt.id && <Check className="w-3.5 h-3.5 text-teal-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 uppercase">Mức giá tối đa</span>
              <span className="font-bold text-teal-600">{formatVND(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="300000"
              max="5000000"
              step="100000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>300.000 ₫</span>
              <span>5.000.000 ₫+</span>
            </div>
          </div>

          {/* Star Rating */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase">Xếp hạng sao</label>
            <div className="grid grid-cols-5 gap-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setStarRating(starRating === String(star) ? '' : String(star))}
                  className={`py-1.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-0.5 ${
                    starRating === String(star)
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {star} <Star className="w-3 h-3 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Amenities checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase">Tiện ích phổ biến</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {AMENITY_OPTIONS.map((am) => (
                <label key={am} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(am)}
                    onChange={() => handleAmenityToggle(am)}
                    className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                  />
                  <span>{am}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Hotel Listings Content */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-xs text-slate-500 mt-2">Đang tìm kiếm cơ sở lưu trú Đà Nẵng...</p>
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-6">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">Không tìm thấy khách sạn nào thỏa mãn bộ lọc</p>
              <p className="text-xs text-slate-400 mt-1">Hãy thử nới rộng khoảng giá hoặc chọn khu vực khác.</p>
              <button 
                onClick={resetFilters}
                className="mt-4 px-4 py-2 text-xs font-bold text-white bg-teal-600 rounded-xl"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : viewMode === 'map' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Hiển thị {hotels.length} khách sạn trên bản đồ Đà Nẵng</p>
              <DaNangMap items={hotels} type="hotels" height="560px" />
            </div>
          ) : (
            <div className="space-y-4">
              {hotels.map((hotel) => (
                <div 
                  key={hotel._id} 
                  className="group bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-5"
                >
                  <div className="relative w-full sm:w-60 h-48 sm:h-auto rounded-2xl overflow-hidden shrink-0">
                    <img 
                      src={hotel.coverImage} 
                      alt={hotel.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {hotel.type}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500 text-xs">
                          {Array.from({ length: hotel.starRating || 3 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-teal-50 text-teal-800 rounded-lg text-xs font-bold border border-teal-200/60">
                          <Star className="w-3 h-3 text-teal-600 fill-teal-600" />
                          {hotel.rating?.average || 4.8}
                          <span className="text-[10px] text-slate-400 font-normal">({hotel.rating?.count || 0} đánh giá)</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 leading-snug">
                        {hotel.name}
                      </h3>

                      <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        {hotel.address}, {hotel.district}, Đà Nẵng
                      </p>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                        {hotel.description}
                      </p>

                      {/* Amenities pills */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {hotel.amenities?.slice(0, 4).map((am, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-md">
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block">Giá phòng từ</span>
                        <span className="text-lg font-black text-teal-600">
                          {hotel.minPrice ? formatVND(hotel.minPrice) : 'Xem phòng'}
                        </span>
                        <span className="text-[10px] text-slate-400"> /đêm</span>
                      </div>
                      <Link
                        to={`/hotels/${hotel._id}`}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        Chọn phòng <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
