const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const seedData = require('./seeds/seed');
const syncNewData = require('./seeds/syncData');
const User = require('./models/User');
const { initReminderScheduler } = require('./utils/scheduler');

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static folder for uploads if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/vouchers', require('./routes/voucherRoutes'));
app.use('/api/checkin', require('./routes/checkinRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const mongoose = require('mongoose');
  const Hotel = require('./models/Hotel');
  const Destination = require('./models/Destination');
  const Room = require('./models/Room');
  
  let stats = { hotels: 0, destinations: 0, rooms: 0 };
  try {
    stats.hotels = await Hotel.countDocuments({ isDeleted: false });
    stats.destinations = await Destination.countDocuments({ isDeleted: false });
    stats.rooms = await Room.countDocuments({ isDeleted: false });
  } catch (e) {}

  const host = mongoose.connection.host || 'unknown';
  const isAtlas = host.includes('mongodb.net');

  res.json({
    status: 'online',
    project: 'Hostay - Hotel & Homestay Online Booking and Management System',
    location: 'Da Nang City, Vietnam',
    database: {
      type: isAtlas ? 'MongoDB Atlas (Cloud)' : 'MongoMemoryServer (Fallback)',
      host: host,
      readyState: mongoose.connection.readyState,
      stats: stats
    },
    timestamp: new Date().toISOString()
  });
});

// Auto-sync endpoint to update new hotels & destinations in MongoDB
app.get('/api/sync-data', async (req, res) => {
  const result = await syncNewData();
  res.json({
    status: 'sync_completed',
    ...result
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
connectDB().then(async () => {
  // Check if initial seed is needed or run smart auto-sync
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Server] Database is empty. Running initial Da Nang data seed...');
      await seedData();
    } else {
      console.log('[Server] Database exists. Running smart auto-sync for any new destinations & hotels...');
      await syncNewData();
    }
  } catch (seedErr) {
    console.warn('[Server] Seed check error:', seedErr.message);
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Hostay Server is running on http://localhost:${PORT}`);
    console.log(`📍 Specialized for Da Nang Hotel & Homestay Booking`);
    console.log(`====================================================`);

    // Initialize daily check-in email reminder scheduler
    initReminderScheduler();
  });
});
