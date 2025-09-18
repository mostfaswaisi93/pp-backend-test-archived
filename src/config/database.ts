import dotenv from "dotenv";
import mongoose from "mongoose";
import { Logger } from "../commons/libs/logger";

dotenv.config();
const logger = Logger.Instance;

// Environment
const MONGODB_URL = process.env.MONGO_URL as string;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URL) {
  console.error("❌ MONGO_URL is not defined in environment variables.");
  logger.error("❌ MONGO_URL is not defined in environment variables.");
  throw new Error("MONGO_URL is not defined in environment variables.");
}

// Disable strict query filtering to avoid warnings
mongoose.set("strictQuery", false);

// Connect to MongoDB
export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URL, { dbName: DB_NAME });

    console.log(`✅ MongoDB (${DB_NAME}) connected successfully`);
    logger.info(`✅ MongoDB (${DB_NAME}) connected successfully`);
  } catch (error: any) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    logger.error("❌ MongoDB connection error", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

// Disconnect from MongoDB
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    console.log(`🔌 MongoDB (${DB_NAME}) connection closed`);
    logger.info(`🔌 MongoDB (${DB_NAME}) connection closed`);
  } catch (error: any) {
    console.error(`❌ Error disconnecting from MongoDB: ${error.message}`);
    logger.error("❌ Error disconnecting from MongoDB", {
      message: error.message,
      stack: error.stack,
    });
  }
};

export default connectToDatabase;
