import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Search, 
  CheckCircle2, 
  LogOut as LogOutIcon, 
  Building2, 
  Bed, 
  Plus, 
  Lock, 
  Unlock, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  Users, 
  AlertTriangle,
  Send,
  Printer,
  Edit3,
  Trash2,
  Settings,
  Image as ImageIcon
} from 'lucide-react';
import api from '../../services/api';
import QRScannerModal from '../../components/QRScannerModal';
import ImageUploader from '../../components/ImageUploader';
import { formatVND, formatDate, getStatusBadge, DANANG_DISTRICTS } from '../../utils/formatters';

export default function HotelierDashboard() {
  const [activeTab, setActiveTab] = useState('reception'); // 'reception' | 'rooms' | 'bookings' | 'reviews' | 'hotel-info'

  // Reception Desk State
  const [searchQuery, setSearchQuery] = useState('');
  const [scannedBooking, setScannedBooking] = useState(null);
  const [receptionMsg, setReceptionMsg] = useState({ type: '', text: '' });
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [loadingLookup, setLoadingLookup] = useState(false);

  // Rooms Management State
  const [myHotels, setMyHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);

  // New room form state
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
    amenities: 'Điều hòa, Tủ lạnh mini, Ban công, Tivi 50 inch, Nước nóng lạnh',
    coverImage: ''
  });

  // Hotel Profile Form State
  const [hotelForm, setHotelForm] = useState({
    name: '',
    type: 'hotel',
    district: 'Sơn Trà',
    address: '',
    phone: '',
    email: '',
    description: '',
    amenities: '',
    coverImage: '',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    cancellationPolicy: 'Hủy miễn phí trước 24 giờ nhận phòng',
    petAllowed: false,
    childPolicy: 'Miễn phí trẻ em dưới 6 tuổi'
  });
  const [hotelSaveMsg, setHotelSaveMsg] = useState('');
  const [savingHotel, setSavingHotel] = useState(false);

  // Bookings state
  const [hotelBookings, setHotelBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Reviews state
  const [hotelReviews, setHotelReviews] = useState([]);
  const [replyComments, setReplyComments] = useState({});

  // Load hotelier's hotels
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await api.get('/hotels/owner/me');
        if (res.data.success && res.data.hotels.length > 0) {
          setMyHotels(res.data.hotels);
          setSelectedHotel(res.data.hotels[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHotels();
  }, []);

  // Load rooms and hotel profile when selected hotel changes
  useEffect(() => {
    if (selectedHotel) {
      fetchRooms(selectedHotel._id);
      fetchBookings(selectedHotel._id);
      fetchReviews(selectedHotel._id);

      setHotelForm({
        name: selectedHotel.name || '',
        type: selectedHotel.type || 'hotel',
        district: selectedHotel.district || 'Sơn Trà',
        address: selectedHotel.address || '',
        phone: selectedHotel.phone || '',
        email: selectedHotel.email || '',
        description: selectedHotel.description || '',
        amenities: selectedHotel.amenities?.join(', ') || '',
        coverImage: selectedHotel.coverImage || '',
        checkInTime: selectedHotel.policies?.checkInTime || '14:00',
        checkOutTime: selectedHotel.policies?.checkOutTime || '12:00',
        cancellationPolicy: selectedHotel.policies?.cancellationPolicy || 'Hủy miễn phí trước 24 giờ nhận phòng',
        petAllowed: selectedHotel.policies?.petAllowed || false,
        childPolicy: selectedHotel.policies?.childPolicy || 'Miễn phí trẻ em dưới 6 tuổi'
      });
    }
  }, [selectedHotel]);

  const fetchRooms = async (hotelId) => {
    setLoadingRooms(true);
    try {
      const res = await api.get(`/rooms/hotel/${hotelId}`);
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const fetchBookings = async (hotelId) => {
    setLoadingBookings(true);
    try {
      const res = await api.get(`/bookings/hotelier?hotelId=${hotelId}`);
      if (res.data.success) {
        setHotelBookings(res.data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchReviews = async (hotelId) => {
    try {
      const res = await api.get(`/reviews/hotel/${hotelId}`);
      if (res.data.success) {
        setHotelReviews(res.data.reviews);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reception lookup
  const handleLookup = async (queryValue) => {
    const q = queryValue || searchQuery;
    if (!q) return;

    setLoadingLookup(true);
    setReceptionMsg({ type: '', text: '' });
    try {
      const res = await api.post('/checkin/lookup', { query: q });
      if (res.data.success) {
        setScannedBooking(res.data.booking);
      }
    } catch (err) {
      setScannedBooking(null);
      setReceptionMsg({
        type: 'error',
        text: err.response?.data?.message || 'Không tìm thấy đơn đặt phòng hoặc đơn không thuộc cơ sở này'
      });
    } finally {
      setLoadingLookup(false);
    }
  };

  // Reception actions
  const handleConfirmCheckIn = async () => {
    if (!scannedBooking) return;
    try {
      const res = await api.post('/checkin/confirm-in', { bookingId: scannedBooking._id });
      if (res.data.success) {
        setScannedBooking(res.data.booking);
        setReceptionMsg({ type: 'success', text: res.data.message });
        if (selectedHotel) fetchBookings(selectedHotel._id);
      }
    } catch (err) {
      setReceptionMsg({ type: 'error', text: err.response?.data?.message || 'Lỗi Check-in' });
    }
  };

  const handleConfirmCheckOut = async () => {
    if (!scannedBooking) return;
    try {
      const res = await api.post('/checkin/confirm-out', { bookingId: scannedBooking._id });
      if (res.data.success) {
        setScannedBooking(res.data.booking);
        setReceptionMsg({ type: 'success', text: res.data.message });
        if (selectedHotel) fetchBookings(selectedHotel._id);
      }
    } catch (err) {
      setReceptionMsg({ type: 'error', text: err.response?.data?.message || 'Lỗi Check-out' });
    }
  };

  const handleMarkNoShow = async () => {
    if (!scannedBooking) return;
    if (!window.confirm('Xác nhận ghi nhận khách vắng mặt (No-show) và giải phóng phòng?')) return;
    try {
      const res = await api.post('/checkin/no-show', { bookingId: scannedBooking._id });
      if (res.data.success) {
        setScannedBooking(res.data.booking);
        setReceptionMsg({ type: 'success', text: res.data.message });
        if (selectedHotel) fetchBookings(selectedHotel._id);
      }
    } catch (err) {
      setReceptionMsg({ type: 'error', text: err.response?.data?.message || 'Lỗi xử lý' });
    }
  };

  // Toggle lock room
  const handleToggleLock = async (roomId) => {
    try {
      const res = await api.put(`/rooms/${roomId}/toggle-lock`);
      if (res.data.success && selectedHotel) {
        fetchRooms(selectedHotel._id);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể thao tác');
    }
  };

  // Open Edit Room Modal
  const handleOpenEditRoom = (room) => {
    setEditingRoom({
      ...room,
      amenitiesStr: Array.isArray(room.amenities) ? room.amenities.join(', ') : (room.amenities || '')
    });
    setIsEditRoomOpen(true);
  };

  // Save Room Edit
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
        alert('Cập nhật thông tin phòng thành công!');
        setIsEditRoomOpen(false);
        setEditingRoom(null);
        if (selectedHotel) fetchRooms(selectedHotel._id);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi cập nhật phòng');
    }
  };

  // Delete Room
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hạng phòng này?')) return;
    try {
      const res = await api.delete(`/rooms/${roomId}`);
      if (res.data.success) {
        alert('Đã xóa hạng phòng thành công!');
        if (selectedHotel) fetchRooms(selectedHotel._id);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa phòng');
    }
  };

  // Create room
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!selectedHotel) return;
    if (!newRoom.coverImage) {
      alert('Vui lòng tải ảnh đại diện cho phòng!');
      return;
    }

    try {
      const amenitiesArr = newRoom.amenities.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.post('/rooms', {
        ...newRoom,
        hotelId: selectedHotel._id,
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
          amenities: 'Điều hòa, Tủ lạnh mini, Ban công, Tivi 50 inch, Nước nóng lạnh',
          coverImage: ''
        });
        fetchRooms(selectedHotel._id);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi tạo phòng');
    }
  };

  // Save Hotel Information
  const handleSaveHotelInfo = async (e) => {
    e.preventDefault();
    if (!selectedHotel) return;
    setSavingHotel(true);
    setHotelSaveMsg('');

    try {
      const amenitiesArr = hotelForm.amenities.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.put(`/hotels/${selectedHotel._id}`, {
        name: hotelForm.name,
        type: hotelForm.type,
        district: hotelForm.district,
        address: hotelForm.address,
        phone: hotelForm.phone,
        email: hotelForm.email,
        description: hotelForm.description,
        coverImage: hotelForm.coverImage,
        amenities: amenitiesArr,
        policies: {
          checkInTime: hotelForm.checkInTime,
          checkOutTime: hotelForm.checkOutTime,
          cancellationPolicy: hotelForm.cancellationPolicy,
          petAllowed: hotelForm.petAllowed,
          childPolicy: hotelForm.childPolicy
        }
      });

      if (res.data.success) {
        setHotelSaveMsg('Cập nhật thông tin khách sạn thành công!');
        setSelectedHotel(res.data.hotel);
      }
    } catch (err) {
      setHotelSaveMsg(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin');
    } finally {
      setSavingHotel(false);
    }
  };

  // Reply review
  const handleSendReply = async (reviewId) => {
    const text = replyComments[reviewId];
    if (!text || !text.trim()) return;

    try {
      const res = await api.put(`/reviews/${reviewId}/reply`, { comment: text.trim() });
      if (res.data.success && selectedHotel) {
        alert('Đã gửi câu trả lời cho du khách!');
        fetchReviews(selectedHotel._id);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi gửi phản hồi');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header with hotel selector */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[10px] font-bold uppercase">
              Hostay Hotelier Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Quầy Lễ Tân & Quản Trị Cơ Sở Lưu Trú
          </h1>
          <p className="text-xs text-blue-200">
            Tùy chỉnh thông tin khách sạn, tải ảnh kéo thả từ máy tính, quản lý giá bán lễ hội DIFF & Check-in QR.
          </p>
        </div>

        {myHotels.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <label className="block text-[10px] uppercase font-bold text-blue-200 mb-1">Cơ sở đang quản lý:</label>
            <select
              value={selectedHotel?._id || ''}
              onChange={(e) => setSelectedHotel(myHotels.find(h => h._id === e.target.value))}
              className="bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl outline-none cursor-pointer"
            >
              {myHotels.map(h => (
                <option key={h._id} value={h._id}>{h.name} ({h.district})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('reception')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'reception'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-4 h-4" /> Quầy Check-in / Check-out QR
        </button>

        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'rooms'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bed className="w-4 h-4" /> Quản lý Hạng Phòng & Giá Mùa Vụ ({rooms.length})
        </button>

        <button
          onClick={() => setActiveTab('hotel-info')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'hotel-info'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" /> Chỉnh Sửa Thông Tin Cơ Sở
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'bookings'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" /> Lịch Đặt Phòng ({hotelBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'reviews'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Đánh Giá Khách Hàng ({hotelReviews.length})
        </button>
      </div>

      {/* TAB 1: RECEPTION DESK */}
      {activeTab === 'reception' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Lookup Panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-600" /> Tra Cứu Khách Nhận Phòng
            </h3>

            {/* Camera QR scan trigger */}
            <button
              onClick={() => setIsScannerOpen(true)}
              className="w-full py-4 border-2 border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-blue-700 transition-colors"
            >
              <QrCode className="w-8 h-8 mb-1.5" />
              <span className="text-xs font-bold">Mở Camera / Quét QR trên vé khách</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase">Hoặc nhập tay</span>
            </div>

            {/* Manual input */}
            <form onSubmit={(e) => { e.preventDefault(); handleLookup(); }} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã đặt chỗ (VD: HT-2026-9A82) hoặc SĐT
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="HT-2026-..."
                    className="flex-1 text-xs uppercase font-mono p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loadingLookup}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {receptionMsg.text && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                receptionMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {receptionMsg.text}
              </div>
            )}
          </div>

          {/* Booking Verification Card & Actions */}
          <div className="lg:col-span-2 space-y-4">
            {scannedBooking ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                      {scannedBooking.bookingCode}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 mt-2">{scannedBooking.guestInfo?.name}</h2>
                    <p className="text-xs text-slate-500">SĐT: {scannedBooking.guestInfo?.phone} • Email: {scannedBooking.guestInfo?.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(scannedBooking.status).class}`}>
                      {getStatusBadge(scannedBooking.status).label}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      TT: <span className="font-bold text-slate-800">{scannedBooking.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                    </p>
                  </div>
                </div>

                {/* Stay Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Hạng phòng</span>
                    <span className="font-bold text-slate-900">{scannedBooking.room?.name}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Thời gian</span>
                    <span className="font-bold text-slate-900">{formatDate(scannedBooking.checkInDate)} → {formatDate(scannedBooking.checkOutDate)}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Số khách & Đêm</span>
                    <span className="font-bold text-slate-900">{scannedBooking.nights} đêm • {scannedBooking.roomQuantity} phòng</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Thực thu</span>
                    <span className="font-bold text-blue-700">{formatVND(scannedBooking.pricing?.finalTotal)}</span>
                  </div>
                </div>

                {scannedBooking.guestInfo?.specialRequests && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <span className="font-bold">Ghi chú từ khách:</span> {scannedBooking.guestInfo?.specialRequests}
                  </div>
                )}

                {/* Receptionist Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                  {scannedBooking.status === 'confirmed' && (
                    <button
                      onClick={handleConfirmCheckIn}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Xác Nhận Nhận Phòng (Check-in)
                    </button>
                  )}

                  {scannedBooking.status === 'checked_in' && (
                    <button
                      onClick={handleConfirmCheckOut}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5"
                    >
                      <LogOutIcon className="w-4 h-4" /> Xác Nhận Trả Phòng (Check-out) & Mở Đánh Giá
                    </button>
                  )}

                  {scannedBooking.status === 'confirmed' && (
                    <button
                      onClick={handleMarkNoShow}
                      className="px-4 py-3 bg-slate-100 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl"
                    >
                      Khách vắng mặt (No-show)
                    </button>
                  )}

                  {scannedBooking.status === 'completed' && (
                    <div className="p-3 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Đơn phòng này đã hoàn tất thủ tục lưu trú.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center space-y-2">
                <QrCode className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">Chưa chọn hoặc quét đơn đặt phòng</h4>
                <p className="text-xs text-slate-400">
                  Dùng ô tìm kiếm bên trái hoặc bấm nút Quét Camera QR để đối chiếu vé của du khách.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: ROOMS & INVENTORY */}
      {activeTab === 'rooms' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Danh Mục Hạng Phòng & Bảng Giá</h3>
              <p className="text-xs text-slate-500">Cấu hình giá đêm thường, giá cuối tuần và giá mùa Lễ hội pháo hoa DIFF.</p>
            </div>
            <button
              onClick={() => setIsAddRoomOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Thêm Hạng Phòng Mới
            </button>
          </div>

          {loadingRooms ? (
            <div className="text-center py-12">Đang tải danh sách phòng...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div key={room._id} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
                  <div>
                    <div className="relative h-48 bg-slate-100">
                      <img 
                        src={room.coverImage} 
                        alt={room.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase">
                        Hạng {room.type}
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleLock(room._id)}
                          title={room.isLocked ? "Mở bán lại" : "Khóa phòng"}
                          className={`p-1.5 rounded-xl shadow-md ${room.isLocked ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}
                        >
                          {room.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h4 className="font-black text-base text-slate-900 line-clamp-1">{room.name}</h4>
                      <p className="text-xs text-slate-500">{room.bedType} • {room.roomSize} m² • {room.standardGuests} khách</p>

                      <div className="space-y-1 text-xs pt-1 border-t border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Giá ngày thường:</span>
                          <span className="font-bold text-slate-900">{formatVND(room.pricePerNight)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Giá cuối tuần:</span>
                          <span className="font-bold text-blue-700">{formatVND(room.weekendPrice || room.pricePerNight)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Mùa DIFF (Pháo hoa):</span>
                          <span className="font-bold text-amber-600">{formatVND(room.diffFestivalPrice || room.pricePerNight)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 space-y-3">
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-xs text-slate-500">
                        Còn trống: <span className="font-bold text-emerald-600">{room.availableRooms}/{room.totalRooms}</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${room.isLocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {room.isLocked ? 'Đang khóa' : 'Đang mở bán'}
                      </span>
                    </div>

                    {/* Action buttons: Edit and Delete */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => handleOpenEditRoom(room)}
                        className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Sửa thông tin
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa phòng
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: EDIT HOTEL PROFILE & INFORMATION */}
      {activeTab === 'hotel-info' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">Tùy Chỉnh Thông Tin Khách Sạn & Chính Sách</h3>
              <p className="text-xs text-slate-500">Cập nhật ảnh đại diện từ máy tính, địa chỉ, số điện thoại lễ tân và quy định giờ nhận/trả phòng.</p>
            </div>
          </div>

          {hotelSaveMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl">
              {hotelSaveMsg}
            </div>
          )}

          <form onSubmit={handleSaveHotelInfo} className="space-y-6">
            
            {/* Drag and Drop Hotel Image Upload */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase">Hình Ảnh Đại Diện Khách Sạn</h4>
              <ImageUploader
                value={hotelForm.coverImage}
                onChange={(url) => setHotelForm({ ...hotelForm, coverImage: url })}
                label="Ảnh bìa cơ sở lưu trú (Kéo thả ảnh chụp mặt tiền / sảnh từ máy tính)"
              />
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Tên khách sạn / Homestay *</label>
                <input
                  type="text"
                  required
                  value={hotelForm.name}
                  onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Loại hình cơ sở</label>
                <select
                  value={hotelForm.type}
                  onChange={(e) => setHotelForm({ ...hotelForm, type: e.target.value })}
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hotel">Khách sạn</option>
                  <option value="homestay">Homestay</option>
                  <option value="resort">Resort (Khu nghỉ dưỡng)</option>
                  <option value="apartment">Căn hộ dịch vụ</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Quận / Huyện Đà Nẵng</label>
                <select
                  value={hotelForm.district}
                  onChange={(e) => setHotelForm({ ...hotelForm, district: e.target.value })}
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DANANG_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Địa chỉ cụ thể *</label>
                <input
                  type="text"
                  required
                  value={hotelForm.address}
                  onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Số điện thoại lễ tân *</label>
                <input
                  type="tel"
                  required
                  value={hotelForm.phone}
                  onChange={(e) => setHotelForm({ ...hotelForm, phone: e.target.value })}
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email liên hệ *</label>
                <input
                  type="email"
                  required
                  value={hotelForm.email}
                  onChange={(e) => setHotelForm({ ...hotelForm, email: e.target.value })}
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Mô tả giới thiệu cơ sở</label>
                <textarea
                  rows={4}
                  value={hotelForm.description}
                  onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Tiện nghi chung (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={hotelForm.amenities}
                  onChange={(e) => setHotelForm({ ...hotelForm, amenities: e.target.value })}
                  placeholder="Hồ bơi, Giáp biển, Bữa sáng miễn phí, Xe đưa đón sân bay, Cho thuê xe máy..."
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Policies */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 uppercase">Chính Sách Lưu Trú</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giờ Check-in</label>
                  <input
                    type="text"
                    value={hotelForm.checkInTime}
                    onChange={(e) => setHotelForm({ ...hotelForm, checkInTime: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giờ Check-out</label>
                  <input
                    type="text"
                    value={hotelForm.checkOutTime}
                    onChange={(e) => setHotelForm({ ...hotelForm, checkOutTime: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Chính sách hủy phòng</label>
                  <input
                    type="text"
                    value={hotelForm.cancellationPolicy}
                    onChange={(e) => setHotelForm({ ...hotelForm, cancellationPolicy: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Chính sách trẻ em</label>
                  <input
                    type="text"
                    value={hotelForm.childPolicy}
                    onChange={(e) => setHotelForm({ ...hotelForm, childPolicy: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="petAllowed"
                    checked={hotelForm.petAllowed}
                    onChange={(e) => setHotelForm({ ...hotelForm, petAllowed: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="petAllowed" className="font-bold text-slate-700 cursor-pointer">
                    Cho phép mang theo thú cưng
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingHotel}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {savingHotel ? 'Đang lưu...' : 'Lưu Thay Đổi Thông Tin Khách Sạn'}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 3: BOOKINGS LIST */}
      {activeTab === 'bookings' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">Danh Sách Khách Đặt Phòng Cơ Sở</h3>
            <span className="text-xs text-slate-500">Tổng cộng {hotelBookings.length} đơn</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Mã đơn</th>
                  <th className="py-3 px-3">Khách hàng</th>
                  <th className="py-3 px-3">Hạng phòng</th>
                  <th className="py-3 px-3">Lưu trú</th>
                  <th className="py-3 px-3">Số tiền</th>
                  <th className="py-3 px-3">Trạng thái</th>
                  <th className="py-3 px-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hotelBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">{b.bookingCode}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800">{b.guestInfo?.name}</p>
                      <p className="text-[10px] text-slate-400">{b.guestInfo?.phone}</p>
                    </td>
                    <td className="py-3 px-3">{b.room?.name}</td>
                    <td className="py-3 px-3">
                      {formatDate(b.checkInDate)} → {formatDate(b.checkOutDate)}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">{formatVND(b.pricing?.finalTotal)}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(b.status).class}`}>
                        {getStatusBadge(b.status).label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setScannedBooking(b);
                          setActiveTab('reception');
                        }}
                        className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-blue-600"
                      >
                        Xử lý Lễ Tân
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REVIEWS & REPLIES */}
      {activeTab === 'reviews' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <h3 className="text-base font-black text-slate-900">Phản Hồi Đánh Giá Từ Khách Hàng</h3>

          <div className="space-y-4">
            {hotelReviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Cơ sở chưa có đánh giá nào.</p>
            ) : (
              hotelReviews.map((rev) => (
                <div key={rev._id} className="p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{rev.user?.name}</p>
                      <p className="text-[10px] text-slate-400">{formatDate(rev.createdAt)}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-500">{rev.ratings?.overall} ★</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">"{rev.comment}"</p>

                  {/* Existing Reply */}
                  {rev.hotelierReply?.comment ? (
                    <div className="p-3 bg-blue-50 rounded-xl text-xs space-y-1">
                      <p className="font-bold text-blue-900">Câu trả lời của bạn:</p>
                      <p className="text-blue-800">{rev.hotelierReply.comment}</p>
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Viết câu trả lời cảm ơn hoặc giải thích cho khách..."
                        value={replyComments[rev._id] || ''}
                        onChange={(e) => setReplyComments({ ...replyComments, [rev._id]: e.target.value })}
                        className="flex-1 text-xs p-2 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleSendReply(rev._id)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" /> Trả lời
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD ROOM (With Drag-and-Drop ImageUploader) */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">Thêm Hạng Phòng Mới</h3>
            <form onSubmit={handleCreateRoom} className="mt-4 space-y-3 text-xs">
              
              {/* Drag and Drop Image Uploader */}
              <ImageUploader
                value={newRoom.coverImage}
                onChange={(url) => setNewRoom({ ...newRoom, coverImage: url })}
                label="Ảnh phòng (Kéo thả tệp từ máy tính)"
              />

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên hạng phòng *</label>
                <input
                  type="text"
                  required
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  placeholder="VD: Phòng Deluxe Ban Công Hướng Biển"
                  className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại phòng</label>
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
                    <option value="Dorm">Dorm</option>
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

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giá ngày thường</label>
                  <input
                    type="number"
                    required
                    value={newRoom.pricePerNight}
                    onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giá cuối tuần</label>
                  <input
                    type="number"
                    value={newRoom.weekendPrice}
                    onChange={(e) => setNewRoom({ ...newRoom, weekendPrice: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giá mùa DIFF</label>
                  <input
                    type="number"
                    value={newRoom.diffFestivalPrice}
                    onChange={(e) => setNewRoom({ ...newRoom, diffFestivalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diện tích (m²)</label>
                  <input
                    type="number"
                    value={newRoom.roomSize}
                    onChange={(e) => setNewRoom({ ...newRoom, roomSize: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số khách tiêu chuẩn</label>
                  <input
                    type="number"
                    value={newRoom.standardGuests}
                    onChange={(e) => setNewRoom({ ...newRoom, standardGuests: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tổng số phòng</label>
                  <input
                    type="number"
                    value={newRoom.totalRooms}
                    onChange={(e) => setNewRoom({ ...newRoom, totalRooms: Number(e.target.value), availableRooms: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tiện nghi phòng (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={newRoom.amenities}
                  onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddRoomOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Tạo phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ROOM (Tùy chỉnh thông tin phòng) */}
      {isEditRoomOpen && editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
              Chỉnh Sửa Thông Tin Hạng Phòng
            </h3>
            <form onSubmit={handleSaveRoomEdit} className="mt-4 space-y-3 text-xs">
              
              {/* Drag and Drop Image Uploader */}
              <ImageUploader
                value={editingRoom.coverImage}
                onChange={(url) => setEditingRoom({ ...editingRoom, coverImage: url })}
                label="Ảnh phòng (Kéo thả tệp từ máy tính để thay đổi)"
              />

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên hạng phòng *</label>
                <input
                  type="text"
                  required
                  value={editingRoom.name}
                  onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại phòng</label>
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
                    <option value="Dorm">Dorm</option>
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

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giá ngày thường (₫)</label>
                  <input
                    type="number"
                    required
                    value={editingRoom.pricePerNight}
                    onChange={(e) => setEditingRoom({ ...editingRoom, pricePerNight: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giá cuối tuần (₫)</label>
                  <input
                    type="number"
                    value={editingRoom.weekendPrice}
                    onChange={(e) => setEditingRoom({ ...editingRoom, weekendPrice: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giá mùa DIFF (₫)</label>
                  <input
                    type="number"
                    value={editingRoom.diffFestivalPrice}
                    onChange={(e) => setEditingRoom({ ...editingRoom, diffFestivalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diện tích (m²)</label>
                  <input
                    type="number"
                    value={editingRoom.roomSize}
                    onChange={(e) => setEditingRoom({ ...editingRoom, roomSize: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số khách tối đa</label>
                  <input
                    type="number"
                    value={editingRoom.maxGuests}
                    onChange={(e) => setEditingRoom({ ...editingRoom, maxGuests: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số phòng còn trống</label>
                  <input
                    type="number"
                    value={editingRoom.availableRooms}
                    onChange={(e) => setEditingRoom({ ...editingRoom, availableRooms: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tiện nghi phòng (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={editingRoom.amenitiesStr}
                  onChange={(e) => setEditingRoom({ ...editingRoom, amenitiesStr: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditRoomOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(code) => handleLookup(code)}
      />

    </div>
  );
}
