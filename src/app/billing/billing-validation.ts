import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  requiredField: "This field is required",
  invalidDate: "Must be a valid date",
  invalidBoolean: "Must be a boolean value",
  invalidNumber: "Must be a valid number",
  invalidStatus: "Status must be either DRAFT, ACTIVE, or CLOSED",
};

export const getBilling = [isValidMongoId("_id"), validate];

export const create = [
  body("promoCode").notEmpty().withMessage(messages.requiredField).isString(),
  body("promoName").notEmpty().withMessage(messages.requiredField).isString(),
  body("startDate")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isISO8601()
    .withMessage(messages.invalidDate),
  body("endDate")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isISO8601()
    .withMessage(messages.invalidDate),
  body("recurring").optional().isBoolean().withMessage(messages.invalidBoolean),
  body("promoFees").optional().isNumeric().withMessage(messages.invalidNumber),
  body("promoPercentageValue")
    .optional()
    .isNumeric()
    .withMessage(messages.invalidNumber),
  body("promoPercentage").optional().isString(),
  body("promoDollarValue")
    .optional()
    .isNumeric()
    .withMessage(messages.invalidNumber),
  body("totalPrice").optional().isNumeric().withMessage(messages.invalidNumber),
  body("totalTickets")
    .optional()
    .isNumeric()
    .withMessage(messages.invalidNumber),
  body("description").optional().isString(),
  body("mode").optional().isString(),
  body("promoImages").optional().isArray(),
  body("qrCodes").optional().isArray(),
  body("promoServiceCost")
    .optional()
    .isNumeric()
    .withMessage(messages.invalidNumber),
  body("notes").optional().isString(),
  body("status")
    .optional()
    .isIn(["DRAFT", "ACTIVE", "CLOSED"])
    .withMessage(messages.invalidStatus),
  body("theme").optional().isString(),
  body("isReadyToShare")
    .optional()
    .isBoolean()
    .withMessage(messages.invalidBoolean),
  body("lastEmailSendOn")
    .optional()
    .isISO8601()
    .withMessage(messages.invalidDate),
  validate,
];

export const update = [isValidMongoId("_id"), ...create.slice(0, -1), validate];

export const updateStatus = [
  isValidMongoId("_id"),
  body("status")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isIn(["DRAFT", "ACTIVE", "CLOSED"])
    .withMessage(messages.invalidStatus),
  validate,
];
