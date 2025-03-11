import * as express from "express";
import Controller from "../../interfaces/controller.interface";

export default class TransactionController implements Controller {
  public path = "/Transaction";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", this.getTransaction);
    // this.router.post("/", this.createTransaction);
  }
}
