import { param, body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import {
  isValidEmail,
  isValidInt,
  isValidPassword,
  isValidPhone,
  isValidString,
} from "../../commons/validators/validators";

// Define validation messages
const messages = {
  invalidInput: "invalid_input",
  complexPasswordRequired: "complex_password_required",
};

// Helper function for Pro ID validation
const validateProId = () =>
  param("proId").isInt().withMessage(messages.invalidInput);

// Validation for Get Pro
export const getPro = [validateProId(), validate];

// Validation for Create Pro
export const create = [
  isValidString("nameAr"),
  isValidString("nameEn").optional(),
  isValidPhone("phone"),
  isValidEmail("email"),
  isValidPassword("password"),
  validate,
];

// Validation for Update Pro
export const update = [
  validateProId(),
  isValidString("nameAr"),
  isValidString("nameEn").optional(),
  isValidPhone("phone"),
  isValidEmail("email"),
  isValidInt("active"),
  validate,
];

// Validation for Update Active Status
export const updateActive = [validateProId(), isValidInt("active"), validate];

// Validation for Reset Password
export const resetPassword = [
  body("old_password")
    .isLength({ min: 6, max: 14 })
    .withMessage(messages.complexPasswordRequired),
  isValidPassword("new_password"),
  validate,
];
