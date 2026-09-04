const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  exportBookingsExcel
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/dashboard', protect, authorize('hotelier', 'admin'), getDashboardStats);
router.get('/export-excel', protect, authorize('hotelier', 'admin'), exportBookingsExcel);

module.exports = router;
