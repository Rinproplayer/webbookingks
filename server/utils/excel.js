const XLSX = require('xlsx');

const generateBookingsExcel = (bookings) => {
  const data = bookings.map((b, idx) => ({
    'STT': idx + 1,
    'Mã Đặt Chỗ': b.bookingCode,
    'Khách Sạn': b.hotel?.name || 'N/A',
    'Hạng Phòng': b.room?.name || 'N/A',
    'Khách Hàng': b.guestInfo?.name || b.customer?.name || 'N/A',
    'Số Điện Thoại': b.guestInfo?.phone || b.customer?.phone || 'N/A',
    'Email': b.guestInfo?.email || b.customer?.email || 'N/A',
    'Ngày Check-in': b.checkInDate ? new Date(b.checkInDate).toLocaleDateString('vi-VN') : '',
    'Ngày Check-out': b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString('vi-VN') : '',
    'Số Đêm': b.nights,
    'Số Lượng Phòng': b.roomQuantity,
    'Tổng Tiền Gốc (VNĐ)': b.pricing?.originalTotal || 0,
    'Giảm Giá (VNĐ)': b.pricing?.discountAmount || 0,
    'Thực Thu (VNĐ)': b.pricing?.finalTotal || 0,
    'Hình Thức TT': (b.paymentMethod || '').toUpperCase(),
    'Trạng Thái TT': b.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán',
    'Trạng Thái Đơn': translateStatus(b.status),
    'Ngày Tạo Đơn': b.createdAt ? new Date(b.createdAt).toLocaleString('vi-VN') : ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo Cáo Đặt Phòng');

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
};

const translateStatus = (status) => {
  const map = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    checked_in: 'Đang lưu trú',
    completed: 'Đã hoàn thành',
    cancelled: 'Đã hủy',
    no_show: 'Vắng mặt'
  };
  return map[status] || status;
};

module.exports = { generateBookingsExcel };
