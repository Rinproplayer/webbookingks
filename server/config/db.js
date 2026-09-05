const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://nguyendangcap122005_db_user:RhYHWV66OSMvtZYV@cluster0.2a2kyee.mongodb.net/hostay_danang?retryWrites=true&w=majority&appName=Cluster0';
    console.log(`[Database] Attempting connection to MongoDB Atlas...`);
    
    // Set 10s timeout for reliable cloud connection
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`[Database] MongoDB Connected successfully: ${mongoose.connection.host} (${mongoose.connection.name})`);
  } catch (err) {
    console.warn(`[Database] MongoDB connection failed (${err.message}). Starting Embedded MongoMemoryServer...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      console.log(`[Database] MongoMemoryServer started at ${memUri}`);
      await mongoose.connect(memUri);
      console.log(`[Database] Connected to Embedded MongoDB successfully!`);
    } catch (memErr) {
      console.error(`[Database] Failed to start MongoMemoryServer:`, memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
