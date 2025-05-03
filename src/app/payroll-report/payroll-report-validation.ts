import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  requiredField: "This field is required",
  invalidDate: "Must be a valid date/time",
  invalidStatus: "Status must be STAFF DRAFT, APPROVED, or REJECTED",
  invalidPaymentStatus: "Payment status must be PENDING, PAID, or FAILED",
};

// Validation for Get PayrollReport by ID
export const getPayrollReport = [isValidMongoId("_id"), validate];

// Validation for Create PayrollReport
export const create = [
  body("startTime")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isISO8601()
    .withMessage(messages.invalidDate),

  body("endTime")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isISO8601()
    .withMessage(messages.invalidDate),

  body("payrollReportId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString(),

  body("commissionReportIds")
    .optional()
    .isArray()
    .withMessage("CommissionReportIds must be an array"),

  body("salary").optional().isNumeric().withMessage("Salary must be a number"),
  body("totalGrossSales")
    .optional()
    .isNumeric()
    .withMessage("Total Gross Sales must be a number"),
  body("totalEarnings")
    .optional()
    .isNumeric()
    .withMessage("Total Earnings must be a number"),
  body("totalCommission")
    .optional()
    .isNumeric()
    .withMessage("Total Commission must be a number"),
  body("bonus").optional().isNumeric().withMessage("Bonus must be a number"),
  body("spiffBonus")
    .optional()
    .isNumeric()
    .withMessage("Spiff Bonus must be a number"),
  body("reimbursementAmount")
    .optional()
    .isNumeric()
    .withMessage("Reimbursement Amount must be a number"),

  body("status")
    .optional()
    .isIn(["STAFF DRAFT", "APPROVED", "REJECTED"])
    .withMessage(messages.invalidStatus),

  body("paymentStatus")
    .optional()
    .isIn(["PENDING", "PAID", "FAILED"])
    .withMessage(messages.invalidPaymentStatus),

  body("paidOn").optional().isISO8601().withMessage(messages.invalidDate),
  body("reportPath").optional().isString(),
  body("createdBy").notEmpty().withMessage(messages.requiredField).isString(),

  validate,
];

// Validation for Update PayrollReport
export const update = [isValidMongoId("_id"), ...create.slice(0, -1), validate];

// Validation for Update Status Only
export const updateStatus = [
  isValidMongoId("_id"),
  body("status")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isIn(["STAFF DRAFT", "APPROVED", "REJECTED"])
    .withMessage(messages.invalidStatus),
  validate,
];
