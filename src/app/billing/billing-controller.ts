import * as express from "express";
import AuthService from "../auth/auth-service";
import { BillingService } from "./billing-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import { create, update, getBilling, updateStatus } from "./billing-validation";

export default class BillingController implements Controller {
  public path = "/billings";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private billingService: BillingService = BillingService.Instance;

  private static _instance: BillingController;

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
      checkRole.bind(AuthService.Instance, "superadmin"),
    ];
    this.router.post("/create", superadminOnly, create, this.createBilling);
    this.router.get(
      "/getBillingById/:_id",
      superadminOnly,
      getBilling,
      this.getBillingById
    );
    this.router.get("/", this.getBillings);
    this.router.put("/update/:_id", superadminOnly, update, this.updateBilling);
    this.router.put(
      "/updateBillingStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateBillingStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getBilling,
      this.deleteBilling
    );
  }

  public createBilling = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const billing = await this.billingService.create(request.body);
      const message = "Billing created successfully.";
      return this.httpResWrapper.success(response, message, billing);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getBillingById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const billing = await this.billingService.getBillingById(req.params._id);
      const message = "Billing retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, billing);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getBillings = async (request: Request, response: Response) => {
    try {
      const billings = await this.billingService.getBillings();
      const message = "Billings retrieved successfully";
      return this.httpResWrapper.success(response, message, billings);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateBilling = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedBilling = await this.billingService.update(
        request.params._id,
        request.body
      );
      const message = "Billing successfully updated.";
      return this.httpResWrapper.success(response, message, updatedBilling);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateBillingStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedBillingStatus = await this.billingService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Billing status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedBillingStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteBilling = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.billingService.delete(req.params._id);
      const message = "Billing successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
