import { body } from "express-validator";
import validate from "../../commons/middlewares/validation";
import { isValidMongoId } from "../../commons/validators/validators";

const messages = {
  requiredField: "This field is required",
  invalidDay: "Day must be a valid string representing a day of the week",
  invalidFromTime: "FromTime must be a valid date/time",
  invalidToTime: "ToTime must be a valid date/time",
  invalidStatus: "Status must be either OPEN or CLOSED",
  invalidEmail: "Email must be a valid email address",
  invalidMobileNumber: "Mobile number must be a valid string",
  invalidRole: "Role must be a valid string",
  invalidDateOfJoining: "Date of joining must be a valid date",
  invalidPassword: "Password must be a valid string",
  invalidConfirmPassword: "Confirm password must match password",
  invalidGroup: "Group must be a valid string",
  invalidManagerId: "Manager ID must be a valid MongoDB Object ID",
  invalidManagerLoginId: "Manager login ID must be a valid MongoDB Object ID",
  invalidDob: "Date of birth must be a valid date",
  invalidTimeZone: "Time zone must be a valid string",
  invalidAddress: "Address must be a valid string",
  invalidBankDetails: "Bank details must be valid",
};

export const getStaff = [isValidMongoId("_id"), validate];

export const create = [
  body("staffId").notEmpty().withMessage(messages.requiredField),
  body("qrImage").optional().isString().withMessage(messages.requiredField),
  body("timeZone").optional().isString().withMessage(messages.invalidTimeZone),
  body("proId").optional().isString().withMessage(messages.requiredField),
  body("proEmailId").optional().isString().withMessage(messages.invalidEmail),
  body("parentLoginId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.requiredField),
  body("userId").notEmpty().withMessage(messages.requiredField),
  body("firstName").notEmpty().withMessage(messages.requiredField),
  body("lastName").notEmpty().withMessage(messages.requiredField),
  body("mobileNumber")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isMobilePhone("any") // تحديد أي رقم هاتف بغض النظر عن الدولة
    .withMessage(messages.invalidMobileNumber),
  body("userName").notEmpty().withMessage(messages.requiredField),
  body("emailId")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isEmail()
    .withMessage(messages.invalidEmail),
  body("manager").optional().isString().withMessage(messages.requiredField),
  body("managerLoginId")
    .optional()
    .isMongoId()
    .withMessage(messages.invalidManagerLoginId),
  body("managerId")
    .optional()
    .isMongoId()
    .withMessage(messages.invalidManagerId),
  body("city").optional().isString().withMessage(messages.invalidAddress),
  body("state").optional().isString().withMessage(messages.invalidAddress),
  body("zipCode").optional().isString().withMessage(messages.invalidAddress),
  body("role")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidRole),
  body("dateOfJoining")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isISO8601()
    .withMessage(messages.invalidDateOfJoining),
  body("password")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidPassword),
  body("confirmPassword")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidConfirmPassword)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  body("group")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isString()
    .withMessage(messages.invalidGroup),
  body("vanlynkAccess").optional().isBoolean(),
  body("showOnDispatchboard").optional().isBoolean(),
  body("estimatesReqMgApproval").optional().isBoolean(),
  body("invoicesReqMgApproval").optional().isBoolean(),
  body("ssNumber").optional().isString(),
  body("driverLicenseNumber").optional().isString(),
  body("dob").optional().isISO8601().withMessage(messages.invalidDob),
  body("streetAddress")
    .optional()
    .isString()
    .withMessage(messages.invalidAddress),
  body("homePhone").optional().isString(),
  body("w2Elgible").optional().isBoolean(),
  body("i9Verified").optional().isBoolean(),
  body("emergencyName").optional().isString(),
  body("emergencyRelationShip").optional().isString(),
  body("emergencyPhone1").optional().isString(),
  body("emergencyPhone2").optional().isString(),
  body("weeklySalary").optional().isString(),
  body("weeklySalaryValue").optional().isString(),
  body("overTimeAfter8Hrs").optional().isBoolean(),
  body("hourlyRateValue").optional().isString(),
  body("hourlyRate").optional().isString(),
  body("doubleTimeOver12Hrs").optional().isBoolean(),
  body("commisionRate").optional().isNumeric(),
  body("commisionRange").optional().isArray(),
  body("payrollFrequency").optional().isMongoId(),
  body("paymentMethod").optional().isString(),
  body("billRate").optional().isString(),
  body("bankName").optional().isString(),
  body("swiftNumber").optional().isString(),
  body("ibanNumber").optional().isString(),
  body("routingNumber").optional().isString(),
  body("accountNumber").optional().isString(),
  body("skillLevel").optional().isString(),
  body("skills").optional().isArray(),
  body("bio").optional().isString(),
  body("comments").optional().isString(),
  body("rating").optional().isString(),
  body("shirtSize").optional().isString(),
  body("bootSize").optional().isString(),
  body("pantWaistSize").optional().isString(),
  body("pantLengthSize").optional().isString(),
  body("firstMessageHour").optional().isString(),
  body("firstMessage").optional().isString(),
  body("paidBreaks").optional().isBoolean(),
  body("deductHrForLunch").optional().isBoolean(),
  body("deductForEachBreak").optional().isBoolean(),
  body("lunchHourForEachBreak").optional().isNumeric(),
  body("lunchHourForLunch").optional().isNumeric(),
  body("lunchHour").optional().isString(),
  body("sendClockinout").optional().isBoolean(),
  body("sendRemindersIn").optional().isBoolean(),
  body("sendReminders").optional().isBoolean(),
  body("sendRemindersOut").optional().isBoolean(),
  body("bioImage").optional().isString(),
  body("secondMessageHour").optional().isString(),
  body("secondMessage").optional().isString(),
  body("thirdMessageHour").optional().isString(),
  body("thirdMessage").optional().isString(),
  body("fourthMessage").optional().isString(),
  body("autoCheckouts").optional().isBoolean(),
  body("timeCardRequiresForManagerApproval").optional().isBoolean(),
  body("autoClockOutAfterXMins").optional().isNumeric(),
  body("staffTimings").optional().isArray(),
  body("sick").optional().isObject(),
  body("vacation").optional().isObject(),
  body("fileUpload").optional().isArray(),
  body("writeupsUpload").optional().isArray(),
  body("createdBy").optional().isString(),
  body("createdOn").optional().isISO8601(),
  body("modifiedBy").optional().isString(),
  body("modifiedOn").optional().isISO8601(),
  body("staffPopUp").optional().isObject(),
  body("licenseStatus").optional().isString(),
  body("deviceToken").optional().isString(),
  body("clockStatus").optional().isNumeric(),
  body("isOT").optional().isBoolean(),
  body("isAfterHours").optional().isBoolean(),
  body("motionStatus").optional().isString(),
  body("lastDispatchedWO").optional().isString(),
  body("todaysTime").optional().isNumeric(),
  body("remainingTime").optional().isNumeric(),
  body("lastKnowLocation").optional().isObject(),

  validate,
];

export const update = [isValidMongoId("_id"), ...create.slice(0, -1), validate];

export const updateStatus = [
  isValidMongoId("_id"),
  body("status")
    .notEmpty()
    .withMessage(messages.requiredField)
    .isIn(["OPEN", "CLOSED"])
    .withMessage(messages.invalidStatus),
  validate,
];
