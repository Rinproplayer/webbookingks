import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Ticket, 
  User as UserIcon, 
  Lock, 
  Heart, 
  Building2, 
  Star, 
  Clock, 
  Calendar, 
  QrCode, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ReviewModal from '../../components/ReviewModal';
import { formatVND, formatDate, getStatusBadge } from '../../utils/formatters';

export default function CustomerDashboard() {
  const { user, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'profile' | 'password' | 'partner' | 'wishlist'
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Review modal state
  const [reviewBooking, setReviewBooking] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Profile form
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileAddress, setProfileAddress] = useState(user?.address || '');
  const [profileMessage, setProfileMessage] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  // Partner form
  const [bizName, setBizName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [partnerPhone, setPartnerPhone] = useState(user?.phone || '');
  const [bizAddress, setBizAddress] = useState('');
  const [partnerMessage, setPartnerMessage] = useState('');

  const [fetchError, setFetchError] = useState('');

  const fetchBookings = async () => {
    setLoadingBookings(true);
    setFetchError('');
    try {
      const res = await api.get(`/bookings/my-bookings?status=${statusFilter}`);
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Fetch bookings error:', err);
      if (err.response?.status === 401) {
        setFetchError('Phiên đăng nhập cũ đã hết hạn do vừa chuyển sang Database mới. Vui lòng bấm Đăng xuất và Đăng nhập lại.');
      }
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab, statusFilter]);

  // Cancel booking handler
  const handleCancelBooking = async (bookingId) => {
    const reason = prompt('Vui lòng nhập lý do hủy đặt phòng:');
    if (!reason) return;

    try {
      const res = await api.put(`/bookings/${bookingId}/cancel`, { reason });
      if (res.data.success) {
        alert('Hủy đơn đặt phòng thành công.');
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể hủy đơn đặt phòng này.');
    }
  };

  // Profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    try {
      const res = await api.put('/auth/profile', {
        name: profileName,
        phone: profilePhone,
        address: profileAddress
      });
      if (res.data.success) {
        setProfileMessage('Cập nhật thông tin thành công!');
        refreshUser();
      }
    } catch (err) {
      setProfileMessage(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // Password submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      if (res.data.success) {
        setPasswordMessage('Đổi mật khẩu thành công!');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setPasswordMessage(err.response?.data?.message || 'Đổi mật khẩu không thành công');
    }
  };

  // Partner submit
  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    setPartnerMessage('');
    try {
      const res = await api.post('/auth/partner-register', {
        businessName: bizName,
        taxOrIdNumber: taxNumber,
        contactPhone: partnerPhone,
        address: bizAddress
      });
      if (res.data.success) {
        setPartnerMessage(res.data.message);
        refreshUser();
      }
    } catch (err) {
      setPartnerMessage(err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header User profile badge */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border border-teal-500/30 shadow-sm"
          />
          <div>
            <h1 className="text-xl font-black text-slate-900">{user?.name}</h1>
            <p className="text-xs text-slate-500">{user?.email} • {user?.phone || 'Chưa cập nhật SĐT'}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                Vai trò: {user?.role}
              </span>
              {user?.partnerStatus === 'pending' && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Hồ sơ đối tác: Chờ duyệt
                </span>
              )}
            </div>
          </div>
        </div>

        {user?.partnerStatus === 'approved' && (
          <Link
            to="/hotelier"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4" /> Truy Cập Quầy Lễ Tân & Phòng
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'bookings'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Ticket className="w-4 h-4" /> Đơn đặt phòng của tôi
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'profile'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserIcon className="w-4 h-4" /> Hồ sơ cá nhân
        </button>

        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'password'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4" /> Đổi mật khẩu
        </button>

        {user?.role === 'customer' && (
          <button
            onClick={() => setActiveTab('partner')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
              activeTab === 'partner'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
            }`}
          >
            <Building2 className="w-4 h-4" /> Đăng ký bán phòng (Đối tác)
          </button>
        )}
      </div>

      {/* Tab 1: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'confirmed', label: 'Đã xác nhận' },
              { id: 'checked_in', label: 'Đang lưu trú' },
              { id: 'completed', label: 'Hoàn thành' },
              { id: 'cancelled', label: 'Đã hủy' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  statusFilter === st.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {fetchError && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between text-xs text-amber-900">
              <span className="font-medium">{fetchError}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('hostay_token');
                  localStorage.removeItem('hostay_user');
                  window.location.href = '/login';
                }}
                className="px-3 py-1.5 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 ml-3 shrink-0"
              >
                Đăng nhập lại ngay
              </button>
            </div>
          )}

          {loadingBookings ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-xs text-slate-500 mt-2">Đang tải danh sách đơn đặt...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Bạn chưa có đơn đặt phòng nào theo trạng thái này</p>
              <Link to="/hotels" className="inline-block px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl">
                Khám phá khách sạn Đà Nẵng
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const statusBadge = getStatusBadge(booking.status);
                return (
                  <div 
                    key={booking._id} 
                    className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5"
                  >
                    <img
                      src={booking.hotel?.coverImage || booking.room?.coverImage}
                      alt="hotel"
                      className="w-full sm:w-48 h-36 rounded-2xl object-cover shrink-0"
                    />

                    <div className="flex-1 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {booking.bookingCode}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge.class}`}>
                          {statusBadge.label}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-slate-900">{booking.hotel?.name}</h3>
                      <p className="text-xs text-slate-500 font-semibold">{booking.room?.name}</p>

                      <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-teal-600" />
                          {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)} ({booking.nights} đêm)
                        </span>
                        <span className="font-black text-teal-700">
                          Thanh toán: {formatVND(booking.pricing?.finalTotal)} ({booking.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'})
                        </span>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        {/* E-ticket View */}
                        <Link
                          to={`/ticket/${booking.bookingCode}`}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                        >
                          <QrCode className="w-3.5 h-3.5" /> Xem Phiếu Vé QR
                        </Link>

                        {/* Review Button if completed & not reviewed */}
                        {booking.status === 'completed' && !booking.isReviewed && (
                          <button
                            onClick={() => {
                              setReviewBooking(booking);
                              setIsReviewOpen(true);
                            }}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                          >
                            <Star className="w-3.5 h-3.5 fill-current" /> Viết Đánh Giá
                          </button>
                        )}

                        {booking.isReviewed && (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Đã gửi đánh giá
                          </span>
                        )}

                        {/* Cancel Button */}
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
                          >
                            Hủy đặt phòng
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900">Cập nhật hồ sơ cá nhân</h3>
          {profileMessage && (
            <p className="text-xs font-bold text-teal-700 bg-teal-50 p-2.5 rounded-xl">{profileMessage}</p>
          )}
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ</label>
              <input
                type="text"
                value={profileAddress}
                onChange={(e) => setProfileAddress(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl"
            >
              Lưu thay đổi
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Password */}
      {activeTab === 'password' && (
        <div className="max-w-xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900">Đổi mật khẩu tài khoản</h3>
          {passwordMessage && (
            <p className="text-xs font-bold text-teal-700 bg-teal-50 p-2.5 rounded-xl">{passwordMessage}</p>
          )}
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu hiện tại</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới (tối thiểu 6 ký tự)</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold rounded-xl"
            >
              Cập nhật mật khẩu
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Partner Request */}
      {activeTab === 'partner' && (
        <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">Đăng ký đối tác chủ khách sạn & homestay Đà Nẵng</h3>
            <p className="text-xs text-slate-500">
              Gửi thông tin cơ sở lưu trú của bạn để ban quản trị Hostay xét duyệt mở gian hàng.
            </p>
          </div>

          {user?.partnerStatus === 'pending' ? (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" /> Hồ sơ đang được xét duyệt
              </p>
              <p>Ban quản trị Hostay sẽ liên hệ xác minh thông tin cơ sở trong vòng 24 giờ làm việc.</p>
            </div>
          ) : (
            <form onSubmit={handlePartnerSubmit} className="space-y-4 pt-2">
              {partnerMessage && (
                <p className="text-xs font-bold text-teal-700 bg-teal-50 p-2.5 rounded-xl">{partnerMessage}</p>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên khách sạn / Homestay / Doanh nghiệp *</label>
                <input
                  type="text"
                  required
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  placeholder="VD: Khách Sạn Biển Xanh Đà Nẵng"
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số CCCD / Mã số thuế kinh doanh *</label>
                  <input
                    type="text"
                    required
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                    placeholder="0401xxxxxx"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại liên hệ *</label>
                  <input
                    type="tel"
                    required
                    value={partnerPhone}
                    onChange={(e) => setPartnerPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ cơ sở lưu trú tại Đà Nẵng *</label>
                <input
                  type="text"
                  required
                  value={bizAddress}
                  onChange={(e) => setBizAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, quận..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Gửi hồ sơ đối tác
              </button>
            </form>
          )}
        </div>
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          onSuccess={() => fetchBookings()}
        />
      )}

    </div>
  );
}
