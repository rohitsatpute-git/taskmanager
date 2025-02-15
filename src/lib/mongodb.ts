import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string; 
if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return; // Already connected
    }
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB", mongoose.connection.name);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
}
