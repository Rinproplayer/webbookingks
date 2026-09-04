const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  registerPartner,
  getAllUsers,
  toggleUserBlock,
  reviewPartner
} = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/partner-register', protect, registerPartner);

// Admin only routes
router.get('/admin/users', protect, authorize('admin'), getAllUsers);
router.put('/admin/users/:id/toggle-block', protect, authorize('admin'), toggleUserBlock);
router.put('/admin/partners/:id/review', protect, authorize('admin'), reviewPartner);

module.exports = router;
