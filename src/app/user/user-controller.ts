import * as express from "express";
import { Request, Response } from "express";
import { UserService } from "./user-service";
import AuthService from "../auth/auth-service";
import Controller from "../../interfaces/controller.interface";
import {
  create,
  update,
  getUser,
  updateStatus,
  changePassword,
} from "./user-validation";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";

export default class UserController implements Controller {
  public path = "/users";
  public router = express.Router();
  public middleware: any[] = [];

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
    const { authenticate, checkRole } = AuthService.Instance;
    const superadminOnly = [authenticate, checkRole("SUPERADMIN")];
    this.router.post("/create", superadminOnly, create, this.createUser);
    this.router.get(
      "/getUserById/:_id",
      superadminOnly,
      getUser,
      this.getUserById
    );
    this.router.get("/", superadminOnly, this.getUsers);
    this.router.put("/update/:_id", superadminOnly, update, this.updateUser);
    this.router.put(
      "/updateUserStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateUserStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getUser,
      this.deleteUser
    );
    this.router.put("/restore/:_id", superadminOnly, getUser, this.restoreUser);
    this.router.put(
      "/changePassword/:_id",
      superadminOnly,
      changePassword,
      this.changePassword
    );
    this.router.put("/me", authenticate, this.updateMyProfile);
  }

  public createUser = async (request: Request, response: Response) => {
    try {
      const user = await this.userService.create(request.body);
      const message = "User created successfully.";
      return this.httpResWrapper.success(response, message, user);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getUserById = async (request: Request, response: Response) => {
    try {
      const user = await this.userService.getUserById(request.params._id);
      const message = "User retrieved successfully by ID.";
      return this.httpResWrapper.success(response, message, user);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getUsers = async (request: Request, response: Response) => {
    try {
      const { status, email, fields } = request.query;
      const users = await this.userService.getUsers(
        status as string,
        email as string,
        fields as string
      );
      const message = "Users retrieved successfully";
      return this.httpResWrapper.success(response, message, users);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateUser = async (request: Request, response: Response) => {
    try {
      const user = await this.userService.update(
        request.params._id,
        request.body
      );
      const message = "User updated successfully.";
      return this.httpResWrapper.success(response, message, user);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateUserStatus = async (request: Request, response: Response) => {
    try {
      const user = await this.userService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "User status successfully updated.";
      return this.httpResWrapper.success(response, message, user);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteUser = async (request: Request, response: Response) => {
    try {
      await this.userService.delete(request.params._id);
      const message = "User deleted successfully.";
      return this.httpResWrapper.success(response, message, null);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public restoreUser = async (request: Request, response: Response) => {
    try {
      const user = await this.userService.restore(request.params._id);
      const message = "User restored successfully.";
      return this.httpResWrapper.success(response, message, user);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public changePassword = async (request: Request, response: Response) => {
    try {
      const { oldPassword, newPassword } = request.body;
      const userId = request.params._id;

      const user = await this.userService.changePassword(
        userId,
        oldPassword,
        newPassword
      );

      const message = "Password changed successfully.";
      return this.httpResWrapper.success(response, message, user);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateMyProfile = async (request: Request, response: Response) => {
    const req = request as any; // This API in-progress
    if (!req.user) throw new Error("User not authenticated");
    const userId = req.user!.id;
    const data = request.body;

    try {
      const updatedUser = await this.userService.updateMyProfile(userId, data);
      return this.httpResWrapper.success(
        response,
        "Profile updated successfully",
        updatedUser
      );
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };
}
