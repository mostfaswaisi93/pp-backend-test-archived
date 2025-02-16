import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validation.middleware";

const router = Router();
const authController = new AuthController();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
    validateRequest, //
  ],
  authController.login
);

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    validateRequest,
  ],
  authController.register
);

export const authRoutes = router;
