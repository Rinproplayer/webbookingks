const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getHotelierBookings,
  getBookingDetail,
  cancelBooking,
  resendConfirmationEmail,
  testCheckInReminder,
  triggerAllReminders
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middlewares/auth');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/hotelier', protect, authorize('hotelier', 'admin'), getHotelierBookings);
router.post('/trigger-reminders', protect, authorize('hotelier', 'admin'), triggerAllReminders);
router.post('/:idOrCode/resend-email', protect, resendConfirmationEmail);
router.post('/:idOrCode/test-reminder', protect, testCheckInReminder);
router.get('/:idOrCode', protect, getBookingDetail);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
