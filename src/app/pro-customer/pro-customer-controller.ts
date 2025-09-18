import * as express from "express";
import AuthService from "../auth/auth-service";
import { NextFunction, Request, Response } from "express";
import { ProCustomerService } from "./pro-customer-service";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  create,
  update,
  getProCustomer,
  updateStatus,
} from "./pro-customer-validation";

export default class ProCustomerController implements Controller {
  public path = "/pro-customers";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private proCustomerService: ProCustomerService = ProCustomerService.Instance;

  private static _instance: ProCustomerController;

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
    this.router.post("/create", superadminOnly, create, this.createProCustomer);
    this.router.get(
      "/getProCustomerById/:_id",
      superadminOnly,
      getProCustomer,
      this.getProCustomerById
    );
    this.router.get("/", this.getProCustomers);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updateProCustomer
    );
    this.router.put(
      "/updateProCustomerStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateProCustomerStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getProCustomer,
      this.deleteProCustomer
    );
  }

  public createProCustomer = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const proCustomer = await this.proCustomerService.create(request.body);
      const message = "Pro customer created successfully.";
      return this.httpResWrapper.success(response, message, proCustomer);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getProCustomerById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const proCustomer = await this.proCustomerService.getProCustomerById(
        req.params._id
      );
      const message = "Pro customer retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, proCustomer);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getProCustomers = async (request: Request, response: Response) => {
    try {
      const proCustomers = await this.proCustomerService.getProCustomers();
      const message = "Pro customers retrieved successfully";
      return this.httpResWrapper.success(response, message, proCustomers);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateProCustomer = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedProCustomer = await this.proCustomerService.update(
        request.params._id,
        request.body
      );
      const message = "Pro customer successfully updated.";
      return this.httpResWrapper.success(response, message, updatedProCustomer);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateProCustomerStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedProCustomerStatus =
        await this.proCustomerService.updateStatus(
          request.params._id,
          request.body
        );
      const message = "Pro customer status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedProCustomerStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteProCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.proCustomerService.delete(req.params._id);
      const message = "Pro customer successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
