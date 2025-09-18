import * as express from "express";
import { Request, Response } from "express";
import AuthService from "../auth/auth-service";
import { PermissionService } from "./permission-service";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  create,
  update,
  updateStatus,
  getPermission,
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
    const superadminOnly = [authenticate, checkRole("SUPERADMIN")];
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
    this.router.put(
      "/restore/:_id",
      superadminOnly,
      getPermission,
      this.restorePermission
    );
  }

  public createPermission = async (request: Request, response: Response) => {
    try {
      const permission = await this.permissionService.create(request.body);
      const message = "Permission created successfully.";
      return this.httpResWrapper.success(response, message, permission);
    } catch (error: any) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getPermissionById = async (request: Request, response: Response) => {
    try {
      const permission = await this.permissionService.getPermissionById(
        request.params._id
      );
      const message = "Permission retrieved successfully by ID.";
      return this.httpResWrapper.success(response, message, permission);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getPermissions = async (request: Request, response: Response) => {
    try {
      const { isActive, fields } = request.query;

      const permissions = await this.permissionService.getPermissions(
        typeof isActive !== "undefined" ? isActive === "true" : undefined,
        fields as string
      );

      const message = "Permissions retrieved successfully";
      return this.httpResWrapper.success(response, message, permissions);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updatePermission = async (request: Request, response: Response) => {
    try {
      const permission = await this.permissionService.update(
        request.params._id,
        request.body
      );
      const message = "Permission successfully updated.";
      return this.httpResWrapper.success(response, message, permission);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updatePermissionStatus = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { isActive } = request.body;
      const permission = await this.permissionService.updateStatus(
        request.params._id,
        isActive
      );
      const message = "Permission status successfully updated.";
      return this.httpResWrapper.success(response, message, permission);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deletePermission = async (request: Request, response: Response) => {
    try {
      await this.permissionService.delete(request.params._id);
      const message = "Permission successfully deleted.";
      return this.httpResWrapper.success(response, message);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public restorePermission = async (request: Request, response: Response) => {
    try {
      const permission = await this.permissionService.restore(
        request.params._id
      );
      const message = "Permission successfully restored.";
      return this.httpResWrapper.success(response, message, permission);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };
}
