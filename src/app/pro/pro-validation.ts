import { param, body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import {
  isValidEmail,
  isValidInt,
  isValidPassword,
  isValidPhone,
  isValidString,
  isValidDate,
  isValidOptionalString,
} from "../../commons/validators/validators";

// Define validation messages
const messages = {
  invalidInput: "invalid_input",
  complexPasswordRequired: "complex_password_required",
  invalidDate: "invalid_date",
  fieldRequired: "field_required",
  invalidPhoneNumber: "invalid_phone_number",
  invalidEmail: "invalid_email",
};

// Helper function for Pro ID validation
const validateProId = () =>
  param("proId").isInt().withMessage(messages.invalidInput);

// Validation for Get Pro
export const getPro = [validateProId(), validate];

// Validation for Create Pro
export const create = [
  isValidString("firstName").withMessage(messages.fieldRequired),
  isValidString("lastName").withMessage(messages.fieldRequired),
  isValidString("middleName").optional(),
  isValidDate("dob").optional().withMessage(messages.invalidDate),
  isValidString("socialSecurityNumber").optional(),
  isValidString("proId").optional(),
  isValidString("qrCodeImage").optional(),
  isValidString("userId").optional(),
  isValidString("businessName").withMessage(messages.fieldRequired),
  isValidString("businessType").withMessage(messages.fieldRequired),
  isValidString("businessAddress").withMessage(messages.fieldRequired),
  isValidString("zipcode").withMessage(messages.fieldRequired),
  isValidString("city").withMessage(messages.fieldRequired),
  isValidString("state").withMessage(messages.fieldRequired),
  isValidEmail("email").withMessage(messages.invalidEmail),
  isValidPhone("mobile").withMessage(messages.invalidPhoneNumber),
  isValidPhone("leadPhoneNumber").optional(),
  isValidString("latitude").optional(),
  isValidString("longitude").optional(),
  isValidString("companyLogo").optional(),
  isValidString("vanlynk").optional(),
  isValidString("leadgen").optional(),
  isValidString("vanlynkStatus").optional(),
  isValidString("leadgenStatus").optional(),
  isValidString("license").optional(),
  isValidString("verified").optional(),
  isValidString("adminStatus").optional(),
  isValidString("status").optional(),
  isValidString("reportNote").optional(),
  isValidString("reportFile").optional(),
  isValidOptionalString("yelp_Address"),
  isValidOptionalString("google_Address"),
  isValidOptionalString("socialMediaLinks"),
  validate,
];

// Validation for Update Pro
export const update = [
  validateProId(),
  isValidString("firstName").optional(),
  isValidString("lastName").optional(),
  isValidString("middleName").optional(),
  isValidDate("dob").optional().withMessage(messages.invalidDate),
  isValidString("socialSecurityNumber").optional(),
  isValidString("proId").optional(),
  isValidString("qrCodeImage").optional(),
  isValidString("userId").optional(),
  isValidString("businessName").optional(),
  isValidString("businessType").optional(),
  isValidString("businessAddress").optional(),
  isValidString("zipcode").optional(),
  isValidString("city").optional(),
  isValidString("state").optional(),
  isValidEmail("email").optional(),
  isValidPhone("mobile").optional(),
  isValidPhone("leadPhoneNumber").optional(),
  isValidString("latitude").optional(),
  isValidString("longitude").optional(),
  isValidString("companyLogo").optional(),
  isValidString("vanlynk").optional(),
  isValidString("leadgen").optional(),
  isValidString("vanlynkStatus").optional(),
  isValidString("leadgenStatus").optional(),
  isValidString("license").optional(),
  isValidString("verified").optional(),
  isValidString("adminStatus").optional(),
  isValidString("status").optional(),
  isValidString("reportNote").optional(),
  isValidString("reportFile").optional(),
  isValidString("yelp_Address").optional(),
  isValidString("google_Address").optional(),
  isValidString("socialMediaLinks").optional(),
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
