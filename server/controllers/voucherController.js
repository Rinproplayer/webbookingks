const Voucher = require('../models/Voucher');

// @desc Get public active vouchers
// @route GET /api/vouchers
const getActiveVouchers = async (req, res, next) => {
  try {
    const vouchers = await Voucher.find({
      isActive: true,
      endDate: { $gte: new Date() }
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: vouchers.length, vouchers });
  } catch (error) {
    next(error);
  }
};

// @desc Validate voucher for order amount
// @route POST /api/vouchers/validate
const validateVoucher = async (req, res, next) => {
  try {
    const { code, amount } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Vui lòng nhập mã voucher' });

    const voucher = await Voucher.findOne({
      code: code.toUpperCase(),
      isActive: true,
      endDate: { $gte: new Date() }
    });

    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Mã voucher không tồn tại hoặc đã hết hạn' });
    }

    if (voucher.usedCount >= voucher.totalUsageLimit) {
      return res.status(400).json({ success: false, message: 'Mã voucher đã hết lượt sử dụng' });
    }

    if (amount < voucher.minSpend) {
      return res.status(400).json({
        success: false,
        message: `Đơn hàng tối thiểu để áp dụng mã là ${voucher.minSpend.toLocaleString('vi-VN')} VNĐ`
      });
    }

    let discount = 0;
    if (voucher.discountType === 'percent') {
      discount = (amount * voucher.discountValue) / 100;
      if (voucher.maxDiscount > 0 && discount > voucher.maxDiscount) {
        discount = voucher.maxDiscount;
      }
    } else {
      discount = voucher.discountValue;
    }

    if (discount > amount) discount = amount;

    res.json({
      success: true,
      valid: true,
      voucher: {
        code: voucher.code,
        title: voucher.title,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        discountAmount: Math.round(discount),
        finalAmount: Math.max(0, Math.round(amount - discount))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Admin create voucher
// @route POST /api/vouchers
const createVoucher = async (req, res, next) => {
  try {
    const voucher = await Voucher.create(req.body);
    res.status(201).json({ success: true, voucher });
  } catch (error) {
    next(error);
  }
};

// @desc Admin update voucher
// @route PUT /api/vouchers/:id
const updateVoucher = async (req, res, next) => {
  try {
    const voucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!voucher) return res.status(404).json({ success: false, message: 'Không tìm thấy voucher' });
    res.json({ success: true, voucher });
  } catch (error) {
    next(error);
  }
};

// @desc Admin toggle voucher status
// @route PUT /api/vouchers/:id/toggle
const toggleVoucher = async (req, res, next) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) return res.status(404).json({ success: false, message: 'Không tìm thấy voucher' });
    voucher.isActive = !voucher.isActive;
    await voucher.save();
    res.json({ success: true, isActive: voucher.isActive, message: `Voucher đã ${voucher.isActive ? 'kích hoạt' : 'tạm dừng'}` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActiveVouchers,
  validateVoucher,
  createVoucher,
  updateVoucher,
  toggleVoucher
};
