const express = require('express');
const router = express.Router();
const {
  getBanners,
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  toggleBannerActive,
  deleteBanner
} = require('../controllers/bannerController');
const { protect, authorize } = require('../middlewares/auth');

// Public route to get active banners
router.get('/', getBanners);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllBannersAdmin);
router.post('/', protect, authorize('admin'), createBanner);
router.put('/:id', protect, authorize('admin'), updateBanner);
router.put('/:id/toggle', protect, authorize('admin'), toggleBannerActive);
router.delete('/:id', protect, authorize('admin'), deleteBanner);

module.exports = router;
