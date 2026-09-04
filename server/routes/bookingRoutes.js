const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getHotelierBookings,
  getBookingDetail,
  cancelBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middlewares/auth');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/hotelier', protect, authorize('hotelier', 'admin'), getHotelierBookings);
router.get('/:idOrCode', protect, getBookingDetail);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
