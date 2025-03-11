import { NextFunction, Request, Response } from "express";
import * as express from "express";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import { UserService } from "./user-service";
import AuthService from "../auth/auth-service";
import Controller from "../../interfaces/controller.interface";
import { create } from "./user-validation";

export default class UserController implements Controller {
  public path = "/users";
  public router = express.Router();
  public middleware: any[] = [AuthService.Instance.authenticate];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private userService: UserService = UserService.Instance;

  private static _instance: UserController;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", create, this.createUser);
    this.router.get("/", this.getUsers);
    this.router.get("/:id", this.getUserById);
    this.router.put("/:id", this.updateUser);
    this.router.delete("/:id", this.deleteUser);
  }

  private getUsers = async (request: Request, response: Response) => {
    try {
      const users = await this.userService.getAllUsers();
      return this.httpResWrapper.success(response, users);
    } catch (error) {
      return this.handleError(response, error);
    }
  };

  private getUserById = async (request: Request, response: Response) => {
    try {
      const user = await this.userService.getUserById(request.params.id);
      return this.httpResWrapper.success(response, user);
    } catch (error) {
      return this.handleError(response, error);
    }
  };

  private createUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const createdUser = await this.userService.create(request.body);
      return this.httpResWrapper.success(response, createdUser);
    } catch (error) {
      return this.handleError(response, error);
    }
  };

  private updateUser = async (request: Request, response: Response) => {
    try {
      const updatedUser = await this.userService.update(
        request.params.id,
        request.body
      );
      return this.httpResWrapper.success(response, updatedUser);
    } catch (error) {
      return this.handleError(response, error);
    }
  };

  private deleteUser = async (request: Request, response: Response) => {
    try {
      await this.userService.delete(request.params.id);
      return this.httpResWrapper.success(response, {
        message: "User deleted successfully",
      });
    } catch (error) {
      return this.handleError(response, error);
    }
  };

  // Centralized error handler to reduce redundancy
  private handleError(response: Response, error: any) {
    // You can implement custom error handling logic here, e.g., logging
    return this.httpResWrapper.error(response, error);
  }
}
