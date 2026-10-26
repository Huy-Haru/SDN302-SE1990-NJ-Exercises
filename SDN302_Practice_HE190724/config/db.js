const mongoose = require('mongoose');
const path = require('node:path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

module.exports = async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error('Missing MONGO_URI in .env');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('MongoDB connected: ' + mongoose.connection.name);
};
