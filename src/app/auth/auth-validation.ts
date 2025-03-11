import validate from "../../commons/middlewares/validation";
import {
  isValidEmail,
  isValidInt,
  isValidPassword,
} from "../../commons/validators/validators";

// Validation for Login
export const login = [
  isValidEmail("email"),
  isValidPassword("password"),
  validate,
];

// Validation for forgot Password
export const forgotPassword = [isValidEmail("email"), validate];

// Validation for Reset Password
export const resetPassword = [
  isValidInt("verificationToken"),
  isValidPassword("password"),
  validate,
];
