import { InvalidInputException } from "../errors/exceptions";
import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError } from "express-validator";
import i18n from "i18n";

export default function validationMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    const extractedErrors = errors
      .array()
      .map((error: ValidationError | any) => {
        const message = i18n.__(error.msg) || "Invalid value";
        const field = error.param ? i18n.__(error.param) : "unknown field";
        return `${message} - ${field}`;
      });

    throw new InvalidInputException(extractedErrors.join(", "));
  }
  next();
}
