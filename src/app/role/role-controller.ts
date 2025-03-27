import { NextFunction, Request, Response } from "express";
import * as express from "express";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import AuthService from "../auth/auth-service";
import Controller from "../../interfaces/controller.interface";
import { RoleService } from "./role-service";
import { create, getRole, update } from "./role-validation";
import User from "../../models/user/user.model";
import { IUser } from "../../models/user/user.interface";

export default class RoleController implements Controller {
  public path = "/roles";
  public router = express.Router();
  public middleware: any[] = [AuthService.Instance.authenticate];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private roleService: RoleService = RoleService.Instance;

  private static _instance: RoleController;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/create", create, this.createRole);
    this.router.get("/:roleId", getRole, this.getRoleById);
    this.router.put("/:roleId", update, this.updateRole);
    this.router.delete("/:roleId", this.deleteRole);
  }

  createRole = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      // const userId = (request.user as Partial<IUser>)._id;
      // if (!userId) {
      //   return this.httpResWrapper.error(response, new Error("User ID is missing"));
      // }
      // console.log(userId);

      // let role = await this.roleService.create(request.body, userId);
      const role = await this.roleService.create(request.body);
      const message = "Created Role successful";
      return this.httpResWrapper.success(response, message, role);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getRoleById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const role = await this.roleService.getRoleById(req.params.roleId);
      const message = "Get By Role Id successful";
      return this.httpResWrapper.success(res, message, role);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public updateRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const updatedRole = await this.roleService.update(
        req.params.roleId,
        req.body
      );
      const message = "Update Role successful";
      return this.httpResWrapper.success(res, message, updatedRole);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public deleteRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.roleService.delete(req.params.roleId);
      const message = "Role deleted successfully";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
