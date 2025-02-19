import { body } from "express-validator";
import validate from '../../commons/middlewares/validation';

export const login = [
    body("email")
        .isEmail()
        .customSanitizer((val) => {
            if (typeof val == "string") return val.toLowerCase();
            return val;
        })
        .withMessage("Invalid email"),
    body("password")
        .isLength({ min: 6, max: 14 })
        .withMessage(
            "Password must contain numbers, symbols and uppercase and lowercase letters and not be less than 6 digits"
        )
        .trim(),

    validate,
];

export const forgetPassword = [
    body("email")
        .isEmail()
        .customSanitizer((val) => {
            if (typeof val == "string") return val.toLowerCase();
            return val;
        })
        .withMessage("Invalid email"),

    validate,
];

export const resetPassword = [
    body("verificationToken").isInt().withMessage("invalid_input"),
    body("password")
        .isLength({ min: 6, max: 14 })
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
        )
        .withMessage(
            "complex_password_required"
        ),

    validate,
];