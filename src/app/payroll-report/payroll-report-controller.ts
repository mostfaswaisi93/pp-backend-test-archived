import * as express from "express";
import AuthService from "../auth/auth-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import { PayrollReportService } from "./payroll-report-service";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  create,
  update,
  getPayrollReport,
  updateStatus,
} from "./payroll-report-validation";

export default class PayrollReportController implements Controller {
  public path = "/payroll-reports";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private payrollReportService: PayrollReportService =
    PayrollReportService.Instance;

  private static _instance: PayrollReportController;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const { authenticate, checkRole } = AuthService.Instance;
    const superadminOnly = [
      authenticate,
      checkRole.bind(AuthService.Instance, "SUPERADMIN"),
    ];
    this.router.post(
      "/create",
      superadminOnly,
      create,
      this.createPayrollReport
    );
    this.router.get(
      "/getPayrollReportById/:_id",
      superadminOnly,
      getPayrollReport,
      this.getPayrollReportById
    );
    this.router.get("/", this.getPayrollReports);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updatePayrollReport
    );
    this.router.put(
      "/updatePayrollReportStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updatePayrollReportStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getPayrollReport,
      this.deletePayrollReport
    );
  }

  public createPayrollReport = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const payrollReport = await this.payrollReportService.create(
        request.body
      );
      const message = "Payroll report created successfully.";
      return this.httpResWrapper.success(response, message, payrollReport);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getPayrollReportById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const payrollReport =
        await this.payrollReportService.getPayrollReportById(req.params._id);
      const message = "Payroll report retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, payrollReport);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getPayrollReports = async (request: Request, response: Response) => {
    try {
      const payrollReports =
        await this.payrollReportService.getPayrollReports();
      const message = "Payroll reports retrieved successfully";
      return this.httpResWrapper.success(response, message, payrollReports);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updatePayrollReport = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedPayrollReport = await this.payrollReportService.update(
        request.params._id,
        request.body
      );
      const message = "Payroll report successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedPayrollReport
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updatePayrollReportStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedPayrollReportStatus =
        await this.payrollReportService.updateStatus(
          request.params._id,
          request.body
        );
      const message = "Payroll report status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedPayrollReportStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deletePayrollReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.payrollReportService.delete(req.params._id);
      const message = "Payroll report successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
