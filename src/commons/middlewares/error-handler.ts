import { Logger } from "../libs/logger";
import { Request, Response, NextFunction } from "express";
import { BaseException } from "../../commons/errors/base-exception";

const logger = Logger.Instance;

export const globalErrorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const env = process.env.NODE_ENV || "development";

  // 404 special case
  if (!error.status && !error.statusCode && response.statusCode === 200) {
    logger.warn("Route not found", {
      url: request.originalUrl,
      method: request.method,
      ip: request.ip,
    });
    return response.status(404).json({
      success: false,
      error: { code: 404, message: "Not Found" },
    });
  }

  // Determine status & message
  const status = error instanceof BaseException ? error.status : 500;
  const message =
    error instanceof BaseException
      ? error.message
      : env === "production"
        ? "Internal Server Error"
        : error.message;

  // Detailed logging
  logger.error("Unhandled error", {
    status,
    message: error.message,
    url: request.originalUrl,
    method: request.method,
    ip: request.ip,
    stack: env !== "production" ? error.stack : undefined,
  });

  // Send unified response
  response.status(status).json({
    success: false,
    error: {
      code: status,
      message,
    },
  });
};
