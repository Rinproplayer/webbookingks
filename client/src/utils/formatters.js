// Format VND currency
export const formatVND = (amount) => {
  if (amount === undefined || amount === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Format Date
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Da Nang Districts list
export const DANANG_DISTRICTS = [
  'Hải Châu',
  'Sơn Trà',
  'Ngũ Hành Sơn',
  'Thanh Khê',
  'Liên Chiểu',
  'Cẩm Lệ',
  'Hòa Vang'
];

// Destination Categories
export const DESTINATION_CATEGORIES = [
  { id: 'all', label: 'Tất cả điểm đến', icon: 'Compass' },
  { id: 'beach', label: 'Bãi biển Mỹ Khê & Non Nước', icon: 'Waves' },
  { id: 'nature', label: 'Thiên nhiên Bà Nà & Sơn Trà', icon: 'Trees' },
  { id: 'heritage', label: 'Di tích & Cầu Rồng', icon: 'Landmark' },
  { id: 'spiritual', label: 'Văn hóa tâm linh & Ngũ Hành Sơn', icon: 'Sun' },
  { id: 'cuisine', label: 'Ẩm thực & Chợ đêm', icon: 'Utensils' }
];

// Booking Status Helpers
export const getStatusBadge = (status) => {
  switch (status) {
    case 'confirmed':
      return { label: 'Đã xác nhận', class: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    case 'checked_in':
      return { label: 'Đang lưu trú', class: 'bg-blue-100 text-blue-800 border-blue-300' };
    case 'completed':
      return { label: 'Đã hoàn thành', class: 'bg-slate-100 text-slate-800 border-slate-300' };
    case 'cancelled':
      return { label: 'Đã hủy', class: 'bg-red-100 text-red-800 border-red-300' };
    case 'no_show':
      return { label: 'Vắng mặt (No-show)', class: 'bg-amber-100 text-amber-800 border-amber-300' };
    default:
      return { label: 'Chờ thanh toán', class: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
  }
};
