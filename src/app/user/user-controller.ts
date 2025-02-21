import { NextFunction, Request, Response } from "express";
import { User } from "../../database/entity/User";
import Controller from "../../interfaces/controller.interface";
import * as express from "express";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import { UserService } from "./user-service";
import { validate } from "class-validator";
import AuthService from "../auth/auth-service";
import UploadService from "../../commons/libs/upload-service";
import * as cors from "cors"; // If needed, apply this middleware globally
import { InvalidInputException } from "../../commons/errors/exceptions";
import { getUser, create, update, updateActive } from "./user-validation";

export default class UserController implements Controller {
  public path = "/users";
  public router = express.Router();
  public middleware: any[] = [AuthService.Instance.authenticate];

  private httpResWrapper: HttpResWrapper = new HttpResWrapper();
  private userService: UserService = UserService.Instance;
  private authService: AuthService = AuthService.Instance;
  private static _instance;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", AuthService.Instance.isAdmin, this.all);
    this.router.get("/active", AuthService.Instance.isAdmin, this.active);
    this.router.get("/ncsi", AuthService.Instance.isAdmin, this.ncsi);
    this.router.post("/", create, AuthService.Instance.isAdmin, this.create);
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
    this.router.put(
      "/active/:userId",
      updateActive,
      AuthService.Instance.isAdmin,
      this.updateActive
    );
    this.router.put("/", this.updateMe);
  }

  private async handleErrors(response: Response, error: any) {
    // Centralize error handling
    console.error(error);
    this.httpResWrapper.error(response, error);
  }

  all = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { agencyId, withAdmin } = request.query;
      const users = await this.userService.all(agencyId, withAdmin);
      return this.httpResWrapper.success(
        response,
        users.map((user) => user.toJSON())
      );
    } catch (error) {
      this.handleErrors(response, error);
    }
  };

  active = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { agencyId } = request.query;
      const users = await this.userService.active(agencyId);
      return this.httpResWrapper.success(
        response,
        users.map((user) => user.toJSON())
      );
    } catch (error) {
      this.handleErrors(response, error);
    }
  };

  ncsi = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const users = await this.userService.ncsi();
      return this.httpResWrapper.success(
        response,
        users.map((user) => user.toJSON())
      );
    } catch (error) {
      this.handleErrors(response, error);
    }
  };

  me = async (request: any, response: Response, next: NextFunction) => {
    let userId = request.user.userId;
    try {
      let user = await this.userService.findById(userId);
      return this.httpResWrapper.success(response, user.toJSON());
    } catch (error) {
      this.handleErrors(response, error);
    }
  };

  findById = async (request: any, response: Response, next: NextFunction) => {
    let userId = request.params.userId;
    try {
      let user = await this.userService.findById(userId);
      return this.httpResWrapper.success(response, user.toJSON());
    } catch (error) {
      this.handleErrors(response, error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction) => {
    let user = new User();
    user = { ...request.body, updatedBy: request.user?.userId };
    validate(user).then(async (errors) => {
      if (errors.length > 0) {
        this.httpResWrapper.handle(400, errors[0].constraints, response);
      } else {
        try {
          let createdUser = await this.userService.create(user);
          return this.httpResWrapper.success(response, createdUser.toJSON());
        } catch (error) {
          this.handleErrors(response, error);
        }
      }
    });
  };

  update = async (request: any, response: Response, next: NextFunction) => {
    const { userId } = request.params;
    let user = new User();
    user = { ...request.body, updatedBy: request.user?.userId };

    validate(user).then(async (errors) => {
      if (errors.length > 0) {
        this.httpResWrapper.handle(400, errors[0].constraints, response);
      } else {
        try {
          let updatedUser = await this.userService.update(userId, user);
          return this.httpResWrapper.success(response, updatedUser);
        } catch (error) {
          this.handleErrors(response, error);
        }
      }
    });
  };

  updateMe = async (request: any, response: Response, next: NextFunction) => {
    let userId = request.user.userId;
    let user = new User();
    user = { ...request.body, updatedBy: request.user?.userId };

    validate(user).then(async (errors) => {
      if (errors.length > 0) {
        this.httpResWrapper.handle(400, errors[0].constraints, response);
      } else {
        try {
          let updatedUser = await this.userService.update(userId, user);
          return this.httpResWrapper.success(response, updatedUser);
        } catch (error) {
          this.handleErrors(response, error);
        }
      }
    });
  };

  resetPassword = async (request, response) => {
    const { new_password, old_password } = request.body;
    let userId = request.user.userId;
    try {
      const user = await this.userService.resetPassword(
        new_password,
        old_password,
        userId
      );
      return this.httpResWrapper.success(response, user.toJSON());
    } catch (error) {
      this.handleErrors(response, error);
    }
  };

  updateActive = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { userId } = request.params;
    const { active } = request.body;
    const updatedBy = (request.user as Partial<User>).userId;
    try {
      const user = await this.userService.updateActive(
        userId,
        active,
        updatedBy
      );
      return this.httpResWrapper.success(response, user);
    } catch (error) {
      this.handleErrors(response, error);
    }
  };
}
