import { Logger } from "../libs/logger";
import ApplicationException from "../errors/application-exception";
import { Response } from "express";

export default class HttpResWrapper {
  private static _instance: HttpResWrapper;
  private logger = Logger.Instance;

  private constructor() {}

  static get Instance(): HttpResWrapper {
    if (!this._instance) {
      this._instance = new HttpResWrapper();
    }
    return this._instance;
  }

  public success(
    response: Response,
    message: any,
    data?: any,
    token?: any
  ): void {
    this.logger.info(`Success: ${message}`);
    response.status(200).json({
      // success: true,
      status: 200,
      result: "success",
      message: message,
      // response: message,
      data,
      token,
    });
  }

  public error(response: Response, error: unknown, status: number = 500): void {
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

    response.status(errorCode).json({
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
      },
    });
  }

  public handle(status: number, error: unknown, response: Response): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack =
      error instanceof Error && error.stack ? `\nStack: ${error.stack}` : "";

    this.logger.error(`[Handle Error] ${errorMessage}${errorStack}`);

    const safeMessage = status === 500 ? "Internal Server Error" : errorMessage;

    response.status(status).json({
      success: false,
      error: {
        code: status,
        message: safeMessage,
      },
    });
  }
}
