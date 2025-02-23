import { Logger } from "../libs/logger";
import ApplicationException from "../errors/application-exception";
import { Response } from "express";

export default class HttpResWrapper {
  private static _instance: HttpResWrapper | null = null;
  private logger = Logger.Instance;

  private constructor() {}

  static get Instance(): HttpResWrapper {
    if (!this._instance) {
      this._instance = new HttpResWrapper();
    }
    return this._instance;
  }

  public success(res: Response, data: any = null): void {
    this.logger.info("Success response sent.");
    res.status(200).json({
      success: true,
      data: data || null,
    });
  }

  public error(res: Response, error: unknown, status: number = 500): void {
    let errorMessage = "Unexpected error occurred.";
    let errorCode = status;

    if (error instanceof ApplicationException) {
      this.logger.warn(`[ApplicationException] ${error.message}`);
      errorMessage = error.message;
      errorCode = error.code || error.status;
    } else if (error instanceof Error) {
      this.logger.error(`[Unhandled Error] ${error.message}`);
      errorMessage = error.message;
    } else {
      this.logger.error(`[Unknown Error] ${String(error)}`);
      errorMessage = String(error);
    }

    res.status(errorCode).json({
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
      },
    });
  }

  public handle(status: number, message: any, res: Response): void {
    this.logger.error(`[Handle Error] ${message}`);
    res.status(status).json({
      success: false,
      error: {
        code: status,
        message: message,
      },
    });
  }
}
