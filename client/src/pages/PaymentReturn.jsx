import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Ticket, Building2 } from 'lucide-react';
import api from '../services/api';

export default function PaymentReturn({ gateway }) { // gateway: 'vnpay' | 'momo'
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [bookingCode, setBookingCode] = useState('');

  useEffect(() => {
    const processPayment = async () => {
      try {
        const queryObj = Object.fromEntries([...searchParams]);
        
        let res;
        if (gateway === 'vnpay') {
          res = await api.post('/payments/vnpay-return', queryObj);
        } else {
          res = await api.post('/payments/momo-return', queryObj);
        }

        if (res.data.success) {
          setSuccess(true);
          setMessage(res.data.message || 'Thanh toán thành công!');
          setBookingCode(res.data.bookingCode);
        }
      } catch (err) {
        setSuccess(false);
        setMessage(err.response?.data?.message || 'Giao dịch thanh toán không thành công hoặc bị hủy');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams, gateway]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-3xl border shadow-xl text-center space-y-4">
        <div className="animate-spin w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full mx-auto"></div>
        <h3 className="text-base font-bold text-slate-800">Đang đối soát giao dịch thanh toán...</h3>
        <p className="text-xs text-slate-500">Vui lòng không tắt hoặc tải lại trình duyệt.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200/80 shadow-2xl text-center space-y-6">
      {success ? (
        <>
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Thanh Toán Hoàn Tất!</h2>
            <p className="text-xs text-slate-500">{message}</p>
            {bookingCode && (
              <p className="text-xs font-mono font-bold text-teal-700 mt-2 bg-teal-50 py-1.5 px-3 rounded-xl inline-block">
                MÃ ĐẶT CHỖ: {bookingCode}
              </p>
            )}
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to={`/ticket/${bookingCode}`}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" /> Xem Phiếu Vé Điện Tử & Mã QR
            </Link>
            <Link
              to="/my-bookings"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Về danh sách đơn đặt của tôi
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-md">
            <XCircle className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Thanh Toán Chưa Thành Công</h2>
            <p className="text-xs text-red-600 font-medium">{message}</p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/hotels"
              className="w-full py-3 bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              Quay lại danh sách khách sạn
            </Link>
            <Link
              to="/my-bookings"
              className="w-full py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Xem đơn đặt phòng chờ thanh toán
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
