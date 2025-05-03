import { body } from "express-validator";
import {
  isValidString,
  isValidMongoId,
} from "../../commons/validators/validators";
import validate from "../../commons/middlewares/validation";

const messages = {
  invalidInput: "Invalid input",
  requiredField: "This field is required",
};

// Validation for Get SubCategory
export const getSubCategory = [isValidMongoId("_id"), validate];

// Validation for Create SubCategory
export const create = [
  isValidString("name"),
  isValidString("description").optional(), // Optional description validation
  isValidMongoId("categoryId").withMessage(
    "Category ID must be a valid MongoDB ID"
  ), // Validation for categoryId
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be either ACTIVE or INACTIVE"),
  body("isStandardQuestionLoaded")
    .optional()
    .isBoolean()
    .withMessage("isStandardQuestionLoaded must be a boolean"),
  validate,
];

// Validation for Update SubCategory
export const update = [
  isValidMongoId("_id"),
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("categoryId")
    .optional()
    .isMongoId()
    .withMessage("Category ID must be a valid MongoDB ID"),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be either ACTIVE or INACTIVE"),
  body("isStandardQuestionLoaded")
    .optional()
    .isBoolean()
    .withMessage("isStandardQuestionLoaded must be a boolean"),
  validate,
];

// Validation for Update SubCategory Status
export const updateStatus = [
  isValidMongoId("_id"),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be either ACTIVE or INACTIVE"),
  validate,
];
