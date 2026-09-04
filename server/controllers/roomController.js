const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

// @desc Get rooms by hotel id
// @route GET /api/rooms/hotel/:hotelId
const getRoomsByHotel = async (req, res, next) => {
  try {
    const rooms = await Room.find({
      hotel: req.params.hotelId,
      isDeleted: false
    });
    res.json({ success: true, count: rooms.length, rooms });
  } catch (error) {
    next(error);
  }
};

// @desc Get single room
// @route GET /api/rooms/:id
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel');
    if (!room || room.isDeleted) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hạng phòng' });
    }
    res.json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

// @desc Create room (Hotelier / Admin)
// @route POST /api/rooms
const createRoom = async (req, res, next) => {
  try {
    const { hotelId } = req.body;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ success: false, message: 'Không tìm thấy khách sạn liên kết' });

    if (req.user.role !== 'admin' && hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không sở hữu khách sạn này' });
    }

    const room = await Room.create({
      ...req.body,
      hotel: hotelId
    });

    // Update hotel minPrice if new room price is lower
    if (!hotel.minPrice || room.pricePerNight < hotel.minPrice) {
      hotel.minPrice = room.pricePerNight;
      await hotel.save();
    }

    res.status(201).json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

// @desc Update room
// @route PUT /api/rooms/:id
const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel');
    if (!room || room.isDeleted) return res.status(404).json({ success: false, message: 'Không tìm thấy phòng' });

    if (req.user.role !== 'admin' && room.hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền sửa phòng này' });
    }

    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    // Update minPrice for hotel
    const minRoom = await Room.findOne({ hotel: room.hotel._id, isDeleted: false }).sort({ pricePerNight: 1 });
    if (minRoom) {
      await Hotel.findByIdAndUpdate(room.hotel._id, { minPrice: minRoom.pricePerNight });
    }

    res.json({ success: true, room: updatedRoom });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle lock room (manual close/maintenance)
// @route PUT /api/rooms/:id/toggle-lock
const toggleLockRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel');
    if (!room) return res.status(404).json({ success: false, message: 'Không tìm thấy phòng' });

    if (req.user.role !== 'admin' && room.hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Không có quyền thao tác' });
    }

    room.isLocked = !room.isLocked;
    await room.save();

    res.json({
      success: true,
      isLocked: room.isLocked,
      message: `Phòng đã ${room.isLocked ? 'khóa ngưng nhận khách' : 'mở bán lại bình thường'}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete room
// @route DELETE /api/rooms/:id
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel');
    if (!room) return res.status(404).json({ success: false, message: 'Không tìm thấy phòng' });

    if (req.user.role !== 'admin' && room.hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Không có quyền thao tác' });
    }

    room.isDeleted = true;
    await room.save();

    res.json({ success: true, message: 'Đã xóa hạng phòng thành công' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoomsByHotel,
  getRoomById,
  createRoom,
  updateRoom,
  toggleLockRoom,
  deleteRoom
};
