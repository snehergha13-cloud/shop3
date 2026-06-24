import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    // Thrown inside the function (not at module load) so API routes'
    // own try/catch blocks can catch it and return a useful error
    // instead of crashing the whole serverless function at cold start.
    throw new Error(
      "MONGODB_URI is not set. Add it in .env.local for local dev, or in your hosting provider's environment variables for production."
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).catch((err) => {
      // Reset the cached promise on failure so the next request gets a
      // fresh connection attempt instead of permanently caching a rejection.
      cached.promise = null;
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
