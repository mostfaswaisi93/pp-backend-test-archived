import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";
import { body } from "express-validator";
import { validateRequest } from "../../middleware/validation.middleware";

const router = Router();
const authController = new AuthController();

// Route for login
router.post(
  "/login",
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  //   validateRequest, // Validate the request data
  authController.login // Handle login logic in controller
);

// Route for register
router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  //   validateRequest, // Validate the request data
  authController.register // Handle registration logic in controller
);

export const authRoutes = router;
