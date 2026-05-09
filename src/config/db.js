const mongoose = require("mongoose");

/**
 * Centralized DB connection.
 * Keeping this in `config/` makes it easy to reuse in tests/jobs later.
 */
async function connectDB(mongoUri) {
  if (!mongoUri) {
    const err = new Error("MONGODB_URI is missing. Set it in backend/.env");
    err.statusCode = 500;
    throw err;
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri, {
    autoIndex: true
  });

  // eslint-disable-next-line no-console
  console.log("MongoDB connected");
}

module.exports = { connectDB };

