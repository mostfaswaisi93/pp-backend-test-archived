import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import {
  isValidEmail,
  isValidInt,
  isValidPassword,
} from "../../commons/validators/validators";

// Validation for Login
export const login = [
  isValidEmail("email"),
  body("password")
    .isLength({ min: 6, max: 14 })
    .withMessage(
      "Password must contain numbers, symbols, and uppercase and lowercase letters and not be less than 6 digits"
    )
    .trim(),
  validate,
];

// Validation for Forget Password
export const forgetPassword = [isValidEmail("email"), validate];

// Validation for Reset Password
export const resetPassword = [
  isValidInt("verificationToken"),
  isValidPassword("password"),
  validate,
];
