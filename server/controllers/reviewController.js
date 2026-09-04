const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');

// @desc Create verified review post-stay
// @route POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { bookingId, ratings, comment, images = [] } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt phòng' });

    if (booking.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không phải người đặt đơn phòng này' });
    }

    if (booking.status !== 'completed' && !booking.canReview) {
      return res.status(400).json({
        success: false,
        message: 'Bạn chỉ có thể đánh giá sau khi đã hoàn tất thủ tục Check-out thực tế'
      });
    }

    if (booking.isReviewed) {
      return res.status(400).json({ success: false, message: 'Đơn đặt phòng này đã được đánh giá' });
    }

    // Calculate overall rating if not directly passed
    const overall = ratings.overall || (
      (ratings.cleanliness + ratings.location + ratings.service + ratings.amenities + ratings.value) / 5
    );

    const review = await Review.create({
      booking: booking._id,
      hotel: booking.hotel,
      user: req.user.id,
      ratings: {
        cleanliness: ratings.cleanliness || 5,
        location: ratings.location || 5,
        service: ratings.service || 5,
        amenities: ratings.amenities || 5,
        value: ratings.value || 5,
        overall: Number(overall.toFixed(1))
      },
      comment,
      images
    });

    booking.isReviewed = true;
    await booking.save();

    // Recalculate hotel average rating
    const allReviews = await Review.find({ hotel: booking.hotel, isDeleted: false });
    const count = allReviews.length;
    const avgOverall = allReviews.reduce((sum, r) => sum + r.ratings.overall, 0) / count;
    const avgClean = allReviews.reduce((sum, r) => sum + r.ratings.cleanliness, 0) / count;
    const avgLoc = allReviews.reduce((sum, r) => sum + r.ratings.location, 0) / count;
    const avgServ = allReviews.reduce((sum, r) => sum + r.ratings.service, 0) / count;
    const avgAmen = allReviews.reduce((sum, r) => sum + r.ratings.amenities, 0) / count;
    const avgVal = allReviews.reduce((sum, r) => sum + r.ratings.value, 0) / count;

    await Hotel.findByIdAndUpdate(booking.hotel, {
      rating: {
        average: Number(avgOverall.toFixed(1)),
        count,
        cleanliness: Number(avgClean.toFixed(1)),
        location: Number(avgLoc.toFixed(1)),
        service: Number(avgServ.toFixed(1)),
        amenities: Number(avgAmen.toFixed(1)),
        value: Number(avgVal.toFixed(1))
      }
    });

    res.status(201).json({
      success: true,
      message: 'Cảm ơn bạn đã gửi đánh giá lưu trú!',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get reviews for hotel
// @route GET /api/reviews/hotel/:hotelId
const getHotelReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ hotel: req.params.hotelId, isDeleted: false })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc Hotelier reply to review
// @route PUT /api/reviews/:id/reply
const replyToReview = async (req, res, next) => {
  try {
    const { comment } = req.body;
    const review = await Review.findById(req.params.id).populate('hotel');

    if (!review) return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });

    if (req.user.role !== 'admin' && review.hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Không có quyền phản hồi' });
    }

    review.hotelierReply = {
      comment,
      replyDate: new Date()
    };
    await review.save();

    res.json({ success: true, message: 'Đã gửi phản hồi đánh giá', review });
  } catch (error) {
    next(error);
  }
};

// @desc Admin moderate or delete review
// @route DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });

    review.isDeleted = true;
    await review.save();

    res.json({ success: true, message: 'Đã xóa đánh giá vi phạm' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getHotelReviews,
  replyToReview,
  deleteReview
};
