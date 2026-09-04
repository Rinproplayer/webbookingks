const express = require('express');
const router = express.Router();
const {
  getHotels,
  getHotelById,
  getMyHotels,
  createHotel,
  updateHotel,
  toggleHotelOpen,
  deleteHotel
} = require('../controllers/hotelController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', getHotels);
router.get('/owner/me', protect, authorize('hotelier', 'admin'), getMyHotels);
router.get('/:id', getHotelById);

router.post('/', protect, authorize('hotelier', 'admin'), createHotel);
router.put('/:id', protect, authorize('hotelier', 'admin'), updateHotel);
router.put('/:id/toggle-open', protect, authorize('hotelier', 'admin'), toggleHotelOpen);
router.delete('/:id', protect, authorize('hotelier', 'admin'), deleteHotel);

module.exports = router;
