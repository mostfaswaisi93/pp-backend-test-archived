import { body, param } from "express-validator";
import validate from '../../commons/middlewares/validation';

export const getUser = [
  param("userId").isInt().withMessage("invalid_input"),

  validate,
];

export const create = [
  body("nameAr").isString().withMessage("invalid_input"),
  body("nameEn").isString().optional().withMessage("invalid_input"),
  body("phone").isInt()
    .isLength({ min: 8, max: 15 })
    .withMessage("invalid_input"),
  body("email")
    .isEmail()
    .customSanitizer((val) => {
      if (typeof val == "string") return val.toLowerCase();
      return val;
    })
    .withMessage("Invalid email"),
  body("title").isString().withMessage("invalid_input"),
  body("agency").isInt().withMessage("invalid_input"),
  body("password")
    .isLength({ min: 6, max: 14 })
    .withMessage(
      "Password must contain numbers, symbols and uppercase and lowercase letters and not be less than 6 digits"
    ),
  body("userType").isInt().withMessage("invalid_input"),
  body("active").isInt().withMessage("invalid_input"),

  validate,
];

export const update = [
  param("userId").isInt().withMessage("invalid_input"),
  body("nameAr").isString().withMessage("invalid_input"),
  body("nameEn").isString().optional().withMessage("invalid_input"),
  body("phone").isInt()
    .isLength({ min: 8, max: 15 })
    .withMessage("invalid_input"),
  body("email")
    .isEmail()
    .customSanitizer((val) => {
      if (typeof val == "string") return val.toLowerCase();
      return val;
    })
    .withMessage("Invalid email"),
  body("title").isString().withMessage("invalid_input"),
  body("agency").isInt().withMessage("invalid_input"),
  body("userType").isInt().withMessage("invalid_input"),
  body("active").isInt().withMessage("invalid_input"),

  validate,
];

export const updateActive = [
  param("userId").isInt().withMessage("invalid_input"),
  body("active").isInt().withMessage("invalid_input"),

  validate,
];

export const resetPassword = [
  body("old_password")
    .isLength({ min: 6, max: 14 })
    .withMessage(
      "complex_password_required"
    ),
  body("new_password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "complex_password_required"
    ),

  validate,
];