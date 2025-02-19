import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import * as express from "express";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import AuthService from "../auth/auth-service";
import { RoleLkp } from "../../database/entity/RoleLkp";
import { UserRoleService } from "./UserRoleService";
import { getUserRole } from "./UserRoleValidation";

export default class UserRoleController implements Controller {
  public path = "/userRoles";
  public router = express.Router();
  public middleware: any[] = [
    AuthService.Instance.authenticate,
    AuthService.Instance.isAdmin,
  ];

  private httpResWrapper: HttpResWrapper = new HttpResWrapper();
  private userRoleService: UserRoleService = UserRoleService.Instance;

  private static _instance: UserRoleController;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.all);
    this.router.get("/:id", getUserRole, this.findById);
  }

  all = async (request: Request, response: Response, next: NextFunction) => {
    try {
      let result: RoleLkp[] = await this.userRoleService.all();
      return this.httpResWrapper.success(response, result);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  findById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      let id = request.params.id;
      let result: RoleLkp = await this.userRoleService.findById(id);
      return this.httpResWrapper.success(response, result);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };
}
