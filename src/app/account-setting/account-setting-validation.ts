import { body, param } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  requiredField: "This field is required",
  invalidDay: "Day must be a valid string representing a day of the week",
  invalidFromTime: "FromTime must be a valid date/time",
  invalidToTime: "ToTime must be a valid date/time",
  invalidStatus: "Status must be either OPEN or CLOSED",
  invalidMongoId: "Invalid MongoID",
};

// Validation for Get Account Setting by ID
export const getAccountSetting = [isValidMongoId("_id"), validate];

// Validation for Create Account Setting
export const create = [
  body("day")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidDay),

  body("fromTime")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isISO8601()
    .withMessage(messages.invalidFromTime),

  body("toTime")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isISO8601()
    .withMessage(messages.invalidToTime),

  body("status")
    .optional()
    .isIn(["OPEN", "CLOSED"])
    .withMessage(messages.invalidStatus),

  validate,
];

// Validation for Update Account Setting
export const update = [isValidMongoId("_id"), ...create.slice(0, -1), validate];

// Validation for Update Status Only
export const updateStatus = [
  isValidMongoId("_id"),
  body("status")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isIn(["OPEN", "CLOSED"])
    .withMessage(messages.invalidStatus),
  validate,
];

export const getAccountSettingsByLoginId = [
  param("loginId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .custom(isValidMongoId)
    .withMessage(messages.invalidMongoId),
  validate,
];

export const getAccountSettingsSubCategories = [
  param("loginId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .custom(isValidMongoId)
    .withMessage(messages.invalidMongoId),

  param("mainCategory")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage("mainCategory must be a valid string"),

  validate,
];

// Validation for Delete Staff Roles
export const deleteStaffRolesValidation = [
  param("staffId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .custom(isValidMongoId)
    .withMessage("Invalid staffId"),
  validate,
];

// Validation for Delete Price Book SubCategory
export const deletePriceBookSubCatValidation = [
  param("subCategoryId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .custom(isValidMongoId)
    .withMessage("Invalid subCategoryId"),
  validate,
];

export const deleteEquipmentStatusValidation = [
  param("loginId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .custom(isValidMongoId)
    .withMessage("Invalid loginId"),

  param("equipmentStatusId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .custom(isValidMongoId)
    .withMessage("Invalid equipmentStatusId"),

  validate,
];

export const deleteEquipmentItemTypeValidation = [
  param("loginId")
    .notEmpty()
    .withMessage("loginId is required")
    .custom(isValidMongoId)
    .withMessage("Invalid loginId"),

  param("itemTypeId")
    .notEmpty()
    .withMessage("itemTypeId is required")
    .custom(isValidMongoId)
    .withMessage("Invalid itemTypeId"),

  validate,
];

export const deletePreWorkInspectionFormValidation = [
  param("loginId")
    .notEmpty()
    .withMessage("loginId is required")
    .custom(isValidMongoId)
    .withMessage("Invalid loginId"),

  param("formId")
    .notEmpty()
    .withMessage("formId is required")
    .custom(isValidMongoId)
    .withMessage("Invalid formId"),

  validate,
];

export const insertInventorySubSubCatValidation = [
  body("loginId")
    .notEmpty()
    .withMessage("loginId is required")
    .custom(isValidMongoId)
    .withMessage("Invalid loginId"),

  body("mainCategory")
    .notEmpty()
    .withMessage("mainCategory is required")
    .isString()
    .withMessage("mainCategory must be a string"),

  body("subCategoryId")
    .notEmpty()
    .withMessage("subCategoryId is required")
    .custom(isValidMongoId)
    .withMessage("Invalid subCategoryId"),

  body("newSubSubCategory.name")
    .notEmpty()
    .withMessage("Sub-sub-category name is required")
    .isString()
    .withMessage("Sub-sub-category name must be a string"),

  validate,
];

export const deleteInventorySubSubCatValidation = [
  body("loginId").notEmpty().withMessage("loginId is required"),
  body("mainCategory").notEmpty().withMessage("mainCategory is required"),
  body("subCategoryId").notEmpty().withMessage("subCategoryId is required"),
  body("subSubCategoryId")
    .notEmpty()
    .withMessage("subSubCategoryId is required"),
];

export const deleteInventoryValidation = [
  body("loginId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .custom(isValidMongoId)
    .withMessage(messages.invalidMongoId),

  body("inventoryId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .custom(isValidMongoId)
    .withMessage(messages.invalidMongoId),

  validate,
];

export const getPriceBookSubcategoryByCategoryValidation = [
  param("loginId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .custom(isValidMongoId)
    .withMessage(messages.invalidMongoId),

  param("categoryId")
    .notEmpty()
    .withMessage("categoryId is required")
    .custom(isValidMongoId)
    .withMessage("Invalid categoryId"),

  validate,
];

export const getPriceBookCategoriesFromAccValidation = [
  param("loginId")
    .notEmpty()
    .withMessage("loginId is required")
    .custom(isValidMongoId)
    .withMessage("Invalid loginId"),
  validate,
];

export const updateaccountSettingsRolePermissionsValidation = [
  param("loginId")
    .notEmpty()
    .withMessage("loginId is required")
    .custom(isValidMongoId)
    .withMessage("Invalid loginId"),

  body("roleCode")
    .notEmpty()
    .withMessage("roleCode is required")
    .isString()
    .withMessage("roleCode must be a string"),

  body("permissions")
    .isArray({ min: 1 })
    .withMessage("permissions must be a non-empty array"),

  body("permissions.*")
    .isString()
    .withMessage("Each permission must be a string"),

  validate,
];

export const deleteVendorsValidation = [
  param("loginId")
    .notEmpty()
    .withMessage("loginId is required")
    .custom(isValidMongoId)
    .withMessage("Invalid loginId"),

  param("vendorCategory")
    .notEmpty()
    .withMessage("vendorCategory is required")
    .isString()
    .withMessage("vendorCategory must be a string"),

  validate,
];

export const deleteSaleseMarketingValidation = [
  param("loginId")
    .notEmpty()
    .withMessage("loginId is required")
    .custom(isValidMongoId)
    .withMessage("Invalid loginId"),

  param("sourceType")
    .notEmpty()
    .withMessage("sourceType is required")
    .isString()
    .withMessage("sourceType must be a string"),

  validate,
];

export const deleteEquipmentStatusByIdValidation = [
  param("loginId")
    .notEmpty()
    .withMessage("loginId is required")
    .custom(isValidMongoId)
    .withMessage("Invalid loginId"),

  param("equipmentStatusId")
    .notEmpty()
    .withMessage("equipmentStatusId is required")
    .custom(isValidMongoId)
    .withMessage("Invalid equipmentStatusId"),

  validate,
];
