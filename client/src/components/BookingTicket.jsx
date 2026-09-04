import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatVND, formatDate, getStatusBadge } from '../utils/formatters';
import { Building2, Calendar, MapPin, Phone, User, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function BookingTicket({ booking }) {
  if (!booking) return null;

  const statusInfo = getStatusBadge(booking.status);

  // QR Code payload
  const qrPayload = JSON.stringify({
    code: booking.bookingCode,
    token: booking.qrCodeToken,
    guest: booking.guestInfo?.name,
    hotel: booking.hotel?.name,
    room: booking.room?.name,
    checkIn: booking.checkInDate,
    checkOut: booking.checkOutDate
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Action Bar */}
      <div className="no-print flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-500">Vé điện tử xác nhận đặt phòng</span>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          In vé / Lưu PDF
        </button>
      </div>

      {/* Ticket Container */}
      <div id="printable-ticket" className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">Hostay Đà Nẵng</h2>
                <p className="text-xs text-teal-100 font-medium">Phiếu Xác Nhận Đặt Phòng Trực Tuyến</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.class}`}>
                {statusInfo.label}
              </span>
              <p className="font-mono text-xs mt-1 text-teal-100 font-semibold">{booking.bookingCode}</p>
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-6">

          {/* QR Code and Hotel Highlight */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/70">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 shrink-0 text-center">
              <QRCodeSVG 
                value={qrPayload}
                size={140}
                level="H"
                includeMargin={false}
              />
              <p className="text-[10px] font-mono font-bold text-slate-500 mt-1.5 uppercase">MÃ CHECK-IN</p>
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded">
                {booking.hotel?.type?.toUpperCase() || 'KHÁCH SẠN'}
              </span>
              <h3 className="text-lg font-black text-slate-900 leading-snug">{booking.hotel?.name}</h3>
              <p className="text-xs text-slate-600 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                {booking.hotel?.address}, {booking.hotel?.district}, TP Đà Nẵng
              </p>
              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                Hotline cơ sở: <span className="font-semibold text-slate-800">{booking.hotel?.phone}</span>
              </p>
            </div>
          </div>

          {/* Stay Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400">Nhận phòng</p>
              <p className="text-xs font-bold text-slate-900 mt-1">{formatDate(booking.checkInDate)}</p>
              <p className="text-[10px] text-teal-600 font-semibold">{booking.hotel?.policies?.checkInTime || 'Từ 14:00'}</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400">Trả phòng</p>
              <p className="text-xs font-bold text-slate-900 mt-1">{formatDate(booking.checkOutDate)}</p>
              <p className="text-[10px] text-teal-600 font-semibold">{booking.hotel?.policies?.checkOutTime || 'Trước 12:00'}</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400">Thời gian lưu trú</p>
              <p className="text-xs font-bold text-slate-900 mt-1">{booking.nights} Đêm</p>
              <p className="text-[10px] text-slate-500">{booking.roomQuantity} Phòng</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400">Hạng phòng</p>
              <p className="text-xs font-bold text-slate-900 mt-1 truncate">{booking.room?.name}</p>
              <p className="text-[10px] text-slate-500">{booking.room?.bedType}</p>
            </div>
          </div>

          {/* Guest Info */}
          <div className="border-t border-b border-dashed border-slate-200 py-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Khách đại diện:</span>
              <span className="font-bold text-slate-900">{booking.guestInfo?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Số điện thoại:</span>
              <span className="font-semibold text-slate-800">{booking.guestInfo?.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email:</span>
              <span className="text-slate-800">{booking.guestInfo?.email}</span>
            </div>
            {booking.guestInfo?.specialRequests && (
              <div className="flex justify-between">
                <span className="text-slate-500">Ghi chú đặc biệt:</span>
                <span className="text-slate-700 italic">{booking.guestInfo?.specialRequests}</span>
              </div>
            )}
          </div>

          {/* Payment breakdown */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Giá phòng ({booking.nights} đêm × {booking.roomQuantity} phòng):</span>
              <span>{formatVND(booking.pricing?.originalTotal)}</span>
            </div>
            {booking.pricing?.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Khuyến mãi Voucher:</span>
                <span>-{formatVND(booking.pricing?.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
              <span>Tổng thanh toán:</span>
              <span className="text-lg text-teal-600">{formatVND(booking.pricing?.finalTotal)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-1">
              <span>Phương thức thanh toán:</span>
              <span className="font-bold uppercase text-slate-700">{booking.paymentMethod}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200/60 text-xs text-teal-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-teal-800">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              Hướng dẫn Check-in không chạm:
            </p>
            <p>1. Xuất trình mã QR trên phiếu này trực tiếp cho Lễ tân khi đến nhận phòng.</p>
            <p>2. Vui lòng mang theo CCCD/Hộ chiếu để lễ tân đối chiếu thông tin lưu trú theo quy định.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
