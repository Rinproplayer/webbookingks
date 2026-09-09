const express = require('express');
const router = express.Router();
const {
  getDestinations,
  getDestinationDetail,
  toggleWishlist,
  createDestination,
  updateDestination,
  deleteDestination,
  bulkDeleteDestinations
} = require('../controllers/destinationController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', getDestinations);
router.get('/:idOrSlug', getDestinationDetail);
router.post('/:id/wishlist', protect, toggleWishlist);

// Admin routes
router.post('/', protect, authorize('admin'), createDestination);
router.post('/bulk-delete', protect, authorize('admin'), bulkDeleteDestinations);
router.put('/:id', protect, authorize('admin'), updateDestination);
router.delete('/:id', protect, authorize('admin'), deleteDestination);

module.exports = router;
