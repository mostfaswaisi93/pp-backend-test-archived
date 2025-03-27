import validate from "../../commons/middlewares/validation";
import {
  isValidEmail,
  isValidInt,
  isValidPassword,
} from "../../commons/validators/validators";

// ✅ Validation rules for user login
export const login = [
  isValidEmail("email"),
  isValidPassword("password"),
  validate,
];

// ✅ Validation rules for password recovery
export const forgotPassword = [isValidEmail("email"), validate];

// ✅ Validation rules for resetting the password
export const resetPassword = [
  isValidInt("verificationToken"),
  isValidPassword("password"),
  validate,
];
