import * as express from "express";
import Controller from "../../interfaces/controller.interface";

export default class EstimateController implements Controller {
  public path = "/estimate";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", this.getEstimate);
    // this.router.post("/", this.createEstimate);
  }
}
