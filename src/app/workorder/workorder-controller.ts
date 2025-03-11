import * as express from "express";
import Controller from "../../interfaces/controller.interface";

export default class WorkorderController implements Controller {
  public path = "/workorder";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", this.getWorkorder);
    // this.router.post("/", this.createWorkorder);
  }
}
