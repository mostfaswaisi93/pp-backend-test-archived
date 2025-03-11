import * as express from "express";
import Controller from "../../interfaces/controller.interface";

export default class PriceBookController implements Controller {
  public path = "/pricebook";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", this.getPriceBook);
    // this.router.post("/", this.createPriceBook);
  }
}
