import i18n from "i18n";
import { Request, Response, NextFunction } from "express";
import { InvalidInputException } from "../errors/exceptions";
import { validationResult, ValidationError } from "express-validator";

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
        const message = i18n.__(error.msg) || "";
        return `${message}`;
      });

    throw new InvalidInputException(extractedErrors.join(", "));
  }
  next();
}
