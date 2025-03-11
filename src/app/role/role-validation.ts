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
  body("roleName")
    .isString()
    .withMessage("Role name is required")
    .notEmpty()
    .withMessage(messages.requiredField), // Role Name is required

  body("roleCode")
    .optional()
    .isString()
    .withMessage("Role code must be a string"),

  body("roleDescription")
    .optional()
    .isString()
    .withMessage("Role description must be a string"),

  body("permissions")
    .isArray()
    .withMessage("Permissions must be an array of ObjectIds")
    .optional(),

  body("isAdminFlag")
    .isBoolean()
    .withMessage("isAdminFlag must be a boolean")
    .optional(),

  body("status")
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be either ACTIVE or INACTIVE")
    .optional(),

  validate,
];

// Validation for Update Role
export const update = [
  validateRoleId(),

  body("roleName")
    .optional()
    .isString()
    .withMessage("Role name must be a string")
    .notEmpty()
    .withMessage(messages.requiredField), // Role Name is required (if provided)

  body("roleCode")
    .optional()
    .isString()
    .withMessage("Role code must be a string"),

  body("roleDescription")
    .optional()
    .isString()
    .withMessage("Role description must be a string"),

  body("permissions")
    .isArray()
    .withMessage("Permissions must be an array of ObjectIds")
    .optional(),

  body("isAdminFlag")
    .isBoolean()
    .withMessage("isAdminFlag must be a boolean")
    .optional(),

  body("status")
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be either ACTIVE or INACTIVE")
    .optional(),

  validate,
];
