import * as express from "express";
import Controller from "../../interfaces/controller.interface";

export default class TruckOrderController implements Controller {
  public path = "/TruckOrder";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", this.getTruckOrder);
    // this.router.post("/", this.createTruckOrder);
  }
}
