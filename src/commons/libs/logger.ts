import pino from "pino";
import * as fs from "fs";
import moment from "moment";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve() + "/.env" });

export class Logger {
  private static _instance: Logger;
  private logDirectory: string = __dirname + "/../../../logs";
  private logger: pino.Logger;

  // Singleton pattern to ensure one instance of Logger
  static get Instance(): Logger {
    if (!this._instance) {
      this._instance = new Logger();
    }
    return this._instance;
  }

  private constructor() {
    this.ensureLogDirectory();
    this.logger = pino({
      name: `PEAKPROZ-${process.env.NODE_ENV}`,
      level: process.env.LOG_LEVEL || "debug",
      timestamp: () => `, "time": "${moment().format("YYYY-MM-DD HH:mm:ss")}"`,
      formatters: {
        level(label: string) {
          return { level: label.toUpperCase() };
        },
      },
    }, fs.createWriteStream(`${this.logDirectory}/access.log`, { flags: "a" }));
  }

  // Ensure log directory exists
  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  public log(): pino.Logger {
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