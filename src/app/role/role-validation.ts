import { param, body } from "express-validator";
import validate from "../../commons/middlewares/validation";

const messages = {
  invalidInput: "Invalid input",
  complexPasswordRequired: "Complex password required",
  requiredField: "This field is required",
};

const validateRoleId = () =>
  param("roleId").isMongoId().withMessage(messages.invalidInput);

// Validation for Get Role
export const getRole = [validateRoleId(), validate];

// Validation for Create Role
export const create = [
  body("name")
    .isString()
    .withMessage("Role name is required")
    .notEmpty()
    .withMessage(messages.requiredField), // Role Name is required

  body("code").optional().isString().withMessage("Role code must be a string"),

  body("description")
    .optional()
    .isString()
    .withMessage("Role description must be a string"),

  body("permissions")
    .optional()
    .isArray()
    .withMessage("Permissions must be an array of ObjectIds"),

  body("isAdmin")
    .optional()
    .isBoolean()
    .withMessage("isAdmin must be a boolean"),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be either ACTIVE or INACTIVE"),

  validate,
];

// Validation for Update Role
export const update = [
  validateRoleId(),

  body("name")
    .optional()
    .isString()
    .withMessage("Role name must be a string")
    .notEmpty()
    .withMessage(messages.requiredField), // Role Name is required (if provided)

  body("code").optional().isString().withMessage("Role code must be a string"),

  body("description")
    .optional()
    .isString()
    .withMessage("Role description must be a string"),

  body("permissions")
    .optional()
    .isArray()
    .withMessage("Permissions must be an array of ObjectIds"),

  body("isAdmin")
    .optional()
    .isBoolean()
    .withMessage("isAdmin must be a boolean"),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be either ACTIVE or INACTIVE"),

  validate,
];
