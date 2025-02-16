import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessage = errors
      .array()
      .map((err) => err.msg)
      .join(", ");

    res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errorMessage,
    });
    return;
  }

  next();
};
