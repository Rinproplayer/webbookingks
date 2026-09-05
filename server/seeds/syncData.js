const Destination = require('../models/Destination');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const User = require('../models/User');
const destinationsData = require('./destinationsData');
const hotelsData = require('./hotelsData');

/**
 * Smart Auto-Sync:
 * Automatically checks and inserts any missing hotels, rooms, or destinations into MongoDB
 * without deleting or overriding existing users, bookings, or reviews.
 */
const syncNewData = async () => {
  try {
    console.log('[Auto-Sync] Checking for new Da Nang destinations & hotels...');

    // 1. Sync Destinations
    let addedDest = 0;
    for (const d of destinationsData) {
      const exists = await Destination.findOne({ slug: d.slug });
      if (!exists) {
        await Destination.create(d);
        addedDest++;
      }
    }

    // 2. Find or create Hotelier owner
    let hotelier = await User.findOne({ role: 'hotelier' });
    if (!hotelier) {
      hotelier = await User.findOne();
    }
    if (!hotelier) {
      hotelier = await User.create({
        name: 'Nguyễn Văn Chủ Khách Sạn',
        email: 'hotelier@hostay.vn',
        password: 'Hotelier@123',
        phone: '0905888999',
        role: 'hotelier',
        partnerStatus: 'approved'
      });
    }

    // 3. Sync Hotels & Rooms
    let addedHotels = 0;
    let addedRooms = 0;

    for (const item of hotelsData) {
      let hotel = await Hotel.findOne({ name: item.hotel.name });
      if (!hotel) {
        hotel = await Hotel.create({
          ...item.hotel,
          owner: hotelier ? hotelier._id : null
        });
        addedHotels++;
      }

      for (const r of item.rooms) {
        const roomExists = await Room.findOne({ hotel: hotel._id, name: r.name });
        if (!roomExists) {
          await Room.create({
            ...r,
            hotel: hotel._id
          });
          addedRooms++;
        }
      }
    }

    console.log(`[Auto-Sync] Sync completed: +${addedDest} destinations, +${addedHotels} hotels, +${addedRooms} rooms added.`);
    return {
      success: true,
      addedDestinations: addedDest,
      addedHotels,
      addedRooms
    };
  } catch (err) {
    console.error('[Auto-Sync Error]', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = syncNewData;
