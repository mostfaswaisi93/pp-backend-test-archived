import * as express from "express";
import Controller from "../../interfaces/controller.interface";

export default class PayrollReportController implements Controller {
  public path = "/payroll-reports";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", this.getPayrollReport);
    // this.router.post("/", this.createPayrollReport);
  }
}
