import * as express from "express";
import Controller from "../../interfaces/controller.interface";

export default class PriceListController implements Controller {
  public path = "/price-list";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", this.getPriceList);
    // this.router.post("/", this.createPriceList);
  }
}
