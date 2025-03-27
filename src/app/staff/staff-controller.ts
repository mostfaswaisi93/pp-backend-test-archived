import * as express from "express";
import AuthService from "../auth/auth-service";
import { StaffService } from "./staff-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import { create, update, getStaff, updateStatus } from "./staff-validation";

export default class StaffController implements Controller {
  public path = "/staffs";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private staffService: StaffService = StaffService.Instance;

  private static _instance: StaffController;

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
    this.router.post("/create", superadminOnly, create, this.createStaff);
    this.router.get(
      "/getStaffById/:_id",
      superadminOnly,
      getStaff,
      this.getStaffById
    );
    this.router.get("/", this.getStaffs);
    this.router.put("/update/:_id", superadminOnly, update, this.updateStaff);
    this.router.put(
      "/updateStaffStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateStaffStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getStaff,
      this.deleteStaff
    );
  }

  public createStaff = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const staff = await this.staffService.create(request.body);
      const message = "Staff created successfully.";
      return this.httpResWrapper.success(response, message, staff);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getStaffById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const staff = await this.staffService.getStaffById(req.params._id);
      const message = "Staff retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, staff);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getStaffs = async (request: Request, response: Response) => {
    try {
      const staffs = await this.staffService.getStaffs();
      const message = "Staffs retrieved successfully";
      return this.httpResWrapper.success(response, message, staffs);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateStaff = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedStaff = await this.staffService.update(
        request.params._id,
        request.body
      );
      const message = "Staff successfully updated.";
      return this.httpResWrapper.success(response, message, updatedStaff);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateStaffStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedStaffStatus = await this.staffService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Staff status successfully updated.";
      return this.httpResWrapper.success(response, message, updatedStaffStatus);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteStaff = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.staffService.delete(req.params._id);
      const message = "Staff successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
