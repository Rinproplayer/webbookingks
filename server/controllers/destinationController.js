const Destination = require('../models/Destination');
const Hotel = require('../models/Hotel');
const User = require('../models/User');

// @desc Get all destinations with filtering
// @route GET /api/destinations
const getDestinations = async (req, res, next) => {
  try {
    const { category, district, search, featured } = req.query;
    let query = { isDeleted: false, status: 'published' };

    if (category && category !== 'all') query.category = category;
    if (district && district !== 'all') query.district = district;
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const destinations = await Destination.find(query).sort({ isFeatured: -1, createdAt: -1 });
    res.json({ success: true, count: destinations.length, destinations });
  } catch (error) {
    next(error);
  }
};

// @desc Get single destination by id or slug + get nearby hotels
// @route GET /api/destinations/:idOrSlug
const getDestinationDetail = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let destination;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      destination = await Destination.findById(idOrSlug);
    } else {
      destination = await Destination.findOne({ slug: idOrSlug });
    }

    if (!destination || destination.isDeleted) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy điểm du lịch' });
    }

    // Find nearby hotels in the same district or Da Nang
    const nearbyHotels = await Hotel.find({
      district: destination.district,
      status: 'active',
      isDeleted: false
    }).limit(4).populate('rooms');

    res.json({
      success: true,
      destination,
      nearbyHotels
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle Wishlist item
// @route POST /api/destinations/:id/wishlist
const toggleWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const destId = req.params.id;

    const index = user.wishlist.indexOf(destId);
    let isSaved = false;

    if (index > -1) {
      user.wishlist.splice(index, 1);
      isSaved = false;
    } else {
      user.wishlist.push(destId);
      isSaved = true;
    }

    await user.save();
    res.json({ success: true, isSaved, wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc Admin create destination
// @route POST /api/destinations
const createDestination = async (req, res, next) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ success: true, destination });
  } catch (error) {
    next(error);
  }
};

// @desc Admin update destination
// @route PUT /api/destinations/:id
const updateDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!destination) return res.status(404).json({ success: false, message: 'Không tìm thấy điểm đến' });
    res.json({ success: true, destination });
  } catch (error) {
    next(error);
  }
};

// @desc Admin soft delete destination
// @route DELETE /api/destinations/:id
const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ success: false, message: 'Không tìm thấy điểm đến' });
    destination.isDeleted = true;
    await destination.save();
    res.json({ success: true, message: 'Đã xóa điểm đến du lịch' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDestinations,
  getDestinationDetail,
  toggleWishlist,
  createDestination,
  updateDestination,
  deleteDestination
};
