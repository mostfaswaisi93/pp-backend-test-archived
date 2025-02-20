import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { Logger } from "../commons/libs/logger";
import { connectToDatabase } from "./database-connection";

class CustomError extends Error {
  status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

let database: mongoose.Connection | null = null;
const logger = Logger.Instance.log();

export const bootstrap = async (): Promise<Boolean> => {
  try {
    dotenv.config({ path: ".env" });

    await connectToDatabase();

    database = mongoose.connection;

    database.on("connected", () => {
      console.log("✅ MongoDB connected successfully");
      logger.info("✅ MongoDB connected successfully");
    });

    database.on("error", (err) => {
      console.error(
        `Database connection error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      logger.error(
        `Database connection error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    });
  } catch (error) {
    if (error instanceof CustomError) {
      console.error(`${error.status} - ${error.message} - Connection Error`);
      logger.error(`${error.status} - ${error.message} - Connection Error`);
    } else if (error instanceof Error) {
      console.error(`${error.message} - Connection Error`);
      logger.error(`${error.message} - Connection Error`);
    } else {
      console.error("An unknown error occurred");
      logger.error("An unknown error occurred");
    }
    throw error instanceof CustomError
      ? error
      : new CustomError("Unknown error", 500);
  }

  return true;
};

export const Database: mongoose.Connection = database!;
