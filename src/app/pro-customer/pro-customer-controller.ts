import * as express from "express";
import Controller from "../../interfaces/controller.interface";

export default class ProCustomerController implements Controller {
  public path = "/ProCustomer";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", this.getProCustomer);
    // this.router.post("/", this.createProCustomer);
  }
}
