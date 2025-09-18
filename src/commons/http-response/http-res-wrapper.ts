import { Response } from "express";
import { Logger } from "../libs/logger";
import { BaseException } from "../../commons/errors/base-exception";

export default class HttpResWrapper {
  private static _instance: HttpResWrapper;
  private logger = Logger.Instance;

  private constructor() {}
  public static get Instance(): HttpResWrapper {
    if (!this._instance) this._instance = new HttpResWrapper();
    return this._instance;
  }

  public success(response: Response, message: any, data?: any, token?: any) {
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

  public error(response: Response, error: unknown, status: number = 500) {
    let message = "Unexpected error occurred";
    let code = status;

    if (error instanceof BaseException) {
      message = error.message;
      code = error.code || error.status;

      this.logger.warn(`[BaseException] ${message}`);
    } else if (error instanceof Error) {
      message = error.message;
      code = (error as any).status || 500;

      this.logger.error(`[Unhandled Error] ${message}`);
    } else {
      message = String(error);
      this.logger.error(`[Unknown Error] ${message}`);
    }

    response.status(code).json({
      success: false,
      error: {
        code: code,
        message: message,
      },
    });
  }
}
