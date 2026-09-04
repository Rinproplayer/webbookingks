const express = require('express');
const router = express.Router();
const {
  getRoomsByHotel,
  getRoomById,
  createRoom,
  updateRoom,
  toggleLockRoom,
  deleteRoom
} = require('../controllers/roomController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/hotel/:hotelId', getRoomsByHotel);
router.get('/:id', getRoomById);

router.post('/', protect, authorize('hotelier', 'admin'), createRoom);
router.put('/:id', protect, authorize('hotelier', 'admin'), updateRoom);
router.put('/:id/toggle-lock', protect, authorize('hotelier', 'admin'), toggleLockRoom);
router.delete('/:id', protect, authorize('hotelier', 'admin'), deleteRoom);

module.exports = router;
