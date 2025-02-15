import { Router } from "express";
import { UserController } from "../../controllers/users/user.controller";

const router = Router();
const userController = new UserController();

router.post("/", userController.createUser);

export const userRoutes = router;
