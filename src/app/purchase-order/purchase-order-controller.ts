import * as express from "express";
import Controller from "../../interfaces/controller.interface";

export default class PurchaseOrderController implements Controller {
  public path = "/PurchaseOrder";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", this.getPurchaseOrder);
    // this.router.post("/", this.createPurchaseOrder);
  }
}
