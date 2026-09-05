import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Building2, 
  Compass, 
  Ticket, 
  User, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  ShieldAlert, 
  QrCode, 
  Heart,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Hos<span className="text-teal-600 dark:text-teal-400">tay</span></span>
              <span className="bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">ĐÀ NẴNG</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Đặt phòng & Du lịch Đà Nẵng</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 font-medium text-sm">
          <Link 
            to="/" 
            className={`px-3.5 py-2 rounded-lg transition-colors ${isActive('/') ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            Trang chủ
          </Link>
          <Link 
            to="/destinations" 
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${isActive('/destinations') ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Khám phá Đà Nẵng
          </Link>
          <Link 
            to="/hotels" 
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${isActive('/hotels') ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Khách sạn & Homestay
          </Link>
        </nav>

        {/* Right Section / User actions & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105"
            aria-label="Đổi giao diện Sáng / Tối"
            title={isDark ? "Chuyển sang chế độ Sáng" : "Chuyển sang chế độ Tối"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-slate-200 hover:border-teal-300 hover:shadow-sm transition-all"
              >
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${
                    user.role === 'admin' ? 'text-purple-600' :
                    user.role === 'hotelier' ? 'text-blue-600' : 'text-teal-600'
                  }`}>
                    {user.role === 'admin' ? 'Quản trị viên' : user.role === 'hotelier' ? 'Chủ khách sạn' : 'Thành viên'}
                  </span>
                </div>
                <img 
                  src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                  alt={user.name} 
                  className="w-9 h-9 rounded-full object-cover border border-teal-500/30"
                />
                <ChevronDown className="w-4 h-4 text-slate-400 mr-1" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-xs font-semibold text-slate-500">Đăng nhập với email</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                  </div>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50 font-medium transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4 text-purple-600" />
                      Trang Quản Trị Hệ Thống
                    </Link>
                  )}

                  {(user.role === 'hotelier' || user.role === 'admin') && (
                    <Link
                      to="/hotelier"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-blue-700 hover:bg-blue-50 font-medium transition-colors"
                    >
                      <QrCode className="w-4 h-4 text-blue-600" />
                      Quầy Lễ Tân & Quản Lý Phòng
                    </Link>
                  )}

                  <Link
                    to="/my-bookings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Ticket className="w-4 h-4 text-teal-600" />
                    Đơn đặt phòng của tôi
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    Hồ sơ & Tài khoản
                  </Link>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-100 rounded-xl transition-all"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm shadow-teal-600/20 transition-all"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button & Theme toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Đổi giao diện"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-teal-50"
          >
            Trang chủ
          </Link>
          <Link
            to="/destinations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-teal-50"
          >
            Khám phá Đà Nẵng
          </Link>
          <Link
            to="/hotels"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-teal-50"
          >
            Khách sạn & Homestay
          </Link>

          <div className="border-t border-slate-100 pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-50 rounded-lg">
                  <p className="text-sm font-bold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-bold text-purple-700 bg-purple-50 rounded-lg"
                  >
                    Quản trị hệ thống (Admin)
                  </Link>
                )}
                {(user.role === 'hotelier' || user.role === 'admin') && (
                  <Link
                    to="/hotelier"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-bold text-blue-700 bg-blue-50 rounded-lg"
                  >
                    Quầy Lễ Tân & Phòng (Hotelier)
                  </Link>
                )}
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  Đơn đặt phòng của tôi
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  Hồ sơ cá nhân
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-xl"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
