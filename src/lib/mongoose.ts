// lib/mongoose.ts
import mongoose from "mongoose";

// Global cache to persist connection across hot reloads in dev
let isConnected: boolean = false;

export const connectDB = async () => {
  console.log("🔗 Attempting to connect to MongoDB...");
  console.log("Current connection status:", isConnected);
  
  if (isConnected) {
    console.log("✅ Already connected to MongoDB");
    return;
  }

  // Read MONGO_URI at runtime
  let MONGO_URI = process.env.MONGO_URI;
  
  // Fallback: try different ways to get the URI
  if (!MONGO_URI) {
    console.log("⚠️ MONGO_URI not found in process.env, trying alternatives...");
    MONGO_URI = process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.DATABASE_URL;
  }
  
  console.log("🔍 DEBUGGING MONGOOSE CONNECTION:");
  console.log("MONGO_URI exists:", !!MONGO_URI);
  console.log("MONGO_URI length:", MONGO_URI?.length);
  console.log("MONGO_URI starts with:", MONGO_URI?.substring(0, 20));
  console.log("process.env keys:", Object.keys(process.env).filter(key => key.includes('MONGO')));
  console.log("All env vars:", Object.keys(process.env).slice(0, 10)); // Show first 10 env vars

  if (!MONGO_URI) {
    console.error("❌ MONGO_URI is undefined or empty");
    console.error("Available env vars:", Object.keys(process.env));
    throw new Error("❌ MONGO_URI environment variable is not defined");
  }

  try {
    console.log("🌐 Connecting to:", MONGO_URI.substring(0, 50) + "...");
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      console.log("✅ MongoDB connected successfully");
      // Import models after connection to ensure they're registered
      await import('../app/models/usermodel');
      await import('../app/models/walkroutemodel');
    } else {
      console.log("❌ MongoDB connection failed - readyState:", db.connections[0].readyState);
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};
