import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";
import {
  MenuType,
  AccessLevel,
} from "../../models/permission/permission.interface";

const messages = {
  requiredField: "This field is required",
  invalidName: "Name must be a string between 3 and 50 characters",
  invalidDisplayName: "DisplayName must be a string max 100 characters",
  invalidDescription: "Description must be a string max 200 characters",
  invalidScreenId: "ScreenId must be a string max 100 characters",
  invalidIsActive: "isActive must be a boolean",
  invalidMenuType: `menuType must be one of: ${Object.values(MenuType).join(", ")}`,
  invalidAccessLevel: `accessLevel must be one of: ${Object.values(AccessLevel).join(", ")}`,
};

// Reusable validators
const validateNameField = (required = true) => {
  let chain = body("name");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain
    .isString()
    .withMessage(messages.invalidName)
    .isLength({ min: 3, max: 50 })
    .withMessage(messages.invalidName)
    .trim()
    .toLowerCase();
};

const validateDisplayNameField = (required = true) => {
  let chain = body("displayName");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain
    .isString()
    .withMessage(messages.invalidDisplayName)
    .isLength({ max: 100 })
    .withMessage(messages.invalidDisplayName)
    .trim();
};

const validateDescriptionField = (required = false) => {
  let chain = body("description");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain
    .isString()
    .withMessage(messages.invalidDescription)
    .isLength({ max: 200 })
    .withMessage(messages.invalidDescription)
    .trim();
};

const validateScreenIdField = (required = true) => {
  let chain = body("screenId");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain
    .isString()
    .withMessage(messages.invalidScreenId)
    .isLength({ max: 100 })
    .withMessage(messages.invalidScreenId)
    .trim();
};

const validateIsActiveField = (required = true) => {
  let chain = body("isActive");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain.isBoolean().withMessage(messages.invalidIsActive).toBoolean();
};

const validateMenuTypeField = (required = true) => {
  let chain = body("menuType");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain
    .isIn(Object.values(MenuType))
    .withMessage(messages.invalidMenuType);
};

const validateAccessLevelField = (required = true) => {
  let chain = body("accessLevel");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain
    .isIn(Object.values(AccessLevel))
    .withMessage(messages.invalidAccessLevel);
};

// Get Permission
export const getPermission = [isValidMongoId("_id"), validate];

// Create Permission
export const create = [
  validateNameField(true),
  validateDisplayNameField(true),
  validateDescriptionField(false),
  validateScreenIdField(true),
  validateIsActiveField(false),
  validateMenuTypeField(true),
  validateAccessLevelField(true),
  validate,
];

// Update Permission
export const update = [
  isValidMongoId("_id"),
  validateNameField(false),
  validateDisplayNameField(false),
  validateDescriptionField(false),
  validateScreenIdField(false),
  validateIsActiveField(false),
  validateMenuTypeField(false),
  validateAccessLevelField(false),
  validate,
];

// Update Permission Status Only
export const updateStatus = [
  isValidMongoId("_id"),
  validateIsActiveField(true),
  validate,
];
