import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  requiredField: "This field is required",
  invalidLatitude: "Latitude must be a valid number",
  invalidLongitude: "Longitude must be a valid number",
  invalidZipcode: "Zipcode must be a valid string",
  invalidCity: "City must be a valid string",
  invalidState: "State must be a valid string",
  invalidStateCode: "State code must be a valid string",
  invalidCounty: "County must be a valid string",
  invalidType: "Type must be a valid string",
  invalidTotalHousesCount: "Total houses count must be a valid number",
  invalidMedianHouseholdIncome:
    "Median household income must be a valid number",
  invalidTotalPopulation: "Total population must be a valid number",
  invalidStatus: "Status must be either ACTIVE or INACTIVE",
};

// Validation for Get Zipcode by ID
export const getZipcode = [isValidMongoId("_id"), validate];

// Validation for Create Zipcode
export const create = [
  body("zipcode")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidZipcode),
  body("latitude")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isNumeric()
    .withMessage(messages.invalidLatitude),
  body("longitude")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isNumeric()
    .withMessage(messages.invalidLongitude),
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
  body("stateCode")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidStateCode),
  body("county")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidCounty),
  body("type")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidType),
  body("totalHousesCount")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isNumeric()
    .withMessage(messages.invalidTotalHousesCount),
  body("medianHouseholdIncome")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isNumeric()
    .withMessage(messages.invalidMedianHouseholdIncome),
  body("totalPopulation")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isNumeric()
    .withMessage(messages.invalidTotalPopulation),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage(messages.invalidStatus),
  validate,
];

// Validation for Update Zipcode
export const update = [isValidMongoId("_id"), ...create.slice(0, -1), validate];

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
