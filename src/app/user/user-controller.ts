import { NextFunction, Request, Response } from "express";
import * as express from "express";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import { UserService } from "./user-service";
import AuthService from "../auth/auth-service";
import Controller from "../../interfaces/controller.interface";
import { create } from "./user-validation";
import User from "../../models/user/user.model";
import { Error as MongooseError } from "mongoose";

export default class UserController implements Controller {
  public path = "/users";
  public router = express.Router();
  public middleware: any[] = [AuthService.Instance.authenticate];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private userService: UserService = UserService.Instance;
  private authService: AuthService = AuthService.Instance;

  private static _instance: UserController;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/",
      create,
      // AuthService.Instance.isAdmin,
      this.createUser
    );
    this.router.get("/", this.getUsers);
    this.router.get("/:id", this.getUserById);
    this.router.put("/:id", AuthService.Instance.isAdmin, this.updateUser);
    this.router.delete("/:id", AuthService.Instance.isAdmin, this.deleteUser);
  }

  private getUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.getAllUsers();
      return this.httpResWrapper.success(res, users);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  private getUserById = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      return this.httpResWrapper.success(res, user);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  private createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const createdUser = await this.userService.create(req.body);
      return this.httpResWrapper.success(res, createdUser);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  private updateUser = async (req: Request, res: Response) => {
    try {
      const updatedUser = await this.userService.update(
        req.params.id,
        req.body
      );
      return this.httpResWrapper.success(res, updatedUser);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  private deleteUser = async (req: Request, res: Response) => {
    try {
      await this.userService.delete(req.params.id);
      return this.httpResWrapper.success(res, {
        message: "User deleted successfully",
      });
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
