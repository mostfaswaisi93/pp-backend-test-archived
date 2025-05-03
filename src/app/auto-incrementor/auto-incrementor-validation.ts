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

// Validation for Get Auto Incrementor
export const getAutoIncrementor = [isValidMongoId("_id"), validate];

// Validation for Create Auto Incrementor
export const create = [
  isValidString("name"),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be either ACTIVE or INACTIVE"),
  validate,
];

// Validation for Update Auto Incrementor
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
