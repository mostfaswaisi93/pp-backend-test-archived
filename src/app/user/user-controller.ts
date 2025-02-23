import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import * as express from "express";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import { UserService } from "./user-service";
import { validate } from "class-validator";
import AuthService from "../auth/auth-service";
import { getUser, create, update, updateActive } from "./user-validation";

export default class UserController implements Controller {
  public path = "/users";
  public router = express.Router();
  public middleware: any[] = [AuthService.Instance.authenticate];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private userService: UserService = UserService.Instance;
  private authService: AuthService = AuthService.Instance;
  private static _instance : UserController;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", AuthService.Instance.isAdmin, this.all);
    // this.router.get("/active", AuthService.Instance.isAdmin, this.active);
    // this.router.post("/", create, AuthService.Instance.isAdmin, this.create);
    this.router.post("/", this.create);
    this.router.post("/reset-password", this.resetPassword);
    this.router.get(
      "/:userId",
      getUser,
      AuthService.Instance.isAdmin,
      this.findById
    );
    this.router.put(
      "/:userId",
      update,
      AuthService.Instance.isAdmin,
      this.update
    );
    // this.router.put(
    //   "/active/:userId",
    //   updateActive,
    //   AuthService.Instance.isAdmin,
    //   this.updateActive
    // );
    this.router.put("/", this.updateMe);
  }

  private async handleErrors(response: Response, error: any) {
    console.error(error);
    this.httpResWrapper.error(response, error);
  }

  private async validateUserData(userData: any, response: Response) {
    const errors = await validate(userData);
    if (errors.length > 0) {
      this.httpResWrapper.handle(400, errors[0].constraints, response);
      return false;
    }
    return true;
  }

  private sendSuccessResponse(response: Response, data: any) {
    return this.httpResWrapper.success(
      response,
      data.toJSON ? data.toJSON() : data
    );
  }

  // all = async (request: Request, response: Response) => {
  //   try {
  //     const { agencyId, withAdmin } = request.query;
  //     const users = await this.userService.all(agencyId, withAdmin);
  //     this.sendSuccessResponse(response, users);
  //   } catch (error) {
  //     this.handleErrors(response, error);
  //   }
  // };

  // active = async (request: Request, response: Response) => {
  //   try {
  //     const { agencyId } = request.query;
  //     const users = await this.userService.active(agencyId);
  //     this.sendSuccessResponse(response, users);
  //   } catch (error) {
  //     this.handleErrors(response, error);
  //   }
  // };

  me = async (request: any, response: Response) => {
    const userId = request.user.userId;
    try {
      const user = await this.userService.findById(userId);
      this.sendSuccessResponse(response, user);
    } catch (error) {
      this.handleErrors(response, error);
    }
  };

  findById = async (request: any, response: Response) => {
    const userId = request.params.userId;
    try {
      const user = await this.userService.findById(userId);
      this.sendSuccessResponse(response, user);
    } catch (error) {
      this.handleErrors(response, error);
    }
  };

  create = async (request: Request, response: Response) => {
    const user = { ...request.body, updatedBy: request.user?.userId };
    const isValid = await this.validateUserData(user, response);
    if (!isValid) return;

    try {
      const createdUser = await this.userService.create(user);
      this.sendSuccessResponse(response, createdUser);
    } catch (error) {
      this.handleErrors(response, error);
    }
  };

  update = async (request: any, response: Response) => {
    const { userId } = request.params;
    const user = { ...request.body, updatedBy: request.user?.userId };
    const isValid = await this.validateUserData(user, response);
    if (!isValid) return;

    try {
      const updatedUser = await this.userService.update(userId, user);
      this.sendSuccessResponse(response, updatedUser);
    } catch (error) {
      this.handleErrors(response, error);
    }
  };

  updateMe = async (request: any, response: Response) => {
    const userId = request.user.userId;
    const user = { ...request.body, updatedBy: request.user?.userId };
    const isValid = await this.validateUserData(user, response);
    if (!isValid) return;

    try {
      const updatedUser = await this.userService.update(userId, user);
      this.sendSuccessResponse(response, updatedUser);
    } catch (error) {
      this.handleErrors(response, error);
    }
  };

  resetPassword = async (request: Request, response: Response) => {
    const { new_password, old_password } = request.body;
    const userId = request.user.userId;
    try {
      const user = await this.userService.resetPassword(
        new_password,
        old_password,
        userId
      );
      this.sendSuccessResponse(response, user);
    } catch (error) {
      this.handleErrors(response, error);
    }
  };

  // updateActive = async (request: Request, response: Response) => {
  //   const { userId } = request.params;
  //   const { active } = request.body;
  //   const updatedBy = (request.user as Partial<User>).userId;
  //   try {
  //     const user = await this.userService.updateActive(
  //       userId,
  //       active,
  //       updatedBy
  //     );
  //     this.sendSuccessResponse(response, user);
  //   } catch (error) {
  //     this.handleErrors(response, error);
  //   }
  // };
}
