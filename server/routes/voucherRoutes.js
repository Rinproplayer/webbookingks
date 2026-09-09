const express = require('express');
const router = express.Router();
const {
  getActiveVouchers,
  validateVoucher,
  createVoucher,
  updateVoucher,
  toggleVoucher,
  deleteVoucher,
  bulkDeleteVouchers
} = require('../controllers/voucherController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', getActiveVouchers);
router.post('/validate', validateVoucher);

// Admin only routes
router.post('/', protect, authorize('admin'), createVoucher);
router.post('/bulk-delete', protect, authorize('admin'), bulkDeleteVouchers);
router.put('/:id', protect, authorize('admin'), updateVoucher);
router.put('/:id/toggle', protect, authorize('admin'), toggleVoucher);
router.delete('/:id', protect, authorize('admin'), deleteVoucher);

module.exports = router;
