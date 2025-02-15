import { Router } from "express";
import { UserController } from "../../controllers/users/user.controller";
import { body } from "express-validator";
import { validateRequest } from "../../middleware/validation.middleware";

const router = Router();
const userController = new UserController();

// إنشاء مستخدم جديد
router.post(
  "/create",
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validateRequest,
  userController.createUser
);

// الحصول على جميع المستخدمين
router.get("/all", userController.getAllUsers);

// الحصول على مستخدم معين باستخدام id
router.get("/:id", userController.getUserById);

// تعديل بيانات مستخدم
router.put(
  "/:id",
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
    validateRequest,
  userController.updateUser
);

// حذف مستخدم
router.delete("/:id", userController.deleteUser);

export const userRoutes = router;
