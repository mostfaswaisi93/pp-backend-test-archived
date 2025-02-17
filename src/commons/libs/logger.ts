import pino from "pino";
import * as fs from "fs";
import moment from "moment";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { Logger as PinoLogger } from "pino";

dotenv.config({ path: resolve() + "/.env" });

export class Logger {
  private static _instance: Logger;
  private logDirectory: string = __dirname + "/../../../logs";

  // Singleton pattern to ensure one instance of Logger
  static get Instance(): Logger {
    if (!this._instance) {
      this._instance = new Logger();
    }
    return this._instance;
  }

  constructor() {
    // Ensure that the log directory exists
    this.ensureLogDirectory();
  }

  // Ensure log directory exists
  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  // Setup the Pino logger instance
  public log(): PinoLogger {
    const stream = fs.createWriteStream(`${this.logDirectory}/access.log`, {
      flags: "a",
    });

    const logger = pino(
      {
        name: `ANCSI-${process.env.NODE_ENV}`,
        level: process.env.LOG_LEVEL || "debug", // Default to 'debug' if not specified
        timestamp: () => {
          return `, "time": "${moment().format("YYYY-MM-DD HH:mm:ss")}"`;
        },
        formatters: {
          level(label: string) {
            return { level: label.toUpperCase() }; // Format log level
          },
        },
      },
      stream
    );

    return logger;
  }

  // Example of async log function (optional enhancement)
  public async asyncLog(message: string): Promise<void> {
    const logger = this.log();
    try {
      logger.info(message);
    } catch (error) {
      console.error("Error writing log:", error);
    }
  }
}
