import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  requiredField: "This field is required",
  invalidEmail: "Must be a valid email",
  invalidMongoId: "Must be a valid MongoDB ObjectId",
  invalidEnum: "Invalid value provided",
  invalidBoolean: "Must be a boolean value",
  invalidNumber: "Must be a valid number",
};

// Validation for Get ProCustomer by ID
export const getProCustomer = [isValidMongoId("_id"), validate];

// Validation for Create ProCustomer
export const create = [
  body("customerId").notEmpty().withMessage(messages.requiredField),
  body("customerEmailId").isEmail().withMessage(messages.invalidEmail),
  body("proEmailId").optional().isEmail().withMessage(messages.invalidEmail),
  body("proUserId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isMongoId()
    .withMessage(messages.invalidMongoId),
  body("customerUserId")
    .optional()
    .isMongoId()
    .withMessage(messages.invalidMongoId),
  body("customerRef")
    .optional()
    .isMongoId()
    .withMessage(messages.invalidMongoId),
  body("proRef").optional().isMongoId().withMessage(messages.invalidMongoId),
  body("customerType")
    .isIn(["Residential", "Business"])
    .withMessage(messages.invalidEnum),
  body("businessName").optional().isString(),
  body("phoneNumber").optional().isString(),
  body("dispatchTextNumber").optional().isString(),
  body("source").optional().isString(),
  body("vendor").optional().isString(),
  body("paymentMethod").optional().isString(),
  body("creditLimit")
    .optional()
    .isNumeric()
    .withMessage(messages.invalidNumber),
  body("paymentTerms").optional().isString(),
  body("taxExempt").optional().isBoolean().withMessage(messages.invalidBoolean),
  body("poRequired")
    .optional()
    .isBoolean()
    .withMessage(messages.invalidBoolean),
  body("doNotServe")
    .optional()
    .isBoolean()
    .withMessage(messages.invalidBoolean),
  body("doNotServeReason").optional().isString(),
  body("subscribeToReceiveMarketingEmails")
    .optional()
    .isBoolean()
    .withMessage(messages.invalidBoolean),
  body("mediaFiles").optional().isArray(),
  body("status")
    .isIn(["Active", "Inactive", "Do Not Serve"])
    .withMessage(messages.invalidEnum),
  body("createdBy").optional().isString(),
  body("createdByEmail")
    .optional()
    .isEmail()
    .withMessage(messages.invalidEmail),
  body("createdById")
    .optional()
    .isMongoId()
    .withMessage(messages.invalidMongoId),
  body("createdByRole").optional().isString(),
  body("staffAssignedLoginIds").optional().isArray(),
  body("updatedBy").optional().isString(),
  body("updatedByImageUrl").optional().isString(),
  body("updatedByEmail")
    .optional()
    .isEmail()
    .withMessage(messages.invalidEmail),
  body("customerBillingAddress.firstName").optional().isString(),
  body("customerBillingAddress.lastName").optional().isString(),
  body("customerBillingAddress.userType").optional().isString(),
  body("customerBillingAddress.address").optional().isString(),
  body("customerBillingAddress.invoiceEmail")
    .optional()
    .isEmail()
    .withMessage(messages.invalidEmail),
  body("customerBillingAddress.city").optional().isString(),
  body("customerBillingAddress.country").optional().isString(),
  body("customerBillingAddress.state").optional().isString(),
  body("customerBillingAddress.zipCode").optional().isString(),
  body("customerBillingAddress.adminNotes").optional().isString(),
  body("isDeleted").optional().isBoolean().withMessage(messages.invalidBoolean),
  validate,
];

// Validation for Update ProCustomer
export const update = [isValidMongoId("_id"), ...create.slice(1)];

// Validation for Update Status Only
export const updateStatus = [
  isValidMongoId("_id"),
  body("status")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isIn(["Active", "Inactive", "Do Not Serve"])
    .withMessage(messages.invalidEnum),
  validate,
];
