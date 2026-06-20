/**
 * Database configuration placeholder.
 *
 * The app currently uses an in-memory store (models/Store.js).
 * To upgrade to MongoDB, install mongoose and replace this with:
 *
 *   const mongoose = require('mongoose');
 *   const connectDB = async () => {
 *     await mongoose.connect(process.env.MONGO_URI);
 *     console.log('MongoDB connected');
 *   };
 *   module.exports = connectDB;
 */

module.exports = {
  connect: () => {
    console.log('Using in-memory data store (data resets on restart).');
  }
};
