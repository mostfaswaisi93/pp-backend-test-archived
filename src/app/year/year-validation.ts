import { body } from "express-validator";
import { Status } from "../../commons/constants/constants";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  invalidInput: "Invalid input",
  requiredField: "This field is required",
};

// Reusable validators
const validateYearField = (required = true) => {
  let chain = body("year");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();

  return chain
    .isInt()
    .withMessage("Year must be a number")
    .isLength({ min: 4, max: 4 })
    .withMessage("Year must be exactly 4 digits")
    .custom((value) => {
      const currentYear = new Date().getFullYear();
      const maxAllowedYear = currentYear + 1;

      if (value < 1900) {
        throw new Error("Year must be 1900 or later");
      }

      if (value > maxAllowedYear) {
        throw new Error(`Year cannot be greater than ${maxAllowedYear}`);
      }

      return true;
    });
};

const validateStatusField = (required = false) => {
  let chain = body("status");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();

  return chain
    .isIn(Object.values(Status))
    .withMessage(`Status must be one of: ${Object.values(Status).join(", ")}`);
};

// Get Year
export const getYear = [isValidMongoId("_id"), validate];

// Create Year
export const create = [
  validateYearField(true),
  validateStatusField(),
  validate,
];

// Update Year
export const update = [
  isValidMongoId("_id"),
  validateYearField(false),
  validateStatusField(),
  validate,
];

// Update Year Status Only
export const updateStatus = [
  isValidMongoId("_id"),
  validateStatusField(true),
  validate,
];
