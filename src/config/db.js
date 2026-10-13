const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.warn('\n⚠️  WARNING: MONGODB_URI is not configured with your credentials in .env!');
    console.warn('👉 Please update .env with your MongoDB Atlas connection string.\n');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host} (DB: ${conn.connection.name})`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't kill process immediately during local dev so healthcheck still works
  }
};

module.exports = connectDB;
