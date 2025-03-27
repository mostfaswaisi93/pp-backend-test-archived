import { body, param } from "express-validator";

// Helper functions for common validation patterns
export const isValidMongoId = (field: string) =>
  param(field).isMongoId().withMessage("Invalid MongoDB ID");

export const isValidString = (field: string) =>
  body(field).isString().withMessage("invalid_input");

export const isValidInt = (field: string) =>
  body(field).isInt().withMessage("invalid_input");

export const isValidEmail = (field: string) =>
  body(field)
    .isEmail()
    .customSanitizer((val) =>
      typeof val === "string" ? val.toLowerCase() : val
    )
    .withMessage("Invalid email");

export const isValidPhone = (field: string) =>
  body(field)
    .isInt()
    .isLength({ min: 8, max: 15 })
    .withMessage("invalid_input");

export const isValidPassword = (field: string) =>
  body(field)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage("complex_password_required");

export const isValidDate = (field: string) =>
  body(field).isISO8601().withMessage("invalid_date_format");

export const isValidBoolean = (field: string) =>
  body(field).isBoolean().withMessage("invalid_boolean_value");

export const isValidArray = (field: string) =>
  body(field).isArray().withMessage("invalid_array_format");

export const isValidUUID = (field: string) =>
  body(field).isUUID().withMessage("invalid_uuid_format");
