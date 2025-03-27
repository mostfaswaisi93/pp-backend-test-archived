import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  requiredField: "This field is required",
  invalidCountryCode:
    "Country code must be a valid string of 2-3 uppercase letters",
  invalidStateCode:
    "State code must be a valid string of 2-3 uppercase letters",
  invalidStateName:
    "State name must be a valid string between 2 and 50 characters",
  invalidStatus: "Status must be either ACTIVE or INACTIVE",
};

// Validation for Get State by ID
export const getState = [isValidMongoId("_id"), validate];

// Validation for Create State
export const create = [
  body("countryCode")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .isLength({ min: 2, max: 3 })
    .withMessage(messages.invalidCountryCode)
    .matches(/^[A-Z]{2,3}$/)
    .withMessage(messages.invalidCountryCode),

  body("stateCode")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .isLength({ min: 2, max: 3 })
    .withMessage(messages.invalidStateCode)
    .matches(/^[A-Z]{2,3}$/)
    .withMessage(messages.invalidStateCode),

  body("stateName")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage(messages.invalidStateName),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage(messages.invalidStatus),

  validate,
];

// Validation for Update State
export const update = [isValidMongoId("_id"), ...create.slice(0, -1), validate];

// Validation for Update Status Only
export const updateStatus = [
  isValidMongoId("_id"),
  body("status")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage(messages.invalidStatus),
  validate,
];
