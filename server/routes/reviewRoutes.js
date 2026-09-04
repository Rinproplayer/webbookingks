const express = require('express');
const router = express.Router();
const {
  createReview,
  getHotelReviews,
  replyToReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/hotel/:hotelId', getHotelReviews);
router.post('/', protect, createReview);
router.put('/:id/reply', protect, authorize('hotelier', 'admin'), replyToReview);
router.delete('/:id', protect, authorize('admin'), deleteReview);

module.exports = router;
