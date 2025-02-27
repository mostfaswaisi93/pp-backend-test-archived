import i18n from "i18n";
import { Request, Response, NextFunction } from "express";
import ApplicationException from "../../commons/errors/application-exception";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApplicationException) {
    res.status(err.status).send({
      message: err.message,
      code: err.code,
    });
  } else {
    console.error(err.stack);
    res.status(500).send({ message: i18n.__("something_wrong") });
  }
};
