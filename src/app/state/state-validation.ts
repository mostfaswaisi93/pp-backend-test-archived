import { body } from "express-validator";
import { Status } from "../../commons/constants/constants";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  requiredField: "This field is required",
  invalidCountryCode:
    "Country code must be a valid string of 2-5 uppercase letters",
  invalidStateCode:
    "State code must be a valid string of 2-10 uppercase letters",
  invalidStateName:
    "State name must be a valid string between 2 and 100 characters",
  invalidStatus: `Status must be one of: ${Object.values(Status).join(", ")}`,
};

// Reusable validators
const validateCountryCodeField = (required = true) => {
  let chain = body("countryCode");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();

  return chain
    .isString()
    .isLength({ min: 2, max: 5 })
    .withMessage(messages.invalidCountryCode)
    .matches(/^[A-Z]{2,5}$/)
    .withMessage(messages.invalidCountryCode)
    .trim()
    .toUpperCase();
};

const validateStateCodeField = (required = true) => {
  let chain = body("stateCode");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();

  return chain
    .isString()
    .isLength({ min: 2, max: 10 })
    .withMessage(messages.invalidStateCode)
    .matches(/^[A-Z]{2,10}$/)
    .withMessage(messages.invalidStateCode)
    .trim()
    .toUpperCase();
};

const validateStateNameField = (required = true) => {
  let chain = body("stateName");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();

  return chain
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage(messages.invalidStateName)
    .trim();
};

const validateStatusField = (required = false) => {
  let chain = body("status");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();

  return chain.isIn(Object.values(Status)).withMessage(messages.invalidStatus);
};

// Get State
export const getState = [isValidMongoId("_id"), validate];

// Create State
export const create = [
  validateCountryCodeField(true),
  validateStateCodeField(true),
  validateStateNameField(true),
  validateStatusField(false),
  validate,
];

// Update State
export const update = [
  isValidMongoId("_id"),
  validateCountryCodeField(false),
  validateStateCodeField(false),
  validateStateNameField(false),
  validateStatusField(false),
  validate,
];

// Update State Status Only
export const updateStatus = [
  isValidMongoId("_id"),
  validateStatusField(true),
  validate,
];
