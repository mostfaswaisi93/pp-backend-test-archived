import { Logger } from "../libs/logger";
import ApplicationException from "../errors/application-exception";
import { Response } from "express";

export default class HttpResWrapper {
  private static _instance: HttpResWrapper | null = null;
  private logger: Logger;

  private constructor() {
    this.logger = new Logger();
  }

  static get Instance(): HttpResWrapper {
    if (!this._instance) {
      this._instance = new HttpResWrapper();
    }
    return this._instance;
  }

  public success(res: Response, data: any = null): void {
    this.logger.log().info("Success response sent.");
    res.status(200).json({
      success: true,
      data: data || null,
    });
  }

  public error(res: Response, error: unknown): void {
    if (error instanceof ApplicationException) {
      this.logger.log().warn(`[ApplicationException] ${error.message}`);
      res.status(error.status).json({
        success: false,
        error: {
          code: error.code || error.status,
          message: error.message,
        },
      });
    } else {
      const message =
        error instanceof Error ? error.message : "Unexpected error occurred.";
      this.logger.log().error(`[Unhandled Error] ${message}`);
      res.status(500).json({
        success: false,
        error: {
          code: 500,
          message: message,
        },
      });
    }
  }

  public handle(res: Response, status: number, error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);

    if (status === 500) {
      this.logger.log().error(`[Critical Error] ${message}`);
    } else {
      this.logger.log().warn(`[Handled Error] ${message}`);
    }

    res.status(status).json({
      success: false,
      error: {
        code: status,
        message: message,
      },
    });
  }
}
