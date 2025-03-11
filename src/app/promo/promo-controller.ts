import * as express from "express";
import Controller from "../../interfaces/controller.interface";

export default class PromoController implements Controller {
  public path = "/promo";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", this.getPromo);
    // this.router.post("/", this.createPromo);
  }
}
