import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import * as rfs from "rotating-file-stream";
import pino, { Logger as PinoLogger } from "pino";

dotenv.config();

export class Logger {
  private static _instance: Logger;
  private logDirectory: string;
  private logger: PinoLogger;
  private logStream: rfs.RotatingFileStream;

  private constructor() {
    this.logDirectory = path.resolve(__dirname, "../../../logs");
    this.ensureLogDirectorySync();

    this.logStream = rfs.createStream("access.log", {
      interval: "1d",
      size: "10M",
      compress: "gzip",
      path: this.logDirectory,
    });

    this.logger = pino(
      {
        name: `PEA-${process.env.NODE_ENV || "development"}`,
        level:
          process.env.NODE_ENV === "production"
            ? process.env.LOG_LEVEL_PROD || "warn"
            : process.env.LOG_LEVEL || "debug",
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
          level(label: string) {
            return { level: label.toUpperCase() };
          },
        },
      },
      pino.destination({
        dest: path.join(this.logDirectory, "access.log"),
        sync: true,
      })
    );

    process.on("exit", () => this.shutdown());
    process.on("SIGINT", () => {
      this.shutdown();
      process.exit(0);
    });
    process.on("SIGTERM", () => {
      this.shutdown();
      process.exit(0);
    });
  }

  private ensureLogDirectorySync(): void {
    try {
      if (!fs.existsSync(this.logDirectory)) {
        fs.mkdirSync(this.logDirectory, { recursive: true });
      }
    } catch (error) {
      console.error("Error creating log directory:", error);
    }
  }

  public static get Instance(): Logger {
    if (!this._instance) {
      this._instance = new Logger();
    }
    return this._instance;
  }

  public log(): PinoLogger {
    return this.logger;
  }

  public info(message: string, obj?: Record<string, any>): void {
    this.logger.info(obj || {}, message);
  }

  public warn(message: string, obj?: Record<string, any>): void {
    this.logger.warn(obj || {}, message);
  }

  public error(message: string, obj?: Record<string, any>): void {
    this.logger.error(obj || {}, message);
  }

  public debug(message: string, obj?: Record<string, any>): void {
    this.logger.debug(obj || {}, message);
  }

  public shutdown(): Promise<void> {
    return new Promise((resolve) => {
      setImmediate(() => {
        try {
          if ((this.logStream as any).flushSync) {
            (this.logStream as any).flushSync();
          }
        } catch (e) {
          console.error("Flush failed:", e);
        }
        console.log("Logger has been shut down gracefully.");
        resolve();
      });
    });
  }
}
