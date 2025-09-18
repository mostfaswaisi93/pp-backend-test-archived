import i18n from "i18n";
import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError } from "express-validator";
import { InvalidInputException } from "../../commons/errors/exceptions";

export default function validationMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error: ValidationError) => i18n.__(error.msg))
      .join(", ");

    throw new InvalidInputException(messages);
  }

  next();
}
