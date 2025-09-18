import { body, param } from "express-validator";
import validate from "../../commons/middlewares/validation";
import {
  isValidMongoId,
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidString,
  isValidBoolean,
} from "../../commons/validators/validators";

const messages = {
  requiredField: "This field is required",
  invalidString: "Must be a valid string",
  invalidEmail: "Must be a valid email",
  invalidPhone: "Must be a valid phone number",
  complexPasswordRequired: "Password must meet complexity requirements",
  userNotFound: "User not found",
  invalidBoolean: "Must be a boolean",
};

// Reusable validators ---
const validateUserIdField = (required = true) => {
  let chain = param("_id");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain.custom((id) => {
    if (id && !isValidMongoId(id)) throw new Error(messages.userNotFound);
    return true;
  });
};

const validateNameField = (fieldName: string, required = true) => {
  let chain = body(fieldName);
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain.isString().withMessage(messages.invalidString).trim();
};

const validateEmailField = (fieldName: string, required = true) => {
  let chain = body(fieldName);
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain.isEmail().withMessage(messages.invalidEmail).normalizeEmail();
};

const validatePhoneField = (fieldName: string, required = true) => {
  let chain = body(fieldName);
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain.custom((value) => {
    if (!isValidPhone(value)) throw new Error(messages.invalidPhone);
    return true;
  });
};

const validatePasswordField = (fieldName: string, required = true) => {
  let chain = body(fieldName);
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain.custom((value) => {
    if (value && !isValidPassword(value))
      throw new Error(messages.complexPasswordRequired);
    return true;
  });
};

const validateBooleanField = (fieldName: string, required = false) => {
  let chain = body(fieldName);
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain.custom((value) => {
    if (value !== undefined && !isValidBoolean(value))
      throw new Error(messages.invalidBoolean);
    return true;
  });
};

// Get User
export const getUser = [validateUserIdField(), validate];

// Create User
export const create = [
  validateNameField("firstName"),
  validateNameField("lastName").optional(),
  validateEmailField("email"),
  validatePhoneField("phoneNumber"),
  validatePasswordField("password"),
  validateBooleanField("isUserRegComplete"),
  validateBooleanField("isLeadRegComplete"),
  validateBooleanField("isVanlynkRegComplete"),
  validate,
];

// Update User
export const update = [
  validateUserIdField(),
  validateNameField("firstName").optional(),
  validateNameField("lastName").optional(),
  validateEmailField("email").optional(),
  validatePhoneField("phoneNumber").optional(),
  validateBooleanField("isUserRegComplete").optional(),
  validateBooleanField("isLeadRegComplete").optional(),
  validateBooleanField("isVanlynkRegComplete").optional(),
  validate,
];

// Update User Status
export const updateStatus = [
  validateUserIdField(),
  validateBooleanField("isDeactivated", true),
  validate,
];

// Change Password
export const changePassword = [
  validateUserIdField(),
  validatePasswordField("oldPassword"),
  validatePasswordField("newPassword"),
  validate,
];
