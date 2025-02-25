import { InvalidInputException } from "./../errors/exceptions";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as i18n from "i18n";
export default function validationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors: any = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.errors[0];
    let msg = `${i18n.__(error.msg)} - ${i18n.__(error.param)}`;
    throw new InvalidInputException(msg);
  }
  next();
}
