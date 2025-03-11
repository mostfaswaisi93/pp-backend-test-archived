import i18n from "i18n";
import { Request, Response, NextFunction } from "express";
import ApplicationException from "../../commons/errors/application-exception";

export const errorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof ApplicationException) {
    response.status(error.status).send({
      message: error.message,
      code: error.code,
    });
  } else {
    console.error(error.stack);
    response.status(500).send({ message: i18n.__("something_wrong") });
  }
};
