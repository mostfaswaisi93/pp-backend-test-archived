import * as express from "express";
import Controller from "../../interfaces/controller.interface";

export default class StaffController implements Controller {
  public path = "/staff";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", this.getStaff);
    // this.router.post("/", this.createStaff);
  }
}
