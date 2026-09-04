const Banner = require('../models/Banner');

const defaultHeroBanner = {
  title: 'Khám phá Đà Nẵng & Đặt phòng',
  highlightText: 'Tiết Kiệm Với Check-in QR',
  subtitle: 'Kết nối trực tiếp hàng trăm khách sạn, resort ven biển Mỹ Khê và homestay sông Hàn. Không phí trung gian, nhận phòng không chạm nhanh chóng.',
  badge: 'NỀN TẢNG ĐẶT PHÒNG CHUYÊN BIỆT ĐÀ NẴNG 2026',
  imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1920&q=80',
  linkUrl: '/hotels',
  ctaText: 'Đặt phòng ngay',
  position: 'hero',
  isActive: true,
  order: 0
};

// @desc Get active banners for client
// @route GET /api/banners
const getBanners = async (req, res, next) => {
  try {
    const { position } = req.query;
    const filter = { isActive: true };
    if (position) filter.position = position;

    let banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });

    // Auto-create default banner if database has none
    if (banners.length === 0 && (!position || position === 'hero')) {
      const created = await Banner.create(defaultHeroBanner);
      banners = [created];
    }

    res.json({ success: true, count: banners.length, banners });
  } catch (error) {
    next(error);
  }
};

// @desc Get all banners for Admin (including inactive)
// @route GET /api/banners/admin/all
const getAllBannersAdmin = async (req, res, next) => {
  try {
    let banners = await Banner.find().sort({ position: 1, order: 1, createdAt: -1 });

    if (banners.length === 0) {
      const created = await Banner.create(defaultHeroBanner);
      banners = [created];
    }

    res.json({ success: true, count: banners.length, banners });
  } catch (error) {
    next(error);
  }
};

// @desc Create new banner (Admin)
// @route POST /api/banners
const createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, banner });
  } catch (error) {
    next(error);
  }
};

// @desc Update banner (Admin)
// @route PUT /api/banners/:id
const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy banner' });
    }
    res.json({ success: true, banner });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle active status
// @route PUT /api/banners/:id/toggle
const toggleBannerActive = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy banner' });
    }
    banner.isActive = !banner.isActive;
    await banner.save();
    res.json({
      success: true,
      isActive: banner.isActive,
      message: `Banner đã được ${banner.isActive ? 'kích hoạt hiển thị' : 'ẩn khỏi trang chủ'}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete banner (Admin)
// @route DELETE /api/banners/:id
const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy banner' });
    }
    res.json({ success: true, message: 'Đã xóa banner thành công' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBanners,
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  toggleBannerActive,
  deleteBanner
};
