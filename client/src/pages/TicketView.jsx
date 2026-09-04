import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import BookingTicket from '../components/BookingTicket';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function TicketView() {
  const { idOrCode } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${idOrCode}`);
        if (res.data.success) {
          setBooking(res.data.booking);
        }
      } catch (err) {
        console.error('Error fetching ticket', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [idOrCode]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto my-24 p-8 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto" />
        <p className="text-xs text-slate-500">Đang tạo phiếu đặt phòng điện tử...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-3xl border text-center space-y-3">
        <h3 className="text-base font-bold text-slate-800">Không tìm thấy mã đặt chỗ này</h3>
        <Link to="/my-bookings" className="text-xs font-bold text-teal-600 block">
          Quay lại danh sách đơn
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="no-print">
        <Link to="/my-bookings" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700">
          <ArrowLeft className="w-4 h-4" /> Danh sách đơn đặt của tôi
        </Link>
      </div>

      <BookingTicket booking={booking} />
    </div>
  );
}
