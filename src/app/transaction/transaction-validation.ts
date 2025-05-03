import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  requiredField: "This field is required",
  invalidTransactionType:
    "Transaction Type must be either PAYMENT, REFUND, or WRITE-OFF",
  invalidDocumentType: "Document Type must be either ESTIMATE or INVOICE",
  invalidAmount: "Amount must be a valid number",
  invalidPaymentType: "Payment Type must be a valid string",
  invalidStatus: "Status must be either FAILED or SUCCESS",
  invalidString: "This field must be a valid string",
  invalidBoolean: "This field must be a boolean",
  invalidDate: "This field must be a valid date/time",
  invalidMongoId: "This field must be a valid MongoDB ID",
};

// Validation for Get Transaction by ID
export const getTransaction = [isValidMongoId("_id"), validate];

// Validation for Create Transaction
export const create = [
  body("customerId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isMongoId()
    .withMessage(messages.invalidMongoId),

  body("proUserId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isMongoId()
    .withMessage(messages.invalidMongoId),

  body("invoiceId").optional().isMongoId().withMessage(messages.invalidMongoId),

  body("invoiceNumber")
    .optional()
    .isString()
    .withMessage(messages.invalidString),

  body("transactionId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidString),

  body("transactionType")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isIn(["PAYMENT", "REFUND", "WRITE-OFF"])
    .withMessage(messages.invalidTransactionType),

  body("documentType")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isIn(["ESTIMATE", "INVOICE"])
    .withMessage(messages.invalidDocumentType),

  body("status")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isIn(["FAILED", "SUCCESS"])
    .withMessage(messages.invalidStatus),

  body("amount")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isNumeric()
    .withMessage(messages.invalidAmount),

  body("creditCardProcessingFee")
    .optional()
    .isNumeric()
    .withMessage(messages.invalidAmount),

  body("creditCardPF")
    .optional()
    .isNumeric()
    .withMessage(messages.invalidAmount),

  body("totalAmount")
    .optional()
    .isNumeric()
    .withMessage(messages.invalidAmount),

  body("paymentType")
    .optional()
    .isString()
    .withMessage(messages.invalidPaymentType),

  body("zelleId").optional().isString().withMessage(messages.invalidString),

  body("venmoId").optional().isString().withMessage(messages.invalidString),

  body("appleId").optional().isString().withMessage(messages.invalidString),

  body("googleId").optional().isString().withMessage(messages.invalidString),

  body("payPalEmail")
    .optional()
    .isEmail()
    .withMessage("PayPal Email must be a valid email"),

  body("companyName").optional().isString().withMessage(messages.invalidString),

  body("checkNumber").optional().isString().withMessage(messages.invalidString),

  body("insuranceName")
    .optional()
    .isString()
    .withMessage(messages.invalidString),

  body("bankName").optional().isString().withMessage(messages.invalidString),

  body("transactionTimestamp")
    .optional()
    .isISO8601()
    .withMessage(messages.invalidDate),

  body("transactionRemarks")
    .optional()
    .isString()
    .withMessage(messages.invalidString),

  body("writeOffReason")
    .optional()
    .isString()
    .withMessage(messages.invalidString),

  body("message").optional().isString().withMessage(messages.invalidString),

  body("source").optional().isString().withMessage(messages.invalidString),

  body("refundRequested")
    .optional()
    .isBoolean()
    .withMessage(messages.invalidBoolean),

  body("isVoided").optional().isBoolean().withMessage(messages.invalidBoolean),

  body("cancellationReason")
    .optional()
    .isString()
    .withMessage(messages.invalidString),

  body("createdBy").optional().isString().withMessage(messages.invalidString),

  body("creatorRole").optional().isString().withMessage(messages.invalidString),

  body("voidedBy").optional().isString().withMessage(messages.invalidString),

  body("voidedAt").optional().isISO8601().withMessage(messages.invalidDate),

  body("details")
    .optional()
    .isObject()
    .withMessage("Details must be an object"),

  body("businessInfo")
    .optional()
    .isObject()
    .withMessage("Business info must be an object"),

  body("isVerified")
    .optional()
    .isBoolean()
    .withMessage(messages.invalidBoolean),

  body("verifiedBy")
    .optional()
    .isMongoId()
    .withMessage(messages.invalidMongoId),

  validate,
];

// Validation for Update Transaction
export const update = [
  isValidMongoId("_id"),
  ...create.slice(0, -1), // Reuse the create validation, excluding the last one
  validate,
];

// Validation for Update Status Only
export const updateStatus = [
  isValidMongoId("_id"),
  body("status")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isIn(["FAILED", "SUCCESS"])
    .withMessage(messages.invalidStatus),
  validate,
];
