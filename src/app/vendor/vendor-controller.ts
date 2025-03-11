import * as express from "express";
import Controller from "../../interfaces/controller.interface";

export default class VendorController implements Controller {
  public path = "/vendor";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", this.getVendor);
    // this.router.post("/", this.createVendor);
  }
}
