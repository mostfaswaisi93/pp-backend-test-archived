import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  requiredField: "This field is required",
  invalidString: "Must be a valid string",
  invalidNumber: "Must be a valid number",
};

// Validation for Get PurchaseOrder by ID
export const getPurchaseOrder = [isValidMongoId("_id"), validate];

// Validation for Create PurchaseOrder
export const create = [
  body("workOrderNumber")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidString),
  body("workOrderId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidString),
  body("workOrderStatus")
    .optional()
    .isString()
    .withMessage(messages.invalidString),
  body("customerName")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidString),
  body("customerId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidString),
  body("phoneNumber").optional().isString().withMessage(messages.invalidString),
  body("jobTitle").optional().isString().withMessage(messages.invalidString),
  body("location").optional().isString().withMessage(messages.invalidString),
  body("staffId").optional().isString().withMessage(messages.invalidString),
  body("status").optional().isString().withMessage(messages.invalidString),
  body("staffNotes").optional().isString().withMessage(messages.invalidString),
  body("managerNotes")
    .optional()
    .isString()
    .withMessage(messages.invalidString),
  body("purchaseOrderDetails")
    .optional()
    .isArray()
    .withMessage("Must be an array"),
  body("totalCost").optional().isNumeric().withMessage(messages.invalidNumber),
  body("proId").optional().isString().withMessage(messages.invalidString),
  body("userId").optional().isString().withMessage(messages.invalidString),
  body("proEmailId").optional().isString().withMessage(messages.invalidString),
  body("purchaseOrderId")
    .optional()
    .isString()
    .withMessage(messages.invalidString),
  body("description").optional().isString().withMessage(messages.invalidString),
  body("files").optional().isArray().withMessage("Must be an array"),
  body("createdBy").optional().isString().withMessage(messages.invalidString),
  body("updatedBy").optional().isString().withMessage(messages.invalidString),
  validate,
];

// Validation for Update PurchaseOrder
export const update = [isValidMongoId("_id"), ...create.slice(0, -1), validate];

// Validation for Update Status Only
export const updateStatus = [
  isValidMongoId("_id"),
  body("status")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isIn(["OPEN", "CLOSED"])
    .withMessage("Status must be either OPEN or CLOSED"),
  validate,
];
