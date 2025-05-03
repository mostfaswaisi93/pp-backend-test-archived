import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  requiredField: "This field is required",
  invalidStatus: "Status must be either ACTIVE, CLOSED, or PENDING", // Adjusted to reflect new status options
  invalidEmail: "Email must be a valid email address",
  invalidPhone: "Phone must be a valid phone number",
  invalidZipcode: "Zipcode must be a valid string",
  invalidCity: "City must be a valid string",
  invalidState: "State must be a valid string",
  invalidCounty: "County must be a valid string",
};

// Validation for Get Workorder by ID
export const getWorkorder = [isValidMongoId("_id"), validate];

// Validation for Create Workorder
export const create = [
  body("email")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isEmail()
    .withMessage(messages.invalidEmail),

  body("firstName")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage("First Name must be a valid string"),

  body("lastName")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage("Last Name must be a valid string"),

  body("phone")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isMobilePhone("any") // تحديد أي رقم هاتف بغض النظر عن الدولة
    .withMessage(messages.invalidPhone),
  body("streetAddress")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage("Street Address must be a valid string"),

  body("zipcode")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidZipcode),

  body("city")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidCity),

  body("state")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidState),

  body("county")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidCounty),

  body("status")
    .optional()
    .isIn(["ACTIVE", "CLOSED", "PENDING"]) // Adjusted to match possible status values
    .withMessage(messages.invalidStatus),

  validate,
];

// Validation for Update Workorder
export const update = [
  isValidMongoId("_id"),
  ...create.slice(0, -1), // Reusing the create validation logic for common fields
  validate,
];

// Validation for Update Status Only
export const updateStatus = [
  isValidMongoId("_id"),
  body("status")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isIn(["ACTIVE", "CLOSED", "PENDING"]) // Adjusted to match possible status values
    .withMessage(messages.invalidStatus),
  validate,
];
