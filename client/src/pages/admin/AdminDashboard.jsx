import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  DollarSign, 
  Ticket, 
  Building2, 
  Users, 
  Percent, 
  FileSpreadsheet, 
  Check, 
  X, 
  Lock, 
  Unlock, 
  Plus, 
  TrendingUp,
  Tag,
  BarChart3,
  Edit3,
  Trash2,
  MapPin,
  BedDouble,
  Eye,
  Compass,
  Image as ImageIcon,
  Star,
  ExternalLink,
  Search,
  Filter,
  Layers,
  Sparkles,
  Phone,
  Mail,
  Clock,
  Coins
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../../services/api';
import ImageUploader from '../../components/ImageUploader';
import { formatVND, formatDate, DANANG_DISTRICTS } from '../../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'banners' | 'hotels' | 'destinations' | 'partners' | 'vouchers' | 'users'

  // Overview Stats
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Users & Partners
  const [users, setUsers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [isAddVoucherOpen, setIsAddVoucherOpen] = useState(false);

  // Banners Management State
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(false);
  const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);
  const [isEditBannerOpen, setIsEditBannerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [newBanner, setNewBanner] = useState({
    title: '',
    highlightText: '',
    subtitle: '',
    badge: 'NỀN TẢNG ĐẶT PHÒNG CHUYÊN BIỆT ĐÀ NẴNG 2026',
    imageUrl: '',
    linkUrl: '/hotels',
    ctaText: 'Đặt phòng ngay',
    position: 'hero',
    order: 0,
    isActive: true
  });

  // Hotels & Rooms Management State
  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [hotelSearch, setHotelSearch] = useState('');
  const [hotelDistrictFilter, setHotelDistrictFilter] = useState('all');
  const [hotelTypeFilter, setHotelTypeFilter] = useState('all');

  // Hotel Edit / Create Modal State
  const [isEditHotelOpen, setIsEditHotelOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false);
  const [newHotel, setNewHotel] = useState({
    name: '',
    type: 'hotel',
    starRating: 4,
    district: 'Sơn Trà',
    address: '',
    phone: '',
    email: '',
    description: '',
    amenities: 'Hồ bơi vô cực, View biển Mỹ Khê, Buffet sáng miễn phí, Wifi tốc độ cao',
    coverImage: '',
    images: [],
    checkInTime: '14:00',
    checkOutTime: '12:00',
    cancellationPolicy: 'Hủy miễn phí trước 24 giờ nhận phòng',
    petAllowed: false,
    childPolicy: 'Miễn phí trẻ em dưới 6 tuổi'
  });

  // Hotel Rooms Sub-Manager Modal State
  const [selectedHotelForRooms, setSelectedHotelForRooms] = useState(null);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: '',
    type: 'Deluxe',
    standardGuests: 2,
    maxGuests: 2,
    roomSize: 30,
    bedType: '1 Giường đôi King size',
    pricePerNight: 850000,
    weekendPrice: 1050000,
    diffFestivalPrice: 1350000,
    totalRooms: 5,
    availableRooms: 5,
    amenities: 'Điều hòa 2 chiều, Tủ lạnh mini, Smart TV 55 inch, Ban công view biển',
    coverImage: '',
    images: []
  });

  // Destinations Management State
  const [destinations, setDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [destSearch, setDestSearch] = useState('');
  const [destCategoryFilter, setDestCategoryFilter] = useState('all');
  const [isEditDestOpen, setIsEditDestOpen] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [isAddDestOpen, setIsAddDestOpen] = useState(false);
  const [newDest, setNewDest] = useState({
    name: '',
    category: 'nature',
    district: 'Sơn Trà',
    address: '',
    ticketPrice: 'Miễn phí',
    openingHours: '07:00 - 21:00',
    bestTimeToVisit: 'Tháng 3 - Tháng 9',
    description: '',
    content: '',
    coverImage: '',
    images: [],
    travelTips: 'Nên mang theo nón mũ, kem chống nắng và chuẩn bị trang phục lịch sự.'
  });

  // New Voucher Form
  const [newVoucher, setNewVoucher] = useState({
    code: '',
    title: '',
    discountType: 'percent',
    discountValue: 15,
    maxDiscount: 150000,
    minSpend: 500000,
    endDate: '2026-12-31',
    totalUsageLimit: 200
  });

  // Fetch initial data
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get('/analytics/dashboard');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/admin/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVouchers = async () => {
    try {
      const res = await api.get('/vouchers');
      if (res.data.success) {
        setVouchers(res.data.vouchers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHotels = async () => {
    setLoadingHotels(true);
    try {
      const res = await api.get('/hotels/owner/me');
      if (res.data.success) {
        setHotels(res.data.hotels);
        if (selectedHotelForRooms) {
          const refreshed = res.data.hotels.find(h => h._id === selectedHotelForRooms._id);
          if (refreshed) setSelectedHotelForRooms(refreshed);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHotels(false);
    }
  };

  const fetchDestinations = async () => {
    setLoadingDestinations(true);
    try {
      const res = await api.get('/destinations');
      if (res.data.success) {
        setDestinations(res.data.destinations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDestinations(false);
    }
  };

  const fetchBanners = async () => {
    setLoadingBanners(true);
    try {
      const res = await api.get('/banners/admin/all');
      if (res.data.success) {
        setBanners(res.data.banners);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBanners(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchVouchers();
    fetchHotels();
    fetchDestinations();
    fetchBanners();
  }, []);

  // Export Excel
  const handleExportExcel = async () => {
    try {
      const response = await api.get('/analytics/export-excel', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Hostay_Bao_Cao_Dat_Phong_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Không thể xuất file Excel: ' + (err.message || 'Lỗi server'));
    }
  };

  // Partner Review
  const handleReviewPartner = async (userId, status) => {
    const reason = status === 'rejected' ? prompt('Nhập lý do từ chối:') : '';
    try {
      const res = await api.put(`/auth/admin/partners/${userId}/review`, {
        status,
        rejectionReason: reason
      });
      if (res.data.success) {
        alert(res.data.message);
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // Toggle user block
  const handleToggleUserBlock = async (userId) => {
    try {
      const res = await api.put(`/auth/admin/users/${userId}/toggle-block`);
      if (res.data.success) {
        alert(res.data.message);
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi');
    }
  };

  // Create voucher
  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/vouchers', newVoucher);
      if (res.data.success) {
        alert('Tạo mã voucher thành công!');
        setIsAddVoucherOpen(false);
        fetchVouchers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi tạo voucher');
    }
  };

  // Toggle voucher active
  const handleToggleVoucher = async (vId) => {
    try {
      const res = await api.put(`/vouchers/${vId}/toggle`);
      if (res.data.success) {
        fetchVouchers();
      }
    } catch (err) {
      alert('Có lỗi');
    }
  };

  // --- BANNER HANDLERS ---
  const handleOpenEditBanner = (banner) => {
    setEditingBanner({ ...banner });
    setIsEditBannerOpen(true);
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (!editingBanner) return;
    if (!editingBanner.imageUrl) {
      alert('Vui lòng tải ảnh cho banner!');
      return;
    }
    try {
      const res = await api.put(`/banners/${editingBanner._id}`, editingBanner);
      if (res.data.success) {
        alert('Cập nhật banner thành công!');
        setIsEditBannerOpen(false);
        setEditingBanner(null);
        fetchBanners();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi cập nhật banner');
    }
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    if (!newBanner.title || !newBanner.imageUrl) {
      alert('Vui lòng nhập tiêu đề và tải ảnh banner!');
      return;
    }
    try {
      const res = await api.post('/banners', newBanner);
      if (res.data.success) {
        alert('Thêm banner mới thành công!');
        setIsAddBannerOpen(false);
        setNewBanner({
          title: '',
          highlightText: '',
          subtitle: '',
          badge: 'NỀN TẢNG ĐẶT PHÒNG CHUYÊN BIỆT ĐÀ NẴNG 2026',
          imageUrl: '',
          linkUrl: '/hotels',
          ctaText: 'Đặt phòng ngay',
          position: 'hero',
          order: 0,
          isActive: true
        });
        fetchBanners();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi tạo banner');
    }
  };

  const handleToggleBanner = async (bannerId) => {
    try {
      const res = await api.put(`/banners/${bannerId}/toggle`);
      if (res.data.success) {
        alert(res.data.message);
        fetchBanners();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa banner này?')) return;
    try {
      const res = await api.delete(`/banners/${bannerId}`);
      if (res.data.success) {
        alert('Đã xóa banner thành công!');
        fetchBanners();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xóa banner');
    }
  };

  // --- HOTEL HANDLERS ---
  const handleOpenEditHotel = (hotel) => {
    setEditingHotel({
      ...hotel,
      amenitiesStr: Array.isArray(hotel.amenities) ? hotel.amenities.join(', ') : (hotel.amenities || ''),
      checkInTime: hotel.policies?.checkInTime || '14:00',
      checkOutTime: hotel.policies?.checkOutTime || '12:00',
      cancellationPolicy: hotel.policies?.cancellationPolicy || 'Hủy miễn phí trước 24 giờ nhận phòng',
      petAllowed: hotel.policies?.petAllowed || false,
      childPolicy: hotel.policies?.childPolicy || 'Miễn phí trẻ em dưới 6 tuổi'
    });
    setIsEditHotelOpen(true);
  };

  const handleSaveHotel = async (e) => {
    e.preventDefault();
    if (!editingHotel) return;
    try {
      const amenitiesArr = editingHotel.amenitiesStr.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.put(`/hotels/${editingHotel._id}`, {
        name: editingHotel.name,
        type: editingHotel.type,
        starRating: editingHotel.starRating,
        district: editingHotel.district,
        address: editingHotel.address,
        phone: editingHotel.phone,
        email: editingHotel.email,
        description: editingHotel.description,
        coverImage: editingHotel.coverImage,
        images: editingHotel.images,
        amenities: amenitiesArr,
        policies: {
          checkInTime: editingHotel.checkInTime,
          checkOutTime: editingHotel.checkOutTime,
          cancellationPolicy: editingHotel.cancellationPolicy,
          petAllowed: editingHotel.petAllowed,
          childPolicy: editingHotel.childPolicy
        }
      });

      if (res.data.success) {
        alert('Cập nhật thông tin cơ sở lưu trú thành công!');
        setIsEditHotelOpen(false);
        setEditingHotel(null);
        fetchHotels();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi cập nhật khách sạn');
    }
  };

  const handleCreateHotel = async (e) => {
    e.preventDefault();
    if (!newHotel.name || !newHotel.coverImage) {
      alert('Vui lòng nhập tên và tải ảnh đại diện cho khách sạn!');
      return;
    }
    try {
      const amenitiesArr = newHotel.amenities.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.post('/hotels', {
        name: newHotel.name,
        type: newHotel.type,
        starRating: Number(newHotel.starRating),
        district: newHotel.district,
        address: newHotel.address,
        phone: newHotel.phone,
        email: newHotel.email,
        description: newHotel.description,
        coverImage: newHotel.coverImage,
        images: newHotel.images,
        amenities: amenitiesArr,
        policies: {
          checkInTime: newHotel.checkInTime,
          checkOutTime: newHotel.checkOutTime,
          cancellationPolicy: newHotel.cancellationPolicy,
          petAllowed: newHotel.petAllowed,
          childPolicy: newHotel.childPolicy
        }
      });

      if (res.data.success) {
        alert('Thêm khách sạn / homestay mới thành công!');
        setIsAddHotelOpen(false);
        setNewHotel({
          name: '',
          type: 'hotel',
          starRating: 4,
          district: 'Sơn Trà',
          address: '',
          phone: '',
          email: '',
          description: '',
          amenities: 'Hồ bơi vô cực, View biển Mỹ Khê, Buffet sáng miễn phí, Wifi tốc độ cao',
          coverImage: '',
          images: [],
          checkInTime: '14:00',
          checkOutTime: '12:00',
          cancellationPolicy: 'Hủy miễn phí trước 24 giờ nhận phòng',
          petAllowed: false,
          childPolicy: 'Miễn phí trẻ em dưới 6 tuổi'
        });
        fetchHotels();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi tạo khách sạn');
    }
  };

  const handleToggleHotelOpen = async (hotelId) => {
    try {
      const res = await api.put(`/hotels/${hotelId}/toggle-open`);
      if (res.data.success) {
        alert(res.data.message);
        fetchHotels();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa cơ sở lưu trú này? Tất cả các phòng và dữ liệu liên quan sẽ bị ẩn.')) return;
    try {
      const res = await api.delete(`/hotels/${hotelId}`);
      if (res.data.success) {
        alert('Đã xóa cơ sở lưu trú thành công!');
        fetchHotels();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xóa khách sạn');
    }
  };

  // --- ROOM HANDLERS ---
  const handleOpenEditRoom = (room) => {
    setEditingRoom({
      ...room,
      amenitiesStr: Array.isArray(room.amenities) ? room.amenities.join(', ') : (room.amenities || '')
    });
    setIsEditRoomOpen(true);
  };

  const handleSaveRoomEdit = async (e) => {
    e.preventDefault();
    if (!editingRoom) return;
    try {
      const amenitiesArr = editingRoom.amenitiesStr.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.put(`/rooms/${editingRoom._id}`, {
        ...editingRoom,
        amenities: amenitiesArr
      });
      if (res.data.success) {
        alert('Cập nhật hạng phòng thành công!');
        setIsEditRoomOpen(false);
        setEditingRoom(null);
        fetchHotels();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi cập nhật phòng');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!selectedHotelForRooms) return;
    if (!newRoom.coverImage) {
      alert('Vui lòng tải ảnh đại diện cho phòng!');
      return;
    }
    try {
      const amenitiesArr = newRoom.amenities.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.post('/rooms', {
        ...newRoom,
        hotelId: selectedHotelForRooms._id,
        amenities: amenitiesArr
      });
      if (res.data.success) {
        alert('Tạo hạng phòng mới thành công!');
        setIsAddRoomOpen(false);
        setNewRoom({
          name: '',
          type: 'Deluxe',
          standardGuests: 2,
          maxGuests: 2,
          roomSize: 30,
          bedType: '1 Giường đôi King size',
          pricePerNight: 850000,
          weekendPrice: 1050000,
          diffFestivalPrice: 1350000,
          totalRooms: 5,
          availableRooms: 5,
          amenities: 'Điều hòa 2 chiều, Tủ lạnh mini, Smart TV 55 inch, Ban công view biển',
          coverImage: '',
          images: []
        });
        fetchHotels();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi tạo phòng');
    }
  };

  const handleToggleRoomLock = async (roomId) => {
    try {
      const res = await api.put(`/rooms/${roomId}/toggle-lock`);
      if (res.data.success) {
        alert(res.data.message);
        fetchHotels();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hạng phòng này?')) return;
    try {
      const res = await api.delete(`/rooms/${roomId}`);
      if (res.data.success) {
        alert('Đã xóa hạng phòng thành công!');
        fetchHotels();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xóa phòng');
    }
  };

  // --- DESTINATION HANDLERS ---
  const handleOpenEditDest = (dest) => {
    setEditingDest({ ...dest });
    setIsEditDestOpen(true);
  };

  const handleSaveDest = async (e) => {
    e.preventDefault();
    if (!editingDest) return;
    try {
      const res = await api.put(`/destinations/${editingDest._id}`, editingDest);
      if (res.data.success) {
        alert('Cập nhật điểm đến du lịch thành công!');
        setIsEditDestOpen(false);
        setEditingDest(null);
        fetchDestinations();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi cập nhật điểm đến');
    }
  };

  const handleCreateDest = async (e) => {
    e.preventDefault();
    if (!newDest.name || !newDest.coverImage) {
      alert('Vui lòng nhập tên và tải ảnh đại diện cho điểm đến!');
      return;
    }
    try {
      const res = await api.post('/destinations', {
        ...newDest,
        location: { lat: 16.0544, lng: 108.2022 }
      });
      if (res.data.success) {
        alert('Thêm điểm đến du lịch Đà Nẵng thành công!');
        setIsAddDestOpen(false);
        setNewDest({
          name: '',
          category: 'nature',
          district: 'Sơn Trà',
          address: '',
          ticketPrice: 'Miễn phí',
          openingHours: '07:00 - 21:00',
          bestTimeToVisit: 'Tháng 3 - Tháng 9',
          description: '',
          content: '',
          coverImage: '',
          images: [],
          travelTips: 'Nên mang theo nón mũ, kem chống nắng và chuẩn bị trang phục lịch sự.'
        });
        fetchDestinations();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi tạo điểm đến');
    }
  };

  const handleDeleteDest = async (destId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa điểm đến du lịch này khỏi cẩm nang?')) return;
    try {
      const res = await api.delete(`/destinations/${destId}`);
      if (res.data.success) {
        alert('Đã xóa điểm đến du lịch!');
        fetchDestinations();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xóa điểm đến');
    }
  };

  // Revenue Chart Configuration
  const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: stats?.monthlyRevenue || Array(12).fill(0),
        backgroundColor: 'rgba(13, 148, 136, 0.85)',
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Biểu đồ Doanh Thu Hệ Thống Hostay 12 Tháng (Năm 2026)' }
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `${(value / 1000000).toFixed(1)}M ₫`
        }
      }
    }
  };

  const pendingPartners = users.filter(u => u.partnerStatus === 'pending');

  // Filtered Hotels
  const filteredHotels = hotels.filter(h => {
    const matchName = h.name.toLowerCase().includes(hotelSearch.toLowerCase()) || 
                      h.address.toLowerCase().includes(hotelSearch.toLowerCase());
    const matchDistrict = hotelDistrictFilter === 'all' || h.district === hotelDistrictFilter;
    const matchType = hotelTypeFilter === 'all' || h.type === hotelTypeFilter;
    return matchName && matchDistrict && matchType;
  });

  // Filtered Destinations
  const filteredDestinations = destinations.filter(d => {
    const matchName = d.name.toLowerCase().includes(destSearch.toLowerCase()) || 
                      d.address.toLowerCase().includes(destSearch.toLowerCase());
    const matchCat = destCategoryFilter === 'all' || d.category === destCategoryFilter;
    return matchName && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
              Hostay Master Admin Panel
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Quản Trị Hệ Thống & Tùy Chỉnh Toàn Diện
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Tùy biến Banner trang chủ, thông tin khách sạn & phòng nghỉ, cẩm nang điểm đến du lịch, tải ảnh kéo thả từ máy tính & xuất báo cáo doanh thu Excel.
          </p>
        </div>

        {/* Excel Export Button */}
        <button
          onClick={handleExportExcel}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" /> Xuất Báo Cáo Excel (.xlsx)
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'overview'
              ? 'bg-purple-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Báo cáo thống kê
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'banners'
              ? 'bg-purple-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Quản lý Banner ({banners.length})
        </button>

        <button
          onClick={() => setActiveTab('hotels')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'hotels'
              ? 'bg-purple-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" /> Khách sạn & Phòng ({hotels.length})
        </button>

        <button
          onClick={() => setActiveTab('destinations')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'destinations'
              ? 'bg-purple-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4" /> Điểm đến Đà Nẵng ({destinations.length})
        </button>

        <button
          onClick={() => setActiveTab('partners')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'partners'
              ? 'bg-purple-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Duyệt hồ sơ Đối tác ({pendingPartners.length})
        </button>

        <button
          onClick={() => setActiveTab('vouchers')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'vouchers'
              ? 'bg-purple-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4" /> Mã giảm giá ({vouchers.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'users'
              ? 'bg-purple-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" /> Tài khoản người dùng ({users.length})
        </button>
      </div>

      {/* ========================================================
          TAB 1: OVERVIEW & CHARTS
          ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Tổng Doanh Thu</span>
              <p className="text-2xl font-black text-teal-600">{formatVND(stats?.totalRevenue || 0)}</p>
              <span className="text-[10px] text-slate-500">Toàn bộ đơn đã thanh toán</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Tổng Đơn Đặt Phòng</span>
              <p className="text-2xl font-black text-slate-900">{stats?.totalBookings || 0} Đơn</p>
              <span className="text-[10px] text-slate-500">Bao gồm toàn bộ các trạng thái</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Cơ Sở Lưu Trú Đang Chạy</span>
              <p className="text-2xl font-black text-blue-600">{stats?.activeHotelsCount || hotels.length || 0} Cơ sở</p>
              <span className="text-[10px] text-slate-500">Khách sạn & Homestay Đà Nẵng</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Tỷ Lệ Lấp Phòng (Occupancy)</span>
              <p className="text-2xl font-black text-amber-500">{stats?.occupancyRate || 40}%</p>
              <span className="text-[10px] text-slate-500">Công suất buồng phòng thời gian thực</span>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <Bar data={chartData} options={chartOptions} height={90} />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900">Giao Dịch Đặt Phòng Gần Nhất</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Mã đơn</th>
                    <th className="py-3 px-3">Khách hàng</th>
                    <th className="py-3 px-3">Khách sạn</th>
                    <th className="py-3 px-3">Thực thu</th>
                    <th className="py-3 px-3">Phương thức</th>
                    <th className="py-3 px-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats?.recentBookings?.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-teal-700">{b.bookingCode}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{b.customer?.name}</td>
                      <td className="py-3 px-3">{b.hotel?.name}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{formatVND(b.pricing?.finalTotal)}</td>
                      <td className="py-3 px-3 uppercase font-semibold text-slate-600">{b.paymentMethod}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: BANNERS MANAGEMENT
          ======================================================== */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Quản Lý Banner & Hình Ảnh Quảng Bá Trang Chủ</h3>
              <p className="text-xs text-slate-500">Tùy chỉnh tiêu đề, chữ nổi bật, tải ảnh nền kéo thả từ máy tính và điều khiển hiển thị trên trang chủ.</p>
            </div>
            <button
              onClick={() => setIsAddBannerOpen(true)}
              className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Thêm Banner Mới
            </button>
          </div>

          {loadingBanners ? (
            <div className="py-12 text-center text-xs text-slate-400">Đang tải danh sách banner...</div>
          ) : banners.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border text-center text-xs text-slate-400">
              Chưa có banner nào. Bấm <strong>"Thêm Banner Mới"</strong> để tạo banner đầu tiên.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((b) => (
                <div key={b._id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    {/* Banner Realistic Live Preview */}
                    <div className="relative h-56 w-full bg-slate-900 overflow-hidden flex items-center justify-center p-6 text-center">
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-40"
                        style={{ backgroundImage: `url('${b.imageUrl}')` }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent"></div>

                      <div className="relative z-10 space-y-2 max-w-sm mx-auto">
                        {b.badge && (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-[10px] font-bold">
                            {b.badge}
                          </span>
                        )}
                        <h4 className="text-base sm:text-lg font-black text-white leading-snug">
                          {b.title} <br />
                          {b.highlightText && (
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-amber-300">
                              {b.highlightText}
                            </span>
                          )}
                        </h4>
                        {b.subtitle && (
                          <p className="text-[11px] text-slate-300 line-clamp-2">{b.subtitle}</p>
                        )}
                      </div>

                      {/* Position & Status tags */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                          b.position === 'hero' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {b.position === 'hero' ? 'Hero Slider' : 'Promo Banner'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-black/60 text-slate-200 text-[10px] font-mono">
                          Thứ tự: {b.order}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm ${
                          b.isActive ? 'bg-emerald-600 text-white' : 'bg-slate-600 text-white'
                        }`}>
                          {b.isActive ? 'Đang hiển thị' : 'Đang ẩn'}
                        </span>
                      </div>
                    </div>

                    {/* Banner Info Details */}
                    <div className="p-5 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Liên kết: <strong className="font-mono text-purple-700">{b.linkUrl || '/hotels'}</strong></span>
                        <span>CTA: <strong className="text-slate-800">{b.ctaText || 'Đặt phòng ngay'}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleBanner(b._id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors ${
                        b.isActive ? 'bg-amber-100 hover:bg-amber-200 text-amber-800' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                      }`}
                    >
                      {b.isActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      {b.isActive ? 'Tạm ẩn banner' : 'Kích hoạt banner'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditBanner(b)}
                        title="Chỉnh sửa banner"
                        className="p-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(b._id)}
                        title="Xóa banner"
                        className="p-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 3: HOTELS & ROOMS MANAGEMENT
          ======================================================== */}
      {activeTab === 'hotels' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Quản Lý Cơ Sở Lưu Trú & Hạng Phòng</h3>
              <p className="text-xs text-slate-500">Tùy chỉnh thông tin khách sạn, quản lý hạng phòng, giá bán và tải ảnh kéo thả từ máy tính.</p>
            </div>
            <button
              onClick={() => setIsAddHotelOpen(true)}
              className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Thêm Cơ Sở Lưu Trú Mới
            </button>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên khách sạn hoặc địa chỉ..."
                value={hotelSearch}
                onChange={(e) => setHotelSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-purple-600"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <select
                value={hotelDistrictFilter}
                onChange={(e) => setHotelDistrictFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white text-slate-700"
              >
                <option value="all">Tất cả quận/huyện</option>
                {DANANG_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select
                value={hotelTypeFilter}
                onChange={(e) => setHotelTypeFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white text-slate-700"
              >
                <option value="all">Tất cả loại hình</option>
                <option value="hotel">Khách sạn</option>
                <option value="homestay">Homestay</option>
                <option value="resort">Resort</option>
                <option value="apartment">Căn hộ</option>
              </select>
            </div>
          </div>

          {loadingHotels ? (
            <div className="py-12 text-center text-xs text-slate-400">Đang tải danh sách cơ sở lưu trú...</div>
          ) : filteredHotels.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border text-center text-xs text-slate-400">
              Không tìm thấy cơ sở lưu trú phù hợp với bộ lọc.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map(hotel => (
                <div key={hotel._id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={hotel.coverImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'; }}
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase">
                          {hotel.type}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                          <Star className="w-3 h-3 fill-white" /> {hotel.starRating || 3} sao
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm ${
                          hotel.isOpen ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {hotel.isOpen ? 'Đang mở cửa' : 'Tạm ngưng'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <h4 className="font-black text-slate-900 text-base line-clamp-1">{hotel.name}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 line-clamp-1">
                        <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        {hotel.address}, {hotel.district}
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {hotel.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">
                          Hạng phòng: <strong className="text-purple-700">{hotel.rooms?.length || 0} phòng</strong>
                        </span>
                        <span className="text-slate-500 font-medium">
                          Giá từ: <strong className="text-emerald-600">{formatVND(hotel.minPrice || 0)}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedHotelForRooms(hotel)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center gap-1"
                    >
                      <BedDouble className="w-3.5 h-3.5" /> Quản lý phòng ({hotel.rooms?.length || 0})
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleHotelOpen(hotel._id)}
                        title={hotel.isOpen ? 'Đóng cửa tạm ngưng' : 'Mở cửa nhận khách'}
                        className={`p-2 rounded-xl text-xs font-bold ${
                          hotel.isOpen ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {hotel.isOpen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleOpenEditHotel(hotel)}
                        title="Chỉnh sửa thông tin khách sạn"
                        className="p-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteHotel(hotel._id)}
                        title="Xóa khách sạn"
                        className="p-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 4: DESTINATIONS MANAGEMENT
          ======================================================== */}
      {activeTab === 'destinations' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Quản Lý Cẩm Nang Điểm Đến Đà Nẵng</h3>
              <p className="text-xs text-slate-500">Tùy chỉnh thông tin điểm tham quan du lịch, danh lam thắng cảnh và tải ảnh kéo thả từ máy tính.</p>
            </div>
            <button
              onClick={() => setIsAddDestOpen(true)}
              className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Thêm Điểm Đến Mới
            </button>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên điểm đến hoặc địa chỉ..."
                value={destSearch}
                onChange={(e) => setDestSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-purple-600"
              />
            </div>
            <select
              value={destCategoryFilter}
              onChange={(e) => setDestCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white text-slate-700 w-full md:w-auto"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="nature">Thiên nhiên</option>
              <option value="beach">Bãi biển</option>
              <option value="heritage">Di sản & Cầu</option>
              <option value="spiritual">Tâm linh</option>
              <option value="cuisine">Ẩm thực</option>
            </select>
          </div>

          {loadingDestinations ? (
            <div className="py-12 text-center text-xs text-slate-400">Đang tải cẩm nang điểm đến...</div>
          ) : filteredDestinations.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border text-center text-xs text-slate-400">
              Không tìm thấy điểm đến nào phù hợp.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map(dest => (
                <div key={dest._id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={dest.coverImage || 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800'}
                        alt={dest.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800'; }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase">
                          {dest.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full bg-purple-700 text-white text-[10px] font-bold shadow-sm">
                          {dest.district}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <h4 className="font-black text-slate-900 text-base line-clamp-1">{dest.name}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 line-clamp-1">
                        <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        {dest.address}
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-2">{dest.description}</p>
                      
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Vé: <strong className="text-emerald-600">{dest.ticketPrice || 'Miễn phí'}</strong></span>
                        <span>Giờ: {dest.openingHours || '07:00 - 21:00'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditDest(dest)}
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Sửa thông tin
                    </button>
                    <button
                      onClick={() => handleDeleteDest(dest._id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 5: PARTNERS APPROVAL
          ======================================================== */}
      {activeTab === 'partners' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900">Hồ Sơ Đăng Ký Đối Tác Chờ Duyệt</h3>
            <p className="text-xs text-slate-500">Kiểm tra thông tin kinh doanh và phê duyệt tài khoản chủ khách sạn.</p>
          </div>

          {pendingPartners.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">Không có hồ sơ đối tác nào đang chờ duyệt.</p>
          ) : (
            <div className="space-y-4">
              {pendingPartners.map((u) => (
                <div key={u._id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-900">{u.partnerInfo?.businessName || u.name}</h4>
                    <p className="text-xs text-slate-600">Đại diện: <span className="font-bold">{u.name}</span> • Email: {u.email}</p>
                    <p className="text-xs text-slate-500">CCCD/MST: {u.partnerInfo?.taxOrIdNumber} • Hotline: {u.partnerInfo?.contactPhone}</p>
                    <p className="text-xs text-slate-500">Địa chỉ: {u.partnerInfo?.address}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReviewPartner(u._id, 'approved')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" /> Phê Duyệt
                    </button>
                    <button
                      onClick={() => handleReviewPartner(u._id, 'rejected')}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Từ Chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 6: VOUCHERS CRUD
          ======================================================== */}
      {activeTab === 'vouchers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">Danh Sách Mã Giảm Giá Khuyến Mãi</h3>
            <button
              onClick={() => setIsAddVoucherOpen(true)}
              className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Tạo Mã Voucher Mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vouchers.map((v) => (
              <div key={v._id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                    {v.code}
                  </span>
                  <button
                    onClick={() => handleToggleVoucher(v._id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      v.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {v.isActive ? 'Đang chạy' : 'Tạm dừng'}
                  </button>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900">{v.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {v.discountType === 'percent' ? `Giảm ${v.discountValue}%` : `Giảm ${formatVND(v.discountValue)}`}
                    {v.maxDiscount > 0 ? ` (Tối đa ${formatVND(v.maxDiscount)})` : ''}
                  </p>
                </div>

                <div className="text-[10px] text-slate-400 space-y-0.5 pt-2 border-t border-slate-100">
                  <p>Đơn tối thiểu: {formatVND(v.minSpend)}</p>
                  <p>Lượt đã dùng: {v.usedCount} / {v.totalUsageLimit}</p>
                  <p>Hạn dùng: {formatDate(v.endDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 7: USERS MANAGEMENT
          ======================================================== */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900">Danh Sách Người Dùng Hệ Thống</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Tài khoản</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Vai trò</th>
                  <th className="py-3 px-3">Trạng thái</th>
                  <th className="py-3 px-3 text-right">Khóa/Mở</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 px-3 text-slate-600">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'hotelier' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold ${u.isBlocked ? 'text-red-600' : 'text-emerald-600'}`}>
                        {u.isBlocked ? 'Đã khóa' : 'Hoạt động'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserBlock(u._id)}
                          className={`p-1.5 rounded-lg text-xs font-bold ${
                            u.isBlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {u.isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD BANNER
          ======================================================== */}
      {isAddBannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-600" /> Thêm Banner Trang Chủ Mới
              </h3>
              <button onClick={() => setIsAddBannerOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBanner} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vị trí hiển thị</label>
                  <select
                    value={newBanner.position}
                    onChange={(e) => setNewBanner({ ...newBanner, position: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="hero">Hero chính đầu trang chủ</option>
                    <option value="promo">Banner quảng cáo / sự kiện (Promo)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thứ tự ưu tiên (0 = đầu tiên)</label>
                  <input
                    type="number"
                    value={newBanner.order}
                    onChange={(e) => setNewBanner({ ...newBanner, order: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tiêu đề chính banner *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Khám phá Đà Nẵng & Đặt phòng"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Chữ nổi bật (Hiệu ứng Gradient màu)</label>
                <input
                  type="text"
                  placeholder="VD: Tiết Kiệm Với Check-in QR"
                  value={newBanner.highlightText}
                  onChange={(e) => setNewBanner({ ...newBanner, highlightText: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Huy hiệu nhỏ trên đầu (Badge)</label>
                <input
                  type="text"
                  placeholder="VD: NỀN TẢNG ĐẶT PHÒNG CHUYÊN BIỆT ĐÀ NẴNG 2026"
                  value={newBanner.badge}
                  onChange={(e) => setNewBanner({ ...newBanner, badge: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô tả phụ đề (Subtitle)</label>
                <textarea
                  rows={2}
                  placeholder="VD: Kết nối trực tiếp hàng trăm khách sạn, resort ven biển Mỹ Khê và homestay sông Hàn..."
                  value={newBanner.subtitle}
                  onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Đường dẫn khi bấm (Link URL)</label>
                  <input
                    type="text"
                    value={newBanner.linkUrl}
                    onChange={(e) => setNewBanner({ ...newBanner, linkUrl: e.target.value })}
                    placeholder="/hotels hoặc /destinations"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Chữ trên nút (CTA Text)</label>
                  <input
                    type="text"
                    value={newBanner.ctaText}
                    onChange={(e) => setNewBanner({ ...newBanner, ctaText: e.target.value })}
                    placeholder="Đặt phòng ngay"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              {/* Banner Image Upload */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Hình ảnh Banner (Kéo thả từ máy tính hoặc bấm chọn file) *
                </label>
                <ImageUploader
                  images={newBanner.imageUrl ? [newBanner.imageUrl] : []}
                  onChange={(imgs) => setNewBanner({ ...newBanner, imageUrl: imgs[0] || '' })}
                  maxImages={1}
                  placeholder="Kéo thả ảnh banner vào đây..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddBannerOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md"
                >
                  Tạo Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT BANNER
          ======================================================== */}
      {isEditBannerOpen && editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-600" /> Tùy Chỉnh Banner Trang Chủ
              </h3>
              <button onClick={() => setIsEditBannerOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vị trí hiển thị</label>
                  <select
                    value={editingBanner.position}
                    onChange={(e) => setEditingBanner({ ...editingBanner, position: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="hero">Hero chính đầu trang chủ</option>
                    <option value="promo">Banner quảng cáo / sự kiện (Promo)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thứ tự ưu tiên (0 = đầu tiên)</label>
                  <input
                    type="number"
                    value={editingBanner.order}
                    onChange={(e) => setEditingBanner({ ...editingBanner, order: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tiêu đề chính banner *</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Chữ nổi bật (Hiệu ứng Gradient màu)</label>
                <input
                  type="text"
                  value={editingBanner.highlightText || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, highlightText: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Huy hiệu nhỏ trên đầu (Badge)</label>
                <input
                  type="text"
                  value={editingBanner.badge || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô tả phụ đề (Subtitle)</label>
                <textarea
                  rows={2}
                  value={editingBanner.subtitle || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Đường dẫn khi bấm (Link URL)</label>
                  <input
                    type="text"
                    value={editingBanner.linkUrl || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, linkUrl: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Chữ trên nút (CTA Text)</label>
                  <input
                    type="text"
                    value={editingBanner.ctaText || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              {/* Banner Image Upload */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Hình ảnh Banner (Kéo thả từ máy tính hoặc bấm chọn file) *
                </label>
                <ImageUploader
                  images={editingBanner.imageUrl ? [editingBanner.imageUrl] : []}
                  onChange={(imgs) => setEditingBanner({ ...editingBanner, imageUrl: imgs[0] || '' })}
                  maxImages={1}
                  placeholder="Kéo thả ảnh banner vào đây..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditBannerOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md"
                >
                  Lưu Thay Đổi Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT HOTEL
          ======================================================== */}
      {isEditHotelOpen && editingHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-600" /> Tùy Chỉnh Thông Tin Khách Sạn
              </h3>
              <button onClick={() => setIsEditHotelOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHotel} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tên khách sạn / cơ sở *</label>
                  <input
                    type="text"
                    required
                    value={editingHotel.name}
                    onChange={(e) => setEditingHotel({ ...editingHotel, name: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại hình</label>
                  <select
                    value={editingHotel.type}
                    onChange={(e) => setEditingHotel({ ...editingHotel, type: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="hotel">Khách sạn</option>
                    <option value="homestay">Homestay</option>
                    <option value="resort">Resort nghỉ dưỡng</option>
                    <option value="apartment">Căn hộ du lịch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quận / Huyện Đà Nẵng</label>
                  <select
                    value={editingHotel.district}
                    onChange={(e) => setEditingHotel({ ...editingHotel, district: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    {DANANG_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hạng sao (1 - 5 sao)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editingHotel.starRating}
                    onChange={(e) => setEditingHotel({ ...editingHotel, starRating: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Địa chỉ chi tiết *</label>
                <input
                  type="text"
                  required
                  value={editingHotel.address}
                  onChange={(e) => setEditingHotel({ ...editingHotel, address: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số điện thoại hotline *</label>
                  <input
                    type="text"
                    required
                    value={editingHotel.phone}
                    onChange={(e) => setEditingHotel({ ...editingHotel, phone: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email liên hệ *</label>
                  <input
                    type="email"
                    required
                    value={editingHotel.email}
                    onChange={(e) => setEditingHotel({ ...editingHotel, email: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô tả giới thiệu khách sạn</label>
                <textarea
                  rows={3}
                  value={editingHotel.description}
                  onChange={(e) => setEditingHotel({ ...editingHotel, description: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tiện ích nổi bật (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={editingHotel.amenitiesStr}
                  onChange={(e) => setEditingHotel({ ...editingHotel, amenitiesStr: e.target.value })}
                  placeholder="Hồ bơi, View biển, Bữa sáng miễn phí, Wifi tốc độ cao..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Ảnh đại diện khách sạn (Kéo thả từ máy tính hoặc bấm chọn file) *
                </label>
                <ImageUploader
                  images={editingHotel.coverImage ? [editingHotel.coverImage] : []}
                  onChange={(imgs) => setEditingHotel({ ...editingHotel, coverImage: imgs[0] || '' })}
                  maxImages={1}
                  placeholder="Kéo thả ảnh đại diện khách sạn vào đây..."
                />
              </div>

              {/* Gallery Images Upload */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Bộ sưu tập ảnh khách sạn & khuôn viên (Kéo thả nhiều ảnh)
                </label>
                <ImageUploader
                  images={editingHotel.images || []}
                  onChange={(imgs) => setEditingHotel({ ...editingHotel, images: imgs })}
                  maxImages={6}
                  placeholder="Kéo thả thêm ảnh khuôn viên, sảnh, hồ bơi vào đây..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giờ nhận phòng (Check-in)</label>
                  <input
                    type="text"
                    value={editingHotel.checkInTime}
                    onChange={(e) => setEditingHotel({ ...editingHotel, checkInTime: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giờ trả phòng (Check-out)</label>
                  <input
                    type="text"
                    value={editingHotel.checkOutTime}
                    onChange={(e) => setEditingHotel({ ...editingHotel, checkOutTime: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Chính sách hủy phòng</label>
                <input
                  type="text"
                  value={editingHotel.cancellationPolicy}
                  onChange={(e) => setEditingHotel({ ...editingHotel, cancellationPolicy: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditHotelOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md"
                >
                  Lưu Thay Đổi Khách Sạn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD NEW HOTEL
          ======================================================== */}
      {isAddHotelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-600" /> Thêm Cơ Sở Lưu Trú Mới
              </h3>
              <button onClick={() => setIsAddHotelOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHotel} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tên khách sạn / homestay *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Da Nang Golden Bay Hotel"
                    value={newHotel.name}
                    onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại hình</label>
                  <select
                    value={newHotel.type}
                    onChange={(e) => setNewHotel({ ...newHotel, type: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="hotel">Khách sạn</option>
                    <option value="homestay">Homestay</option>
                    <option value="resort">Resort nghỉ dưỡng</option>
                    <option value="apartment">Căn hộ du lịch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quận / Huyện</label>
                  <select
                    value={newHotel.district}
                    onChange={(e) => setNewHotel({ ...newHotel, district: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    {DANANG_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Xếp hạng sao (1 - 5 sao)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newHotel.starRating}
                    onChange={(e) => setNewHotel({ ...newHotel, starRating: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Địa chỉ chi tiết *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: 01 Lê Văn Duyệt, Nại Hiên Đông"
                  value={newHotel.address}
                  onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số điện thoại hotline *</label>
                  <input
                    type="text"
                    required
                    placeholder="0236 382 8888"
                    value={newHotel.phone}
                    onChange={(e) => setNewHotel({ ...newHotel, phone: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email liên hệ *</label>
                  <input
                    type="email"
                    required
                    placeholder="booking@dananghotel.vn"
                    value={newHotel.email}
                    onChange={(e) => setNewHotel({ ...newHotel, email: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô tả khách sạn</label>
                <textarea
                  rows={3}
                  placeholder="Giới thiệu về vị trí ngắm Cầu Rồng, gần biển Mỹ Khê, dịch vụ..."
                  value={newHotel.description}
                  onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tiện ích (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={newHotel.amenities}
                  onChange={(e) => setNewHotel({ ...newHotel, amenities: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Ảnh đại diện khách sạn (Kéo thả từ máy tính hoặc bấm chọn file) *
                </label>
                <ImageUploader
                  images={newHotel.coverImage ? [newHotel.coverImage] : []}
                  onChange={(imgs) => setNewHotel({ ...newHotel, coverImage: imgs[0] || '' })}
                  maxImages={1}
                  placeholder="Kéo thả ảnh đại diện khách sạn vào đây..."
                />
              </div>

              {/* Gallery Images */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Bộ sưu tập ảnh khuôn viên & tiện ích (Kéo thả nhiều ảnh)
                </label>
                <ImageUploader
                  images={newHotel.images || []}
                  onChange={(imgs) => setNewHotel({ ...newHotel, images: imgs })}
                  maxImages={6}
                  placeholder="Kéo thả các ảnh phụ vào đây..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddHotelOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md"
                >
                  Tạo Khách Sạn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: HOTEL ROOMS MANAGER
          ======================================================== */}
      {selectedHotelForRooms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                    Quản lý phòng
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{selectedHotelForRooms.district}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {selectedHotelForRooms.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddRoomOpen(true)}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Thêm Hạng Phòng Mới
                </button>
                <button
                  onClick={() => setSelectedHotelForRooms(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Rooms List */}
            {(!selectedHotelForRooms.rooms || selectedHotelForRooms.rooms.length === 0) ? (
              <div className="py-12 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Chưa có hạng phòng nào cho cơ sở này. Bấm <strong>"Thêm Hạng Phòng Mới"</strong> để bắt đầu tạo.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedHotelForRooms.rooms.map((room) => (
                  <div key={room._id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex gap-3">
                      <img
                        src={room.coverImage || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500'}
                        alt={room.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{room.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            room.isLocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {room.isLocked ? 'Khóa bán' : 'Đang mở'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{room.type} • {room.bedType}</p>
                        <p className="text-[11px] font-bold text-teal-700 mt-1">
                          Ngày thường: {formatVND(room.pricePerNight)}
                        </p>
                        <p className="text-[10px] text-amber-600 font-semibold">
                          DIFF 2026: {formatVND(room.diffFestivalPrice || room.pricePerNight)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Trống: <strong>{room.availableRooms} / {room.totalRooms}</strong> phòng</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleRoomLock(room._id)}
                          className={`p-1.5 rounded-lg text-xs font-bold ${
                            room.isLocked ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}
                          title={room.isLocked ? 'Mở bán phòng' : 'Tạm khóa phòng'}
                        >
                          {room.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleOpenEditRoom(room)}
                          className="px-2.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold rounded-lg flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room._id)}
                          className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT ROOM
          ======================================================== */}
      {isEditRoomOpen && editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-600" /> Tùy Chỉnh Hạng Phòng
              </h3>
              <button onClick={() => setIsEditRoomOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoomEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên hạng phòng *</label>
                <input
                  type="text"
                  required
                  value={editingRoom.name}
                  onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phân loại phòng</label>
                  <select
                    value={editingRoom.type}
                    onChange={(e) => setEditingRoom({ ...editingRoom, type: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Superior">Superior</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại giường</label>
                  <input
                    type="text"
                    value={editingRoom.bedType}
                    onChange={(e) => setEditingRoom({ ...editingRoom, bedType: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Khách tiêu chuẩn</label>
                  <input
                    type="number"
                    value={editingRoom.standardGuests}
                    onChange={(e) => setEditingRoom({ ...editingRoom, standardGuests: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Khách tối đa</label>
                  <input
                    type="number"
                    value={editingRoom.maxGuests}
                    onChange={(e) => setEditingRoom({ ...editingRoom, maxGuests: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diện tích (m²)</label>
                  <input
                    type="number"
                    value={editingRoom.roomSize}
                    onChange={(e) => setEditingRoom({ ...editingRoom, roomSize: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                <p className="font-black text-purple-900 text-[11px] flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> Cài đặt giá động theo thời điểm
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Ngày thường (VNĐ)</label>
                    <input
                      type="number"
                      required
                      value={editingRoom.pricePerNight}
                      onChange={(e) => setEditingRoom({ ...editingRoom, pricePerNight: Number(e.target.value) })}
                      className="w-full p-2 border rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Cuối tuần T6-CN</label>
                    <input
                      type="number"
                      value={editingRoom.weekendPrice}
                      onChange={(e) => setEditingRoom({ ...editingRoom, weekendPrice: Number(e.target.value) })}
                      className="w-full p-2 border rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Pháo hoa DIFF 2026</label>
                    <input
                      type="number"
                      value={editingRoom.diffFestivalPrice}
                      onChange={(e) => setEditingRoom({ ...editingRoom, diffFestivalPrice: Number(e.target.value) })}
                      className="w-full p-2 border rounded-xl text-xs font-bold text-purple-700"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tổng số phòng</label>
                  <input
                    type="number"
                    value={editingRoom.totalRooms}
                    onChange={(e) => setEditingRoom({ ...editingRoom, totalRooms: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phòng đang trống</label>
                  <input
                    type="number"
                    value={editingRoom.availableRooms}
                    onChange={(e) => setEditingRoom({ ...editingRoom, availableRooms: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tiện nghi trong phòng</label>
                <input
                  type="text"
                  value={editingRoom.amenitiesStr}
                  onChange={(e) => setEditingRoom({ ...editingRoom, amenitiesStr: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Ảnh hạng phòng (Kéo thả từ máy tính hoặc bấm chọn file) *
                </label>
                <ImageUploader
                  images={editingRoom.coverImage ? [editingRoom.coverImage] : []}
                  onChange={(imgs) => setEditingRoom({ ...editingRoom, coverImage: imgs[0] || '' })}
                  maxImages={1}
                  placeholder="Kéo thả ảnh phòng vào đây..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditRoomOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md"
                >
                  Lưu Thay Đổi Phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD NEW ROOM
          ======================================================== */}
      {isAddRoomOpen && selectedHotelForRooms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-600" /> Thêm Hạng Phòng Mới ({selectedHotelForRooms.name})
              </h3>
              <button onClick={() => setIsAddRoomOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên hạng phòng *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Deluxe Ocean View Suite"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phân loại phòng</label>
                  <select
                    value={newRoom.type}
                    onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Superior">Superior</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại giường</label>
                  <input
                    type="text"
                    value={newRoom.bedType}
                    onChange={(e) => setNewRoom({ ...newRoom, bedType: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Khách tiêu chuẩn</label>
                  <input
                    type="number"
                    value={newRoom.standardGuests}
                    onChange={(e) => setNewRoom({ ...newRoom, standardGuests: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Khách tối đa</label>
                  <input
                    type="number"
                    value={newRoom.maxGuests}
                    onChange={(e) => setNewRoom({ ...newRoom, maxGuests: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diện tích (m²)</label>
                  <input
                    type="number"
                    value={newRoom.roomSize}
                    onChange={(e) => setNewRoom({ ...newRoom, roomSize: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                <p className="font-black text-purple-900 text-[11px] flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> Bảng giá phòng
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Ngày thường (VNĐ)</label>
                    <input
                      type="number"
                      required
                      value={newRoom.pricePerNight}
                      onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: Number(e.target.value) })}
                      className="w-full p-2 border rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Cuối tuần T6-CN</label>
                    <input
                      type="number"
                      value={newRoom.weekendPrice}
                      onChange={(e) => setNewRoom({ ...newRoom, weekendPrice: Number(e.target.value) })}
                      className="w-full p-2 border rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Pháo hoa DIFF 2026</label>
                    <input
                      type="number"
                      value={newRoom.diffFestivalPrice}
                      onChange={(e) => setNewRoom({ ...newRoom, diffFestivalPrice: Number(e.target.value) })}
                      className="w-full p-2 border rounded-xl text-xs font-bold text-purple-700"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tổng số phòng</label>
                  <input
                    type="number"
                    value={newRoom.totalRooms}
                    onChange={(e) => setNewRoom({ ...newRoom, totalRooms: Number(e.target.value), availableRooms: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tiện nghi (phân cách phẩy)</label>
                  <input
                    type="text"
                    value={newRoom.amenities}
                    onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Ảnh phòng (Kéo thả từ máy tính hoặc bấm chọn file) *
                </label>
                <ImageUploader
                  images={newRoom.coverImage ? [newRoom.coverImage] : []}
                  onChange={(imgs) => setNewRoom({ ...newRoom, coverImage: imgs[0] || '' })}
                  maxImages={1}
                  placeholder="Kéo thả ảnh phòng vào đây..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddRoomOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md"
                >
                  Tạo Hạng Phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT DESTINATION
          ======================================================== */}
      {isEditDestOpen && editingDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-600" /> Tùy Chỉnh Điểm Đến Cẩm Nang Đà Nẵng
              </h3>
              <button onClick={() => setIsEditDestOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDest} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tên điểm đến *</label>
                  <input
                    type="text"
                    required
                    value={editingDest.name}
                    onChange={(e) => setEditingDest({ ...editingDest, name: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phân loại</label>
                  <select
                    value={editingDest.category}
                    onChange={(e) => setEditingDest({ ...editingDest, category: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="nature">Thiên nhiên biển đảo</option>
                    <option value="beach">Bãi biển</option>
                    <option value="heritage">Di sản & Cầu</option>
                    <option value="spiritual">Văn hóa tâm linh</option>
                    <option value="cuisine">Ẩm thực & Chợ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quận / Huyện</label>
                  <select
                    value={editingDest.district}
                    onChange={(e) => setEditingDest({ ...editingDest, district: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    {DANANG_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giá vé tham quan</label>
                  <input
                    type="text"
                    value={editingDest.ticketPrice}
                    onChange={(e) => setEditingDest({ ...editingDest, ticketPrice: e.target.value })}
                    placeholder="VD: Miễn phí hoặc 70.000 VNĐ"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Địa chỉ cụ thể *</label>
                <input
                  type="text"
                  required
                  value={editingDest.address}
                  onChange={(e) => setEditingDest({ ...editingDest, address: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giờ mở cửa</label>
                  <input
                    type="text"
                    value={editingDest.openingHours}
                    onChange={(e) => setEditingDest({ ...editingDest, openingHours: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thời điểm đẹp nhất</label>
                  <input
                    type="text"
                    value={editingDest.bestTimeToVisit}
                    onChange={(e) => setEditingDest({ ...editingDest, bestTimeToVisit: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô tả tóm tắt</label>
                <textarea
                  rows={2}
                  value={editingDest.description}
                  onChange={(e) => setEditingDest({ ...editingDest, description: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nội dung chi tiết cẩm nang</label>
                <textarea
                  rows={4}
                  value={editingDest.content}
                  onChange={(e) => setEditingDest({ ...editingDest, content: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Ảnh đại diện điểm đến (Kéo thả từ máy tính) *
                </label>
                <ImageUploader
                  images={editingDest.coverImage ? [editingDest.coverImage] : []}
                  onChange={(imgs) => setEditingDest({ ...editingDest, coverImage: imgs[0] || '' })}
                  maxImages={1}
                  placeholder="Kéo thả ảnh điểm đến vào đây..."
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Ảnh bộ sưu tập bổ sung
                </label>
                <ImageUploader
                  images={editingDest.images || []}
                  onChange={(imgs) => setEditingDest({ ...editingDest, images: imgs })}
                  maxImages={6}
                  placeholder="Kéo thả thêm ảnh phong cảnh..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditDestOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md"
                >
                  Lưu Điểm Đến
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD NEW DESTINATION
          ======================================================== */}
      {isAddDestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-600" /> Thêm Điểm Đến Du Lịch Mới
              </h3>
              <button onClick={() => setIsAddDestOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDest} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tên điểm đến *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Cầu Rồng Đà Nẵng"
                    value={newDest.name}
                    onChange={(e) => setNewDest({ ...newDest, name: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phân loại</label>
                  <select
                    value={newDest.category}
                    onChange={(e) => setNewDest({ ...newDest, category: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="nature">Thiên nhiên biển đảo</option>
                    <option value="beach">Bãi biển</option>
                    <option value="heritage">Di sản & Cầu</option>
                    <option value="spiritual">Văn hóa tâm linh</option>
                    <option value="cuisine">Ẩm thực & Chợ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quận / Huyện</label>
                  <select
                    value={newDest.district}
                    onChange={(e) => setNewDest({ ...newDest, district: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    {DANANG_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giá vé tham quan</label>
                  <input
                    type="text"
                    value={newDest.ticketPrice}
                    onChange={(e) => setNewDest({ ...newDest, ticketPrice: e.target.value })}
                    placeholder="Miễn phí"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Địa chỉ cụ thể *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn Linh, Phước Ninh, Hải Châu"
                  value={newDest.address}
                  onChange={(e) => setNewDest({ ...newDest, address: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô tả ngắn *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Biểu tượng kiến trúc hiện đại của Đà Nẵng với màn phun lửa & phun nước cuối tuần..."
                  value={newDest.description}
                  onChange={(e) => setNewDest({ ...newDest, description: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nội dung cẩm nang chi tiết</label>
                <textarea
                  rows={4}
                  placeholder="Lịch phun lửa: 21:00 Thứ 7 và Chủ nhật hàng tuần. Vị trí ngắm đẹp nhất..."
                  value={newDest.content}
                  onChange={(e) => setNewDest({ ...newDest, content: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Ảnh đại diện điểm đến (Kéo thả từ máy tính) *
                </label>
                <ImageUploader
                  images={newDest.coverImage ? [newDest.coverImage] : []}
                  onChange={(imgs) => setNewDest({ ...newDest, coverImage: imgs[0] || '' })}
                  maxImages={1}
                  placeholder="Kéo thả ảnh điểm đến vào đây..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddDestOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md"
                >
                  Tạo Điểm Đến
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD VOUCHER
          ======================================================== */}
      {isAddVoucherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">Tạo Mã Khuyến Mãi Mới</h3>
            <form onSubmit={handleCreateVoucher} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mã code (VD: DIFF2026) *</label>
                <input
                  type="text"
                  required
                  value={newVoucher.code}
                  onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value.toUpperCase() })}
                  className="w-full uppercase font-mono p-2.5 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tiêu đề khuyến mãi *</label>
                <input
                  type="text"
                  required
                  value={newVoucher.title}
                  onChange={(e) => setNewVoucher({ ...newVoucher, title: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại giảm</label>
                  <select
                    value={newVoucher.discountType}
                    onChange={(e) => setNewVoucher({ ...newVoucher, discountType: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="percent">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (VNĐ)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giá trị giảm</label>
                  <input
                    type="number"
                    required
                    value={newVoucher.discountValue}
                    onChange={(e) => setNewVoucher({ ...newVoucher, discountValue: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mức giảm tối đa</label>
                  <input
                    type="number"
                    value={newVoucher.maxDiscount}
                    onChange={(e) => setNewVoucher({ ...newVoucher, maxDiscount: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Đơn tối thiểu</label>
                  <input
                    type="number"
                    value={newVoucher.minSpend}
                    onChange={(e) => setNewVoucher({ ...newVoucher, minSpend: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số lượt phát hành</label>
                  <input
                    type="number"
                    value={newVoucher.totalUsageLimit}
                    onChange={(e) => setNewVoucher({ ...newVoucher, totalUsageLimit: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ngày kết thúc</label>
                  <input
                    type="date"
                    required
                    value={newVoucher.endDate}
                    onChange={(e) => setNewVoucher({ ...newVoucher, endDate: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddVoucherOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 text-white font-bold rounded-xl shadow-md"
                >
                  Lưu voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
