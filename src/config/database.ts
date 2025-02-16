import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.resolve(".env") });

const MONGODB_URL = process.env.MONGO_URI as string;

if (!MONGODB_URL) {
  throw new Error("MONGO_URI is not defined in environment variables.");
}

// MongoDB Connection
const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URL, {
      dbName: process.env.DB_NAME, // Optional if you want to specify a DB name
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDb;
