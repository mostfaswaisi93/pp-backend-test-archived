import { body } from "express-validator";
import { Status } from "../../commons/constants/constants";
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
  invalidStatus: `Status must be one of: ${Object.values(Status).join(", ")}`,
};

// Reusable Validators
const validateStringField = (
  field: string,
  message: string,
  required = true
) => {
  let chain = body(field);
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();

  return chain.isString().withMessage(message).trim();
};

const validateNumberField = (
  field: string,
  message: string,
  required = true
) => {
  let chain = body(field);
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();

  return chain.isNumeric().withMessage(message);
};

const validateZipcodeField = (required = true) =>
  validateStringField("zipcode", messages.invalidZipcode, required);

const validateLatitudeField = (required = true) => {
  let chain = body("latitude");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();

  return chain.isNumeric().withMessage(messages.invalidLatitude);
};

const validateLongitudeField = (required = true) => {
  let chain = body("longitude");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();

  return chain.isNumeric().withMessage(messages.invalidLongitude);
};

const validateStatusField = (required = false) => {
  let chain = body("status");
  chain = required
    ? chain.notEmpty().withMessage(messages.requiredField)
    : chain.optional();

  return chain.isIn(Object.values(Status)).withMessage(messages.invalidStatus);
};

// Get Zipcode
export const getZipcode = [isValidMongoId("_id"), validate];

// Create Zipcode
export const create = [
  validateZipcodeField(true),
  validateLatitudeField(true),
  validateLongitudeField(true),
  validateStringField("city", messages.invalidCity, true),
  validateStringField("state", messages.invalidState, true),
  validateStringField("stateCode", messages.invalidStateCode, true),
  validateStringField("county", messages.invalidCounty, true),
  validateStringField("type", messages.invalidType, true),
  validateNumberField(
    "totalHousesCount",
    messages.invalidTotalHousesCount,
    true
  ),
  validateNumberField(
    "medianHouseholdIncome",
    messages.invalidMedianHouseholdIncome,
    true
  ),
  validateNumberField("totalPopulation", messages.invalidTotalPopulation, true),
  validateStatusField(false),
  validate,
];

// Update Zipcode
export const update = [
  isValidMongoId("_id"),
  validateZipcodeField(false),
  validateLatitudeField(false),
  validateLongitudeField(false),
  validateStringField("city", messages.invalidCity, false),
  validateStringField("state", messages.invalidState, false),
  validateStringField("stateCode", messages.invalidStateCode, false),
  validateStringField("county", messages.invalidCounty, false),
  validateStringField("type", messages.invalidType, false),
  validateNumberField(
    "totalHousesCount",
    messages.invalidTotalHousesCount,
    false
  ),
  validateNumberField(
    "medianHouseholdIncome",
    messages.invalidMedianHouseholdIncome,
    false
  ),
  validateNumberField(
    "totalPopulation",
    messages.invalidTotalPopulation,
    false
  ),
  validateStatusField(false),
  validate,
];

// Update Status Only
export const updateStatus = [
  isValidMongoId("_id"),
  validateStatusField(true),
  validate,
];
