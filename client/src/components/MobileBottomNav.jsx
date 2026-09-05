import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Building2, Ticket, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 transition-colors">
      <div className="flex items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            isActive('/')
              ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Trang chủ</span>
        </Link>

        <Link
          to="/destinations"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            isActive('/destinations')
              ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Khám phá</span>
        </Link>

        <Link
          to="/hotels"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            isActive('/hotels')
              ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Khách sạn</span>
        </Link>

        <Link
          to={user ? "/my-bookings" : "/login"}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all relative ${
            isActive('/my-bookings')
              ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Ticket className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Vé QR</span>
          {user && (
            <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white dark:ring-slate-900"></span>
          )}
        </Link>

        <Link
          to={user ? (user.role === 'admin' ? '/admin' : user.role === 'hotelier' ? '/hotelier' : '/profile') : '/login'}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            isActive('/profile') || isActive('/admin') || isActive('/hotelier')
              ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{user ? 'Tôi' : 'Tài khoản'}</span>
        </Link>
      </div>
    </nav>
  );
}
