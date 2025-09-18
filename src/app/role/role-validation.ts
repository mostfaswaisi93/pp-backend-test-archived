import { body } from "express-validator";
import { Status } from "../../commons/constants/constants";
import validate from "../../commons/middlewares/validation";
import { RoleLevel } from "../../models/role/role.interface";
import { isValidMongoId } from "../../commons/validators/validators";
import { Permission } from "../../models/permission/permission.model";

const messages = {
  requiredField: "This field is required",
  invalidName: "Name must be a string between 3 and 50 characters",
  invalidCode: "Code must be a string max 20 characters",
  invalidDescription: "Description must be a string max 200 characters",
  invalidPermission: "Permissions must be an array of valid ObjectIds",
  invalidParentRole: "ParentRole must be a valid MongoId",
  invalidLevel: `Level must be one of: ${Object.values(RoleLevel).join(", ")}`,
  invalidIsAdmin: "isAdmin must be a boolean",
  invalidIsSystemRole: "isSystemRole must be a boolean",
  invalidStatus: `Status must be one of: ${Object.values(Status).join(", ")}`,
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
    .toUpperCase();
};

const validateCodeField = (required = true) => {
  let chain = body("code");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain
    .isString()
    .withMessage(messages.invalidCode)
    .isLength({ max: 20 })
    .withMessage(messages.invalidCode)
    .trim()
    .toUpperCase();
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

const validatePermissionsField = (required = false) => {
  let chain = body("permissions");
  chain = required
    ? chain.isArray().withMessage(messages.invalidPermission)
    : chain.optional();

  return chain.custom(async (permissions) => {
    if (permissions && !Array.isArray(permissions)) {
      throw new Error(messages.invalidPermission);
    }

    for (const id of permissions || []) {
      if (!isValidMongoId(id)) {
        throw new Error(`Invalid permission id: ${id}`);
      }
      const exists = await Permission.exists({ _id: id });
      if (!exists) {
        throw new Error(`Permission not found for id: ${id}`);
      }
    }
    return true;
  });
};

const validateParentRoleField = (required = false) => {
  let chain = body("parentRole");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain.custom((id) => {
    if (id && !isValidMongoId(id)) {
      throw new Error(messages.invalidParentRole);
    }
    return true;
  });
};

const validateLevelField = (required = true) => {
  let chain = body("level");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain
    .isIn(Object.values(RoleLevel))
    .withMessage(messages.invalidLevel);
};

const validateIsAdminField = (required = false) => {
  let chain = body("isAdmin");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain.isBoolean().withMessage(messages.invalidIsAdmin).toBoolean();
};

const validateIsSystemRoleField = (required = false) => {
  let chain = body("isSystemRole");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain
    .isBoolean()
    .withMessage(messages.invalidIsSystemRole)
    .toBoolean();
};

const validateStatusField = (required = true) => {
  let chain = body("status");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain.isIn(Object.values(Status)).withMessage(messages.invalidStatus);
};

// Get Role
export const getRole = [isValidMongoId("_id"), validate];

// Create Role
export const create = [
  validateNameField(true),
  validateCodeField(true),
  validateDescriptionField(false),
  validatePermissionsField(false),
  validateParentRoleField(false),
  validateLevelField(true),
  validateIsAdminField(false),
  validateIsSystemRoleField(false),
  validateStatusField(true),
  validate,
];

// Update Role
export const update = [
  isValidMongoId("_id"),
  validateNameField(false),
  validateCodeField(false),
  validateDescriptionField(false),
  validatePermissionsField(false),
  validateParentRoleField(false),
  validateLevelField(false),
  validateIsAdminField(false),
  validateIsSystemRoleField(false),
  validateStatusField(false),
  validate,
];

// Update Role Status Only
export const updateStatus = [
  isValidMongoId("_id"),
  validateStatusField(true),
  validate,
];
