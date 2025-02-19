import { param } from "express-validator";
import validate from '../../commons/middlewares/validation';

export const getUserRole = [
    param("id").isInt().withMessage("invalid_input"),

    validate,
];