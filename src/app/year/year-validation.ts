import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  invalidInput: "Invalid input",
  requiredField: "This field is required",
};

// Validation for Get Year
export const getYear = [isValidMongoId("_id"), validate];

// Validation for Create Year
export const create = [
  body("year")
    .notEmpty()
    .withMessage("Year is required")
    .isInt()
    .withMessage("Year must be a number")
    .isLength({ min: 4, max: 4 })
    .withMessage("Year must be exactly 4 digits"),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be either ACTIVE or INACTIVE"),
  validate,
];

// Validation for Update Year
export const update = [
  isValidMongoId("_id"),
  body("year")
    .notEmpty()
    .withMessage("Year is required")
    .isInt()
    .withMessage("Year must be a number")
    .isLength({ min: 4, max: 4 })
    .withMessage("Year must be exactly 4 digits"),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be either ACTIVE or INACTIVE"),
  validate,
];

// Validation for Update Status Only
export const updateStatus = [
  isValidMongoId("_id"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be either ACTIVE or INACTIVE"),
  validate,
];
