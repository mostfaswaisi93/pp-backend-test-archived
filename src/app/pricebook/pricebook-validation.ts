import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  requiredField: "This field is required",
  invalidServiceId: "Service ID must be a valid string",
  invalidCategory: "Category must be a valid string",
  invalidSubCategory: "SubCategory must be a valid string",
  invalidServiceTitle: "Service title must be a valid string",
  invalidCost: "Cost must be a valid number",
  invalidStatus: "Status must be either ACTIVE or INACTIVE",
  invalidDate: "Invalid date format",
};

// Validation for Get Pricebook by ID
export const getPricebook = [isValidMongoId("_id"), validate];

// Validation for Create Pricebook
export const create = [
  body("serviceId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidServiceId),

  body("category")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidCategory),

  body("subCategory")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidSubCategory),

  body("serviceTitle")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidServiceTitle),

  body("leadCost").optional().isNumeric().withMessage(messages.invalidCost),

  body("truckOrderCost")
    .optional()
    .isNumeric()
    .withMessage(messages.invalidCost),

  body("laborRate").optional().isNumeric().withMessage(messages.invalidCost),

  body("numberHours").optional().isNumeric().withMessage(messages.invalidCost),

  body("subTotal").optional().isNumeric().withMessage(messages.invalidCost),

  body("laborCost").optional().isNumeric().withMessage(messages.invalidCost),

  body("totalCost").optional().isNumeric().withMessage(messages.invalidCost),

  body("standard").optional().isNumeric().withMessage(messages.invalidCost),

  body("value").optional().isNumeric().withMessage(messages.invalidCost),

  body("member").optional().isNumeric().withMessage(messages.invalidCost),

  body("standardPercent")
    .optional()
    .isNumeric()
    .withMessage(messages.invalidCost),

  body("valuePercent").optional().isNumeric().withMessage(messages.invalidCost),

  body("memberPercent")
    .optional()
    .isNumeric()
    .withMessage(messages.invalidCost),

  body("totalMaterialCost")
    .optional()
    .isNumeric()
    .withMessage(messages.invalidCost),

  body("serviceStatus")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage(messages.invalidStatus),

  validate,
];

// Validation for Update Pricebook
export const update = [
  isValidMongoId("_id"),
  body("serviceId")
    .optional()
    .isString()
    .withMessage(messages.invalidServiceId),

  body("category").optional().isString().withMessage(messages.invalidCategory),

  body("subCategory")
    .optional()
    .isString()
    .withMessage(messages.invalidSubCategory),

  body("serviceTitle")
    .optional()
    .isString()
    .withMessage(messages.invalidServiceTitle),

  body("leadCost").optional().isNumeric().withMessage(messages.invalidCost),

  body("truckOrderCost")
    .optional()
    .isNumeric()
    .withMessage(messages.invalidCost),

  body("laborRate").optional().isNumeric().withMessage(messages.invalidCost),

  body("numberHours").optional().isNumeric().withMessage(messages.invalidCost),

  body("subTotal").optional().isNumeric().withMessage(messages.invalidCost),

  body("laborCost").optional().isNumeric().withMessage(messages.invalidCost),

  body("totalCost").optional().isNumeric().withMessage(messages.invalidCost),

  body("standard").optional().isNumeric().withMessage(messages.invalidCost),

  body("value").optional().isNumeric().withMessage(messages.invalidCost),

  body("member").optional().isNumeric().withMessage(messages.invalidCost),

  body("standardPercent")
    .optional()
    .isNumeric()
    .withMessage(messages.invalidCost),

  body("valuePercent").optional().isNumeric().withMessage(messages.invalidCost),

  body("memberPercent")
    .optional()
    .isNumeric()
    .withMessage(messages.invalidCost),

  body("totalMaterialCost")
    .optional()
    .isNumeric()
    .withMessage(messages.invalidCost),

  body("serviceStatus")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage(messages.invalidStatus),

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
