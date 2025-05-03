import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  requiredField: "This field is required",
  invalidTitle: "Title must be a valid string",
  invalidBody: "Body must be a valid string",
  invalidEmailId: "EmailId must be a valid email address",
  invalidFirebaseId: "FirebaseId must be a valid string",
  invalidWorkOrderNumber: "WorkOrderNumber must be a valid string",
  invalidRole: "Role must be a valid string (e.g., STAFF, ADMIN)",
  invalidType: "Notification type must be a valid string",
  invalidDate: "Date must be a valid string (ISO format)",
  invalidTime: "Time must be a valid string (ISO format)",
  invalidStatus: "Status must be either ACTIVE or INACTIVE",
};

// Validation for Get Notification by ID
export const getNotification = [isValidMongoId("_id"), validate];

// Validation for Create Notification
export const create = [
  body("title")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidTitle),

  body("body")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidBody),

  body("emailId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isEmail()
    .withMessage(messages.invalidEmailId),

  body("firebaseId")
    .optional()
    .isString()
    .withMessage(messages.invalidFirebaseId),

  body("workOrderNumber")
    .optional()
    .isString()
    .withMessage(messages.invalidWorkOrderNumber),

  body("role").optional().isString().withMessage(messages.invalidRole),

  body("type").optional().isString().withMessage(messages.invalidType),

  body("date").optional().isISO8601().withMessage(messages.invalidDate),

  body("time").optional().isISO8601().withMessage(messages.invalidTime),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage(messages.invalidStatus),

  body("isDeleted")
    .optional()
    .isBoolean()
    .withMessage("isDeleted must be a boolean value"),

  validate,
];

// Validation for Update Notification
export const update = [
  isValidMongoId("_id"),
  body("title").optional().isString().withMessage(messages.invalidTitle),

  body("body").optional().isString().withMessage(messages.invalidBody),

  body("emailId").optional().isEmail().withMessage(messages.invalidEmailId),

  body("firebaseId")
    .optional()
    .isString()
    .withMessage(messages.invalidFirebaseId),

  body("workOrderNumber")
    .optional()
    .isString()
    .withMessage(messages.invalidWorkOrderNumber),

  body("role").optional().isString().withMessage(messages.invalidRole),

  body("type").optional().isString().withMessage(messages.invalidType),

  body("date").optional().isISO8601().withMessage(messages.invalidDate),

  body("time").optional().isISO8601().withMessage(messages.invalidTime),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage(messages.invalidStatus),

  body("isDeleted")
    .optional()
    .isBoolean()
    .withMessage("isDeleted must be a boolean value"),

  validate,
];

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
