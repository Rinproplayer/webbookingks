const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hostay_danang';
    console.log(`[Database] Attempting connection to ${uri}...`);
    
    // Set a short timeout for local fallback check
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`[Database] MongoDB Connected successfully: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[Database] Local MongoDB not reachable (${err.message}). Starting Embedded MongoMemoryServer...`);
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
