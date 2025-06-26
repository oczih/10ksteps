// lib/mongoose.ts
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI environment variable is not defined");
}

// Global cache to persist connection across hot reloads in dev
let isConnected: boolean = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      console.log("✅ MongoDB connected");
    } else {
      console.log("❌ MongoDB connection failed");
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};
