const express = require('express');
const router = express.Router();
const {
  lookupBooking,
  confirmCheckIn,
  confirmCheckOut,
  markNoShow
} = require('../controllers/checkinController');
const { protect, authorize } = require('../middlewares/auth');

router.post('/lookup', protect, authorize('hotelier', 'admin'), lookupBooking);
router.post('/confirm-in', protect, authorize('hotelier', 'admin'), confirmCheckIn);
router.post('/confirm-out', protect, authorize('hotelier', 'admin'), confirmCheckOut);
router.post('/no-show', protect, authorize('hotelier', 'admin'), markNoShow);

module.exports = router;
