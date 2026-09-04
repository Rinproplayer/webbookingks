const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const User = require('../models/User');
const { generateBookingsExcel } = require('../utils/excel');

// @desc Get analytics dashboard data (Admin / Hotelier)
// @route GET /api/analytics/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const isHotelier = req.user.role === 'hotelier';
    let hotelFilter = {};

    if (isHotelier) {
      const myHotels = await Hotel.find({ owner: req.user.id, isDeleted: false });
      const myHotelIds = myHotels.map(h => h._id);
      hotelFilter.hotel = { $in: myHotelIds };
    }

    // 1. Total counts
    const totalBookings = await Booking.countDocuments(hotelFilter);
    const paidBookings = await Booking.find({ ...hotelFilter, paymentStatus: 'paid' });
    const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.pricing?.finalTotal || 0), 0);

    const activeHotelsCount = isHotelier 
      ? await Hotel.countDocuments({ owner: req.user.id, isDeleted: false })
      : await Hotel.countDocuments({ isDeleted: false });

    const totalUsersCount = isHotelier ? 0 : await User.countDocuments();

    // 2. Status Breakdown
    const statusCounts = await Booking.aggregate([
      { $match: hotelFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statusMap = {
      pending: 0,
      confirmed: 0,
      checked_in: 0,
      completed: 0,
      cancelled: 0,
      no_show: 0
    };
    statusCounts.forEach(item => {
      if (statusMap[item._id] !== undefined) {
        statusMap[item._id] = item.count;
      }
    });

    // 3. 12-Month Revenue Chart
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = Array(12).fill(0);
    const monthlyBookings = Array(12).fill(0);

    paidBookings.forEach(b => {
      const bDate = new Date(b.createdAt);
      if (bDate.getFullYear() === currentYear) {
        const month = bDate.getMonth(); // 0 to 11
        monthlyRevenue[month] += b.pricing?.finalTotal || 0;
        monthlyBookings[month] += 1;
      }
    });

    // 4. Occupancy Rate estimation
    // Rooms total vs currently checked_in or confirmed rooms
    const rooms = await Room.find(isHotelier ? { hotel: hotelFilter.hotel } : { isDeleted: false });
    const totalRoomCapacity = rooms.reduce((sum, r) => sum + r.totalRooms, 0) || 1;
    const availableRoomCount = rooms.reduce((sum, r) => sum + r.availableRooms, 0);
    const occupiedRooms = Math.max(0, totalRoomCapacity - availableRoomCount);
    const occupancyRate = Math.min(100, Math.round((occupiedRooms / totalRoomCapacity) * 100));

    // 5. Recent Bookings
    const recentBookings = await Booking.find(hotelFilter)
      .populate('hotel', 'name district')
      .populate('room', 'name type')
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalBookings,
        activeHotelsCount,
        totalUsersCount,
        occupancyRate,
        statusMap,
        monthlyRevenue,
        monthlyBookings,
        recentBookings
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Export Bookings Report to Excel (.xlsx)
// @route GET /api/analytics/export-excel
const exportBookingsExcel = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === 'hotelier') {
      const myHotels = await Hotel.find({ owner: req.user.id, isDeleted: false });
      const ids = myHotels.map(h => h._id);
      filter.hotel = { $in: ids };
    }

    const bookings = await Booking.find(filter)
      .populate('hotel', 'name district')
      .populate('room', 'name type')
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    const buffer = generateBookingsExcel(bookings);

    const filename = `Hostay_Bao_Cao_Dat_Phong_${Date.now()}.xlsx`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  exportBookingsExcel
};
