import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";
import { BusinessHourStatus } from "../../models/business-hour/business-hour.interface";

const messages = {
  requiredField: "This field is required",
  invalidDay: "Day must be a valid string between 3 and 20 characters",
  invalidFromTime: "FromTime must be a valid date/time (ISO8601 format)",
  invalidToTime: "ToTime must be a valid date/time (ISO8601 format)",
  invalidStatus: `Status must be one of: ${Object.values(BusinessHourStatus).join(", ")}`,
};

// Reusable validators
const validateDayField = (required = true) => {
  let chain = body("day");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain
    .isString()
    .withMessage(messages.invalidDay)
    .isLength({ min: 3, max: 20 })
    .withMessage(messages.invalidDay)
    .trim();
};

const validateFromTimeField = (required = true) => {
  let chain = body("fromTime");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain.isISO8601().withMessage(messages.invalidFromTime);
};

const validateToTimeField = (required = true) => {
  let chain = body("toTime");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain.isISO8601().withMessage(messages.invalidToTime);
};

const validateStatusField = (required = false) => {
  let chain = body("status");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();
  return chain
    .isIn(Object.values(BusinessHourStatus))
    .withMessage(messages.invalidStatus);
};

// Get BusinessHour
export const getBusinessHour = [isValidMongoId("_id"), validate];

// Create BusinessHour
export const create = [
  validateDayField(true),
  validateFromTimeField(true),
  validateToTimeField(true),
  validateStatusField(),
  validate,
];

// Update BusinessHour
export const update = [
  isValidMongoId("_id"),
  validateDayField(false),
  validateFromTimeField(false),
  validateToTimeField(false),
  validateStatusField(),
  validate,
];

// Update Status Only
export const updateStatus = [
  isValidMongoId("_id"),
  validateStatusField(true),
  validate,
];
