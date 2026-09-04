const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Review = require('../models/Review');

// @desc Get all hotels with multi-criteria search & filtering
// @route GET /api/hotels
const getHotels = async (req, res, next) => {
  try {
    const {
      search,
      district,
      type,
      starRating,
      minPrice,
      maxPrice,
      amenities,
      sort,
      featured
    } = req.query;

    let query = { isDeleted: false, status: 'active' };

    if (district && district !== 'all') query.district = district;
    if (type && type !== 'all') query.type = type;
    if (starRating) query.starRating = { $gte: Number(starRating) };
    if (featured === 'true') query.isFeatured = true;

    if (amenities) {
      const list = amenities.split(',');
      query.amenities = { $all: list };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort option
    let sortOption = { isFeatured: -1, createdAt: -1 };
    if (sort === 'price_asc') sortOption = { minPrice: 1 };
    if (sort === 'price_desc') sortOption = { minPrice: -1 };
    if (sort === 'rating') sortOption = { 'rating.average': -1 };
    if (sort === 'stars') sortOption = { starRating: -1 };

    let hotels = await Hotel.find(query).sort(sortOption).populate('rooms');

    // Filter by minPrice / maxPrice if specified
    if (minPrice || maxPrice) {
      const min = Number(minPrice) || 0;
      const max = Number(maxPrice) || Infinity;
      hotels = hotels.filter(h => h.minPrice >= min && h.minPrice <= max);
    }

    res.json({
      success: true,
      count: hotels.length,
      hotels
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get hotel details with rooms and reviews
// @route GET /api/hotels/:id
const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('owner', 'name email phone avatar')
      .populate('rooms');

    if (!hotel || hotel.isDeleted) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khách sạn' });
    }

    const reviews = await Review.find({ hotel: hotel._id, isDeleted: false })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      hotel,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get hotels of current hotelier
// @route GET /api/hotels/owner/me
const getMyHotels = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? { isDeleted: false } : { owner: req.user.id, isDeleted: false };
    const hotels = await Hotel.find(query).populate('rooms').sort({ createdAt: -1 });
    res.json({ success: true, count: hotels.length, hotels });
  } catch (error) {
    next(error);
  }
};

// @desc Create hotel
// @route POST /api/hotels
const createHotel = async (req, res, next) => {
  try {
    const hotelData = {
      ...req.body,
      owner: req.user.id
    };

    const hotel = await Hotel.create(hotelData);
    res.status(201).json({ success: true, hotel });
  } catch (error) {
    next(error);
  }
};

// @desc Update hotel
// @route PUT /api/hotels/:id
const updateHotel = async (req, res, next) => {
  try {
    let hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Không tìm thấy khách sạn' });

    // Check ownership
    if (req.user.role !== 'admin' && hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền chỉnh sửa khách sạn này' });
    }

    hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, hotel });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle open/closed status
// @route PUT /api/hotels/:id/toggle-open
const toggleHotelOpen = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Không tìm thấy khách sạn' });

    if (req.user.role !== 'admin' && hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền sửa khách sạn này' });
    }

    hotel.isOpen = !hotel.isOpen;
    await hotel.save();

    res.json({ success: true, isOpen: hotel.isOpen, message: `Khách sạn đã ${hotel.isOpen ? 'mở cửa nhận khách' : 'tạm ngưng hoạt động'}` });
  } catch (error) {
    next(error);
  }
};

// @desc Delete hotel (soft delete)
// @route DELETE /api/hotels/:id
const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Không tìm thấy khách sạn' });

    if (req.user.role !== 'admin' && hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Không có quyền xóa' });
    }

    hotel.isDeleted = true;
    await hotel.save();

    res.json({ success: true, message: 'Đã xóa khách sạn thành công' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHotels,
  getHotelById,
  getMyHotels,
  createHotel,
  updateHotel,
  toggleHotelOpen,
  deleteHotel
};
