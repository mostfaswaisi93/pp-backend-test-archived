import * as express from "express";
import AuthService from "../auth/auth-service";
import { NextFunction, Request, Response } from "express";
import { BusinessHourService } from "./business-hour-service";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  create,
  update,
  getBusinessHour,
  updateStatus,
} from "./business-hour-validation";

export default class BusinessHourController implements Controller {
  public path = "/business-hours";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private businessHourService: BusinessHourService =
    BusinessHourService.Instance;

  private static _instance: BusinessHourController;

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
    this.router.post(
      "/create",
      superadminOnly,
      create,
      this.createBusinessHour
    );
    this.router.get(
      "/getBusinessHourById/:_id",
      superadminOnly,
      getBusinessHour,
      this.getBusinessHourById
    );
    this.router.get("/", this.getBusinessHours);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updateBusinessHour
    );
    this.router.put(
      "/updateBusinessHourStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateBusinessHourStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getBusinessHour,
      this.deleteBusinessHour
    );
  }

  public createBusinessHour = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const businessHour = await this.businessHourService.create(request.body);
      const message = "Business hour created successfully.";
      return this.httpResWrapper.success(response, message, businessHour);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getBusinessHourById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const businessHour = await this.businessHourService.getBusinessHourById(
        req.params._id
      );
      const message = "Business hour retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, businessHour);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getBusinessHours = async (request: Request, response: Response) => {
    try {
      const businessHours = await this.businessHourService.getBusinessHours();
      const message = "Business hours retrieved successfully";
      return this.httpResWrapper.success(response, message, businessHours);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateBusinessHour = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedBusinessHour = await this.businessHourService.update(
        request.params._id,
        request.body
      );
      const message = "Business hour successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedBusinessHour
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateBusinessHourStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedBusinessHourStatus =
        await this.businessHourService.updateStatus(
          request.params._id,
          request.body
        );
      const message = "Business hour status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedBusinessHourStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteBusinessHour = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.businessHourService.delete(req.params._id);
      const message = "Business hour successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
