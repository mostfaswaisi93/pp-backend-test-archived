import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import {
  isValidEmail,
  isValidPassword,
  isValidParamEmail,
  isValidToken,
  isBooleanField,
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
  isValidToken("verificationToken"),
  isValidPassword("password"),
  validate,
];

// ✅ Validation for checking email by param
export const checkEmail = [isValidParamEmail("emailId"), validate];

// ✅ Validation for checking pro status by param
export const checkProStatus = [isValidParamEmail("ProEmailId"), validate];

// ✅ Validation for updateVanRegFlag
export const updateVanRegFlag = [
  isValidEmail("emailId"),
  isBooleanField("vanlynkRegCompletedFlag"),
  validate,
];

// ✅ Validation for updateLeadRegFlag
export const updateLeadRegFlag = [
  isValidEmail("emailId"),
  isBooleanField("leadRegCompletedFlag"),
  validate,
];

// ✅ Validation rules for forgot-password-verify
export const forgotPasswordVerify = [
  isValidEmail("emailId"),
  body("role")
    .notEmpty()
    .withMessage("Role is required.")
    .isString()
    .withMessage("Role must be a string."),
  validate,
];

// ✅ Validation for adminSignInAsPro
export const adminSignInAsPro = [isValidEmail("proEmail"), validate];

// ✅ Validation for updating user profile
export const updateUserProfile = [
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string."),

  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string."),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address."),

  body("phone")
    .optional()
    .isString()
    .withMessage("Phone number must be a string."),

  body("address")
    .optional()
    .isString()
    .withMessage("Address must be a string."),

  body("profilePicture")
    .optional()
    .isURL()
    .withMessage("Profile picture must be a valid URL."),

  validate,
];
