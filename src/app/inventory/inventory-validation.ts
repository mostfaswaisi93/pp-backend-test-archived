import { body, param } from "express-validator";
import {
  isValidString,
  isValidMongoId,
} from "../../commons/validators/validators";
import validate from "../../commons/middlewares/validation";

const messages = {
  invalidInput: "Invalid input",
  requiredField: "This field is required",
};
import { query } from "express-validator";

// Validation for Get Inventory
export const getInventory = [isValidMongoId("_id"), validate];

// Validation for Create Inventory
export const create = [
  isValidString("name"),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be either ACTIVE or INACTIVE"),
  validate,
];

// Validation for Update Inventory
export const update = [
  isValidMongoId("_id"),
  // isValidString("name"),
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be either ACTIVE or INACTIVE"),
  validate,
];

export const updateStatus = [
  isValidMongoId("_id"),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be either ACTIVE or INACTIVE"),
  validate,
];

// Validation for Get Staff Inventory
export const getStaffInventory = [isValidMongoId("userId"), validate];

// Validation for Get Inventory List By ProId
export const getInventoryListByProId = [isValidMongoId("proId"), validate];

// ✅ Validation for Get Inventory Data By Category Code
export const getInvDataByCategoryCode = [
  param("categoryCode")
    .notEmpty()
    .withMessage("Category code is required")
    .isString()
    .withMessage("Category code must be a string"),
  validate,
];

export const getInvLocations = [
  query("region").optional().isString().withMessage("Region must be a string"),
  query("type").optional().isString().withMessage("Type must be a string"),
  validate,
];

export const getAccInvSubSubcat = [
  query("categoryCode")
    .notEmpty()
    .withMessage("Category code is required")
    .isString()
    .withMessage("Category code must be a string"),
  validate,
];

// ✅ Validation for Get Inventory Pro Selected Category
export const getInventoryProSelectedCategory = [
  param("proId")
    .notEmpty()
    .withMessage("Pro ID is required")
    .custom(isValidMongoId)
    .withMessage("Pro ID must be a valid Mongo ID"),
  param("categoryCode")
    .notEmpty()
    .withMessage("Category code is required")
    .isString()
    .withMessage("Category code must be a string"),
  validate,
];

export const getCategoriesFromAcc = [
  param("accId")
    .notEmpty()
    .withMessage("Account ID is required")
    .custom(isValidMongoId)
    .withMessage("Account ID must be a valid Mongo ID"),
  validate,
];
