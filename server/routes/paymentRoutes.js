const express = require('express');
const router = express.Router();
const {
  createVNPayUrl,
  processVNPayReturn,
  createMoMoUrl,
  processMoMoReturn,
  mockCheckout,
  getPaymentLogs
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/auth');

router.post('/create-vnpay-url', protect, createVNPayUrl);
router.post('/vnpay-return', processVNPayReturn);

router.post('/create-momo-url', protect, createMoMoUrl);
router.post('/momo-return', processMoMoReturn);

router.post('/mock-checkout', protect, mockCheckout);
router.get('/logs', protect, authorize('admin', 'hotelier'), getPaymentLogs);

module.exports = router;
