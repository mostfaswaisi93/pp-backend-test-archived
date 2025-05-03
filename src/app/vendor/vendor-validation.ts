import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  requiredField: "This field is required",
  invalidStatus: "Status must be either ACTIVE or INACTIVE",
  invalidEmail: "Invalid email format",
  invalidBoolean: "Must be a boolean value",
  invalidString: "Must be a valid string",
};

// Validation for Get Vendor by ID
export const getVendor = [isValidMongoId("_id"), validate];

// Validation for Create Vendor
export const create = [
  body("vendorName")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidString),
  body("vendorId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidString),
  body("eligible1099")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isBoolean()
    .withMessage(messages.invalidBoolean),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage(messages.invalidStatus),
  body("representativeEmail")
    .optional()
    .isEmail()
    .withMessage(messages.invalidEmail)
    .normalizeEmail(),
  body("phoneNumber").optional().isString().withMessage(messages.invalidString),
  body("state").optional().isString().withMessage(messages.invalidString),
  body("city").optional().isString().withMessage(messages.invalidString),
  body("zipcode").optional().isString().withMessage(messages.invalidString),
  body("createdBy").optional().isString().withMessage(messages.invalidString),
  validate,
];

// Validation for Update Vendor
export const update = [isValidMongoId("_id"), ...create.slice(1, -1), validate];

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
