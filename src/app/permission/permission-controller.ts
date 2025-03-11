import * as express from "express";
import Controller from "../../interfaces/controller.interface";

export default class PermissionController implements Controller {
  public path = "/permissions";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", this.getPermission);
    // this.router.post("/", this.createPermission);
  }
}
