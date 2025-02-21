import pino from "pino";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export class Logger {
  private static _instance = new Logger();
  private logDirectory: string;
  private logger: pino.Logger;

  private constructor() {
    this.logDirectory = path.resolve(__dirname, "../../../logs");
    this.ensureLogDirectory();

    const logFilePath = path.join(this.logDirectory, "access.log");
    const logStream = pino.destination(logFilePath);

    this.logger = pino(
      {
        name: `PEAKPROZ-${process.env.NODE_ENV || "development"}`,
        level: process.env.LOG_LEVEL || "debug",
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
          level(label: string) {
            return { level: label.toUpperCase() };
          },
        },
      },
      logStream
    );
  }

  private async ensureLogDirectory(): Promise<void> {
    try {
      await fs.promises.mkdir(this.logDirectory, { recursive: true });
    } catch (error) {
      console.error("Error creating log directory:", error);
    }
  }

  static get Instance(): Logger {
    if (!this._instance) {
      this._instance = new Logger();
    }
    return this._instance;
  }

  public log(): pino.Logger {
    return this.logger;
  }

  public getLogger(): pino.Logger {
    return this.logger;
  }

  public async asyncLog(message: string): Promise<void> {
    try {
      this.logger.info(message);
    } catch (error) {
      console.error("Error writing log:", error);
    }
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public error(message: string): void {
    this.logger.error(message);
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }
}
