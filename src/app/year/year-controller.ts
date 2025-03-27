import * as express from "express";
import { YearService } from "./year-service";
import AuthService from "../auth/auth-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import { create, update, getYear, updateStatus } from "./year-validation";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";

export default class YearController implements Controller {
  public path = "/years";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private yearService: YearService = YearService.Instance;

  private static _instance: YearController;

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
    this.router.post("/create", superadminOnly, create, this.createYear);
    this.router.get(
      "/getYearById/:_id",
      superadminOnly,
      getYear,
      this.getYearById
    );
    this.router.get("/", this.getYears);
    this.router.put("/update/:_id", superadminOnly, update, this.updateYear);
    this.router.put(
      "/updateYearStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateYearStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getYear,
      this.deleteYear
    );
  }

  public createYear = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const year = await this.yearService.create(request.body);
      const message = "Year created successfully.";
      return this.httpResWrapper.success(response, message, year);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getYearById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const year = await this.yearService.getYearById(req.params._id);
      const message = "Year retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, year);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getYears = async (request: Request, response: Response) => {
    try {
      const years = await this.yearService.getYears();
      const message = "Years retrieved successfully";
      return this.httpResWrapper.success(response, message, years);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateYear = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedYear = await this.yearService.update(
        request.params._id,
        request.body
      );
      const message = "Year successfully updated.";
      return this.httpResWrapper.success(response, message, updatedYear);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateYearStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedYearStatus = await this.yearService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Year status successfully updated.";
      return this.httpResWrapper.success(response, message, updatedYearStatus);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteYear = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.yearService.delete(req.params._id);
      const message = "Year successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
