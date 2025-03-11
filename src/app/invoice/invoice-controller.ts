import * as express from "express";
import Controller from "../../interfaces/controller.interface";

export default class InvoiceController implements Controller {
  public path = "/invoice";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", this.getInvoice);
    // this.router.post("/", this.createInvoice);
  }
}
