import { param } from "express-validator";
import validate from '../../commons/middlewares/validatation';

export const getUserRole = [
    param("id").isInt().withMessage("invalid_input"),

    validate,
];