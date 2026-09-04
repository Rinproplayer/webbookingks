import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Search, 
  Heart, 
  Clock, 
  Tag, 
  Layers, 
  Map as MapIcon, 
  Grid, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DaNangMap from '../components/DaNangMap';
import { DANANG_DISTRICTS, DESTINATION_CATEGORIES } from '../utils/formatters';

export default function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, refreshUser } = useAuth();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory && activeCategory !== 'all') params.append('category', activeCategory);
        if (selectedDistrict && selectedDistrict !== 'all') params.append('district', selectedDistrict);
        if (searchQuery) params.append('search', searchQuery);

        const res = await api.get(`/destinations?${params.toString()}`);
        if (res.data.success) {
          setDestinations(res.data.destinations);
        }
      } catch (err) {
        console.error('Error fetching destinations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, [activeCategory, selectedDistrict, searchQuery]);

  const handleToggleWishlist = async (e, destId) => {
    e.preventDefault();
    if (!user) {
      alert('Vui lòng đăng nhập để lưu điểm đến yêu thích');
      return;
    }
    try {
      await api.post(`/destinations/${destId}/wishlist`);
      refreshUser();
    } catch (err) {
      console.error('Wishlist error', err);
    }
  };

  const isWishlisted = (id) => user?.wishlist?.some(w => (w._id || w) === id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold">
            <Compass className="w-3.5 h-3.5" /> CẨM NANG DU LỊCH ĐỊA PHƯƠNG
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Khám Phá Các Điểm Đến Tuyệt Mỹ Tại Đà Nẵng
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Tra cứu cẩm nang du lịch, thời điểm đẹp nhất, giá vé tham quan và định vị các khách sạn, homestay gần kề nhất.
          </p>
        </div>
      </div>

      {/* Category Pills & Search Controls */}
      <div className="space-y-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DESTINATION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên địa điểm, bãi biển..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-teal-500"
              />
            </div>

            {/* District Filter */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="py-2 px-3 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl outline-none bg-slate-50 cursor-pointer"
            >
              <option value="all">Tất cả quận/huyện</option>
              {DANANG_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1.5 self-end sm:self-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Grid className="w-4 h-4" /> Danh sách
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'map' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <MapIcon className="w-4 h-4" /> Bản đồ số
            </button>
          </div>

        </div>
      </div>

      {/* Content View */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-xs text-slate-500 mt-2">Đang tải danh lam thắng cảnh Đà Nẵng...</p>
        </div>
      ) : destinations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">Không tìm thấy địa điểm nào phù hợp bộ lọc</p>
          <button 
            onClick={() => { setActiveCategory('all'); setSelectedDistrict('all'); setSearchQuery(''); }}
            className="mt-3 text-xs text-teal-600 font-bold hover:underline"
          >
            Xóa bộ lọc tìm kiếm
          </button>
        </div>
      ) : viewMode === 'map' ? (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">Hiển thị {destinations.length} địa điểm trên bản đồ Đà Nẵng</p>
          <DaNangMap items={destinations} type="destinations" height="520px" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((d) => (
            <div 
              key={d._id} 
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={d.coverImage} 
                    alt={d.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                    {d.district}
                  </div>

                  <button
                    onClick={(e) => handleToggleWishlist(e, d._id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-red-500 shadow-md transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted(d._id) ? 'text-red-500 fill-red-500' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-bold text-teal-300 block mb-0.5">
                      Vé: {d.ticketPrice}
                    </span>
                    <h3 className="text-lg font-black leading-tight group-hover:text-teal-300 transition-colors line-clamp-1">
                      {d.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    {d.address}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {d.description}
                  </p>
                  <div className="pt-1 flex items-center gap-4 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {d.openingHours}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                <span className="text-[11px] font-semibold text-slate-500">
                  {d.bestTimeToVisit || 'Quanh năm'}
                </span>
                <Link
                  to={`/destinations/${d.slug || d._id}`}
                  className="px-4 py-2 bg-slate-900 group-hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                >
                  Xem cẩm nang <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
