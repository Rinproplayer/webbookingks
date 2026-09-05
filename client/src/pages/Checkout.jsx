import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  MapPin, 
  Users, 
  Tag, 
  ShieldCheck, 
  CreditCard, 
  ArrowLeft, 
  Check, 
  QrCode, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatVND, formatDate } from '../utils/formatters';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const bookingState = location.state;

  if (!bookingState || !bookingState.hotel || !bookingState.room) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Không tìm thấy thông tin đặt phòng</h2>
        <p className="text-xs text-slate-500">Vui lòng quay lại trang khách sạn để chọn hạng phòng.</p>
        <Link to="/hotels" className="inline-block px-5 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl">
          Tìm khách sạn Đà Nẵng
        </Link>
      </div>
    );
  }

  const { hotel, room, checkInDate, checkOutDate, nights, roomQuantity } = bookingState;

  // Form states
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');

  // Voucher states
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('mock'); // 'vnpay' | 'momo' | 'mock'
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const originalTotal = room.pricePerNight * nights * roomQuantity;
  const discountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const finalTotal = Math.max(0, originalTotal - discountAmount);

  // Apply voucher
  const handleApplyVoucher = async (e) => {
    e.preventDefault();
    setVoucherError('');
    if (!voucherCode.trim()) return;

    setVoucherLoading(true);
    try {
      const res = await api.post('/vouchers/validate', {
        code: voucherCode.trim(),
        amount: originalTotal
      });
      if (res.data.success) {
        setAppliedVoucher(res.data.voucher);
      }
    } catch (err) {
      setVoucherError(err.response?.data?.message || 'Mã giảm giá không hợp lệ hoặc đã hết hạn');
      setAppliedVoucher(null);
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
  };

  // Submit Booking
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Vui lòng đăng nhập trước khi tạo đơn đặt phòng');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const bookingData = {
        roomId: room._id,
        checkInDate,
        checkOutDate,
        roomQuantity,
        guestInfo: {
          name: guestName,
          email: guestEmail,
          phone: guestPhone,
          specialRequests
        },
        voucherCode: appliedVoucher ? appliedVoucher.code : undefined,
        paymentMethod
      };

      const res = await api.post('/bookings', bookingData);

      if (res.data.success) {
        const createdBooking = res.data.booking;

        // Routing according to payment gateway
        if (paymentMethod === 'vnpay') {
          // Request VNPay URL
          const vnpRes = await api.post('/payments/create-vnpay-url', {
            bookingId: createdBooking._id
          });
          if (vnpRes.data.success && vnpRes.data.paymentUrl) {
            window.location.href = vnpRes.data.paymentUrl;
            return;
          }
        } else if (paymentMethod === 'momo') {
          // Request MoMo URL
          const momoRes = await api.post('/payments/create-momo-url', {
            bookingId: createdBooking._id
          });
          if (momoRes.data.success && momoRes.data.paymentUrl) {
            window.location.href = momoRes.data.paymentUrl;
            return;
          }
        } else {
          // Mock sandbox instant confirmation
          navigate(`/ticket/${createdBooking.bookingCode}`);
        }
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn đặt phòng');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2">
        <Link to={`/hotels/${hotel._id}`} className="text-xs font-bold text-teal-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Quay lại thông tin phòng
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            
            {/* Step 1: Guest Info */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="text-base font-black text-slate-900">Thông Tin Khách Đại Diện</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên người nhận phòng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số điện thoại liên hệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email nhận vé điện tử & Mã QR <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Yêu cầu đặc biệt (Không bắt buộc)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="VD: Nhận phòng sớm, phòng tầng cao, giường đôi..."
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Voucher Code */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="text-base font-black text-slate-900">Mã Khuyến Mãi (Voucher)</h3>
              </div>

              {appliedVoucher ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-emerald-900">
                        Đã áp dụng mã: <span className="font-mono uppercase font-black">{appliedVoucher.code}</span>
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Giảm: {formatVND(appliedVoucher.discountAmount)} cho đơn hàng
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Bỏ mã
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      placeholder="Nhập mã CHAODANANG2026, DIFF50K..."
                      className="flex-1 text-xs uppercase font-mono p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      disabled={voucherLoading}
                      onClick={handleApplyVoucher}
                      className="px-5 py-3 bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                      {voucherLoading ? 'Kiểm tra...' : 'Áp dụng'}
                    </button>
                  </div>
                  {voucherError && (
                    <p className="text-xs text-red-600 font-medium">{voucherError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Step 3: Payment Gateway Selection */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="text-base font-black text-slate-900">Chọn Phương Thức Thanh Toán</h3>
              </div>

              <div className="space-y-3">
                {/* Mock Sandbox Option */}
                <label className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'mock' ? 'border-teal-600 bg-teal-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mock"
                      checked={paymentMethod === 'mock'}
                      onChange={() => setPaymentMethod('mock')}
                      className="text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Mô phỏng Thanh toán Trực tuyến (Test Sandbox)</p>
                      <p className="text-[11px] text-slate-500">Tự động duyệt vé điện tử QR tức thì để kiểm thử luồng Check-in.</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    Khuyên dùng thử
                  </span>
                </label>

                {/* VNPay Sandbox */}
                <label className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'vnpay' ? 'border-teal-600 bg-teal-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vnpay"
                      checked={paymentMethod === 'vnpay'}
                      onChange={() => setPaymentMethod('vnpay')}
                      className="text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Cổng Thanh toán VNPay (VNPay-QR, Thẻ ATM)</p>
                      <p className="text-[11px] text-slate-500">Chuyển sang trang thanh toán bảo mật của VNPay Sandbox.</p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-blue-700">VNPay</span>
                </label>

                {/* MoMo Sandbox */}
                <label className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'momo' ? 'border-teal-600 bg-teal-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="momo"
                      checked={paymentMethod === 'momo'}
                      onChange={() => setPaymentMethod('momo')}
                      className="text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Ví điện tử MoMo</p>
                      <p className="text-[11px] text-slate-500">Quét mã QR MoMo thanh toán trên app di động.</p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-pink-600">MoMo</span>
                </label>
              </div>
            </div>

            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-medium">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-teal-600/30 transition-all disabled:opacity-50"
            >
              {submitting ? 'Đang khởi tạo đơn...' : `Thanh toán ${formatVND(finalTotal)} & Nhận Vé QR`}
            </button>

            <div className="flex items-center justify-center gap-2 text-slate-500 text-[11px]">
              <span>📧 Tự động gửi Vé điện tử PDF & Mã QR đến hòm thư <b>{guestEmail || 'của bạn'}</b></span>
            </div>

          </form>
        </div>

        {/* Right Col: Booking Summary Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 sticky top-24">
            <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
              Chi Tiết Đơn Đặt Phòng
            </h3>

            {/* Hotel & Room snippet */}
            <div className="flex gap-3 items-center">
              <img src={hotel.coverImage} alt={hotel.name} className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase bg-teal-50 px-1.5 py-0.5 rounded">
                  {hotel.district}
                </span>
                <h4 className="text-xs font-black text-slate-900 line-clamp-1">{hotel.name}</h4>
                <p className="text-[11px] text-slate-500">{room.name}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Nhận phòng:</span>
                <span className="font-bold text-slate-900">{formatDate(checkInDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trả phòng:</span>
                <span className="font-bold text-slate-900">{formatDate(checkOutDate)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">Lưu trú:</span>
                <span className="font-bold text-teal-700">{nights} đêm • {roomQuantity} phòng</span>
              </div>
            </div>

            {/* Cost breakdown */}
            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-slate-600">
                <span>Tiền phòng:</span>
                <span>{formatVND(originalTotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Mã giảm giá ({appliedVoucher?.code}):</span>
                  <span>-{formatVND(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Tổng cộng:</span>
                <span className="text-xl text-teal-600">{formatVND(finalTotal)}</span>
              </div>
            </div>

            <div className="p-3.5 bg-teal-50/70 dark:bg-teal-950/40 rounded-2xl border border-teal-100 dark:border-teal-900/60 text-[11px] text-teal-900 dark:text-teal-200 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" /> Vé Điện Tử & Email Xác Nhận Tự Động
              </p>
              <p className="text-teal-700 dark:text-teal-400">
                Phiếu xác nhận, hóa đơn và file PDF vé điện tử (kèm mã QR Check-in) sẽ được tự động gửi đến Gmail của bạn ngay khi hoàn tất.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
