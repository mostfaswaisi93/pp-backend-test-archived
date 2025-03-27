import * as express from "express";
import AuthService from "../auth/auth-service";
import { PermissionService } from "./permission-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  create,
  update,
  getPermission,
  updateStatus,
} from "./permission-validation";

export default class PermissionController implements Controller {
  public path = "/permissions";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private permissionService: PermissionService = PermissionService.Instance;

  private static _instance: PermissionController;

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
    this.router.post("/create", superadminOnly, create, this.createPermission);
    this.router.get(
      "/getPermissionById/:_id",
      superadminOnly,
      getPermission,
      this.getPermissionById
    );
    this.router.get("/", this.getPermissions);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updatePermission
    );
    this.router.put(
      "/updatePermissionStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updatePermissionStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getPermission,
      this.deletePermission
    );
  }

  public createPermission = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const permission = await this.permissionService.create(request.body);
      const message = "Permission created successfully.";
      return this.httpResWrapper.success(response, message, permission);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getPermissionById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const permission = await this.permissionService.getPermissionById(
        req.params._id
      );
      const message = "Permission retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, permission);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getPermissions = async (request: Request, response: Response) => {
    try {
      const permissions = await this.permissionService.getPermissions();
      const message = "Permissions retrieved successfully";
      return this.httpResWrapper.success(response, message, permissions);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updatePermission = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedPermission = await this.permissionService.update(
        request.params._id,
        request.body
      );
      const message = "Permission successfully updated.";
      return this.httpResWrapper.success(response, message, updatedPermission);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updatePermissionStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedPermissionStatus = await this.permissionService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Permission status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedPermissionStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deletePermission = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.permissionService.delete(req.params._id);
      const message = "Permission successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
