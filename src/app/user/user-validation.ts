import { body, param } from "express-validator";
import validate from "../../commons/middlewares/validation";
import {
  isValidEmail,
  isValidInt,
  isValidPassword,
  isValidPhone,
  isValidString,
} from "../../commons/validators/validators";

// Validation for Get User
export const getUser = [
  param("userId").isInt().withMessage("invalid_input"),
  validate,
];

// Validation for Create User
export const create = [
  isValidString("nameAr"),
  isValidString("nameEn").optional(),
  isValidPhone("phone"),
  isValidEmail("email"),
  isValidString("title"),
  isValidInt("agency"),
  isValidPassword("password"),
  isValidInt("userType"),
  isValidInt("active"),
  validate,
];

// Validation for Update User
export const update = [
  param("userId").isInt().withMessage("invalid_input"),
  isValidString("nameAr"),
  isValidString("nameEn").optional(),
  isValidPhone("phone"),
  isValidEmail("email"),
  isValidString("title"),
  isValidInt("agency"),
  isValidInt("userType"),
  isValidInt("active"),
  validate,
];

// Validation for Update Active Status
export const updateActive = [
  param("userId").isInt().withMessage("invalid_input"),
  isValidInt("active"),
  validate,
];

// Validation for Reset Password
export const resetPassword = [
  body("old_password")
    .isLength({ min: 6, max: 14 })
    .withMessage("complex_password_required"),
  isValidPassword("new_password"),
  validate,
];
