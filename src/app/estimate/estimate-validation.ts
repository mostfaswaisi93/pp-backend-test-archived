import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  requiredField: "This field is required",
  invalidDay: "Day must be a valid string representing a day of the week",
  invalidFromTime: "FromTime must be a valid date/time",
  invalidToTime: "ToTime must be a valid date/time",
  invalidStatus: "Status must be either OPEN or CLOSED",
};

// Validation for Get Estimate by ID
export const getEstimate = [isValidMongoId("_id"), validate];

// Validation for Create Estimate
export const create = [
  body("day")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidDay),

  body("fromTime")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isISO8601()
    .withMessage(messages.invalidFromTime),

  body("toTime")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isISO8601()
    .withMessage(messages.invalidToTime),

  body("status")
    .optional()
    .isIn(["OPEN", "CLOSED"])
    .withMessage(messages.invalidStatus),

  validate,
];

// Validation for Update Estimate
export const update = [isValidMongoId("_id"), ...create.slice(0, -1), validate];

// Validation for Update Status Only
export const updateStatus = [
  isValidMongoId("_id"),
  body("status")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isIn(["OPEN", "CLOSED"])
    .withMessage(messages.invalidStatus),
  validate,
];
