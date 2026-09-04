import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, ShieldCheck, CreditCard, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">Hos<span className="text-teal-400">tay</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nền tảng đặt phòng trực tuyến và quản trị khách sạn & homestay chuyên biệt cho thành phố Đà Nẵng. Kết nối du khách trực tiếp với cơ sở lưu trú bản địa.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Thanh toán bảo mật & Check-in QR không chạm</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Khám phá Đà Nẵng</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/destinations?category=beach" className="hover:text-teal-400 transition-colors">Bãi biển Mỹ Khê & Non Nước</Link></li>
              <li><Link to="/destinations?category=nature" className="hover:text-teal-400 transition-colors">Sun World Bà Nà Hills & Cầu Vàng</Link></li>
              <li><Link to="/destinations?category=spiritual" className="hover:text-teal-400 transition-colors">Chùa Linh Ứng Bán đảo Sơn Trà</Link></li>
              <li><Link to="/destinations?category=heritage" className="hover:text-teal-400 transition-colors">Cầu Rồng & Sông Hàn về đêm</Link></li>
              <li><Link to="/destinations?category=cuisine" className="hover:text-teal-400 transition-colors">Chợ đêm Sơn Trà & Ẩm thực miền Trung</Link></li>
            </ul>
          </div>

          {/* Col 3: For Partners */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Dành cho Đối tác & Chủ nhà</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/register" className="hover:text-teal-400 transition-colors">Đăng ký bán phòng trên Hostay</Link></li>
              <li><Link to="/hotelier" className="hover:text-teal-400 transition-colors">Phần mềm quản trị khách sạn (PMS)</Link></li>
              <li><Link to="/hotelier" className="hover:text-teal-400 transition-colors">Giải pháp Check-in QR Code Lễ tân</Link></li>
              <li><span className="text-slate-500">Miễn phí 0% hoa hồng cho cơ sở mới</span></li>
            </ul>
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-400">Cổng thanh toán hỗ trợ:</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-1 bg-slate-800 text-white text-xs font-bold rounded border border-slate-700">VNPay-QR</span>
                <span className="px-2.5 py-1 bg-pink-950/80 text-pink-300 text-xs font-bold rounded border border-pink-800">Ví MoMo</span>
                <span className="px-2.5 py-1 bg-slate-800 text-teal-300 text-xs font-bold rounded border border-slate-700">Thẻ ATM / QR</span>
              </div>
            </div>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Liên hệ Hỗ trợ Đà Nẵng</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>01 Lê Duẩn, Quận Hải Châu, TP Đà Nẵng</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                <span className="font-bold text-white">1900 6868 (Hotline 24/7)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-teal-400 shrink-0" />
                <span>hotro@hostay.vn</span>
              </div>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs">
              <span className="text-teal-400 font-bold">Mùa Lễ Hội DIFF 2026:</span> Đặt phòng sớm bên sông Hàn để ngắm trọn pháo hoa quốc tế.
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Hostay Da Nang. Bản quyền thuộc về Dự án Phát triển Hệ thống Đặt phòng Hostay.</p>
          <p>Thiết kế theo chuẩn kiến trúc QTDAPM & Scope Specification.</p>
        </div>
      </div>
    </footer>
  );
}
