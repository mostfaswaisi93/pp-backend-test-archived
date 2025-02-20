import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { Logger } from "../commons/libs/logger";

dotenv.config({ path: path.resolve(".env") });

const logger = Logger.Instance;

const MONGODB_URL = process.env.MONGO_URL as string;
const DB_NAME = process.env.DB_NAME || "peakproz";

if (!MONGODB_URL) {
  console.error("❌ MONGO_URL is not defined in environment variables.");
  logger.log().error("❌ MONGO_URL is not defined in environment variables.");
  throw new Error("MONGO_URL is not defined in environment variables.");
}

mongoose.set("strictQuery", false);

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URL, { dbName: DB_NAME });

    console.log("✅ MongoDB connected successfully");
    logger.log().info("✅ MongoDB connected successfully");
  } catch (error: any) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    logger.log().error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed");
    logger.log().info("🔌 MongoDB connection closed");
  } catch (error: any) {
    console.error(`❌ Error disconnecting from MongoDB: ${error.message}`);
    logger.log().error(`❌ Error disconnecting from MongoDB: ${error.message}`);
  }
};

export default connectToDatabase;
