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
  userNotFound: "user_not_found",
};

// Helper function for user ID validation
const validateUserId = () =>
  param("userId").isInt().withMessage(messages.invalidInput);

// Validation for Get User
export const getUser = [validateUserId(), validate];

// Validation for Create User
export const create = [
  isValidString("nameAr"),
  isValidString("nameEn").optional(),
  isValidPhone("phone"),
  isValidEmail("email"),
  isValidPassword("password"),
  validate,
];

// Validation for Update User
export const update = [
  validateUserId(),
  isValidString("nameAr"),
  isValidString("nameEn").optional(),
  isValidPhone("phone"),
  isValidEmail("email"),
  isValidInt("active"),
  validate,
];

// Validation for Update Active Status
export const updateActive = [validateUserId(), isValidInt("active"), validate];

// Validation for Reset Password
export const resetPassword = [
  body("old_password")
    .isLength({ min: 6, max: 14 })
    .withMessage(messages.complexPasswordRequired),
  isValidPassword("new_password"),
  validate,
];
