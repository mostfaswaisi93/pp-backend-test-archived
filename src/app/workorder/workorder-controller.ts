import * as express from "express";
import AuthService from "../auth/auth-service";
import { WorkorderService } from "./workorder-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  create,
  update,
  getWorkorder,
  updateStatus,
} from "./workorder-validation";

export default class WorkorderController implements Controller {
  public path = "/workorders";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private workorderService: WorkorderService = WorkorderService.Instance;

  private static _instance: WorkorderController;

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
    this.router.post("/create", superadminOnly, create, this.createWorkorder);
    this.router.get(
      "/getWorkorderById/:_id",
      superadminOnly,
      getWorkorder,
      this.getWorkorderById
    );
    this.router.get("/", this.getWorkorders);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updateWorkorder
    );
    this.router.put(
      "/updateWorkorderStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateWorkorderStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getWorkorder,
      this.deleteWorkorder
    );
  }

  public createWorkorder = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const workorder = await this.workorderService.create(request.body);
      const message = "Workorder created successfully.";
      return this.httpResWrapper.success(response, message, workorder);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getWorkorderById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const workorder = await this.workorderService.getWorkorderById(
        req.params._id
      );
      const message = "Workorder retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, workorder);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getWorkorders = async (request: Request, response: Response) => {
    try {
      const workorders = await this.workorderService.getWorkorders();
      const message = "Workorders retrieved successfully";
      return this.httpResWrapper.success(response, message, workorders);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateWorkorder = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedWorkorder = await this.workorderService.update(
        request.params._id,
        request.body
      );
      const message = "Workorder successfully updated.";
      return this.httpResWrapper.success(response, message, updatedWorkorder);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateWorkorderStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedWorkorderStatus = await this.workorderService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Workorder status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedWorkorderStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteWorkorder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.workorderService.delete(req.params._id);
      const message = "Workorder successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
