import { Router } from "express";
import ServiceController from "../controllers/service.controller";

const router = Router();

router.get("/", (req, res, next) =>
  ServiceController.getAllServices(req, res, next)
);

export default router;
