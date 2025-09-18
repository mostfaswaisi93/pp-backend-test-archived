import * as express from "express";
import { Request, Response } from "express";
import AuthService from "../auth/auth-service";
import { BusinessHourService } from "./business-hour-service";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  create,
  update,
  updateStatus,
  getBusinessHour,
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
    const superadminOnly = [authenticate, checkRole("SUPERADMIN")];
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

  public createBusinessHour = async (request: Request, response: Response) => {
    try {
      const businessHour = await this.businessHourService.create(request.body);
      const message = "Business hour created successfully.";
      return this.httpResWrapper.success(response, message, businessHour);
    } catch (error: any) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getBusinessHourById = async (request: Request, response: Response) => {
    try {
      const businessHour = await this.businessHourService.getBusinessHourById(
        request.params._id
      );
      const message = "Business hour retrieved successfully by ID.";
      return this.httpResWrapper.success(response, message, businessHour);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getBusinessHours = async (request: Request, response: Response) => {
    try {
      const { status, fields } = request.query;

      const businessHours = await this.businessHourService.getBusinessHours(
        status as string,
        fields as string
      );

      const message = "Business hours retrieved successfully.";
      return this.httpResWrapper.success(response, message, businessHours);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateBusinessHour = async (request: Request, response: Response) => {
    try {
      const businessHour = await this.businessHourService.update(
        request.params._id,
        request.body
      );
      const message = "Business hour successfully updated.";
      return this.httpResWrapper.success(response, message, businessHour);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateBusinessHourStatus = async (
    request: Request,
    response: Response
  ) => {
    try {
      const businessHour = await this.businessHourService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Business hour status successfully updated.";
      return this.httpResWrapper.success(response, message, businessHour);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteBusinessHour = async (request: Request, response: Response) => {
    try {
      await this.businessHourService.delete(request.params._id);
      const message = "Business hour successfully deleted.";
      return this.httpResWrapper.success(response, message);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };
}
