import * as express from "express";
import AuthService from "../auth/auth-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import { AccountSettingService } from "./account-setting-service";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  create,
  update,
  getAccountSetting,
  updateStatus,
} from "./account-setting-validation";

export default class AccountSettingController implements Controller {
  public path = "/account-settings";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private accountSettingService: AccountSettingService =
    AccountSettingService.Instance;

  private static _instance: AccountSettingController;

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
    this.router.post(
      "/create",
      superadminOnly,
      create,
      this.createAccountSetting
    );
    this.router.get(
      "/getAccountSettingById/:_id",
      superadminOnly,
      getAccountSetting,
      this.getAccountSettingById
    );
    this.router.get("/", this.getAccountSettings);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updateAccountSetting
    );
    this.router.put(
      "/updateAccountSettingStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateAccountSettingStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getAccountSetting,
      this.deleteAccountSetting
    );
  }

  public createAccountSetting = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const accountSetting = await this.accountSettingService.create(
        request.body
      );
      const message = "Account setting created successfully.";
      return this.httpResWrapper.success(response, message, accountSetting);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getAccountSettingById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const accountSetting =
        await this.accountSettingService.getAccountSettingById(req.params._id);
      const message = "Account setting retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, accountSetting);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getAccountSettings = async (request: Request, response: Response) => {
    try {
      const accountSettings =
        await this.accountSettingService.getAccountSettings();
      const message = "Account settings retrieved successfully";
      return this.httpResWrapper.success(response, message, accountSettings);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateAccountSetting = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedAccountSetting = await this.accountSettingService.update(
        request.params._id,
        request.body
      );
      const message = "Account setting successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedAccountSetting
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateAccountSettingStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedAccountSettingStatus =
        await this.accountSettingService.updateStatus(
          request.params._id,
          request.body
        );
      const message = "Account setting status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedAccountSettingStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteAccountSetting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.accountSettingService.delete(req.params._id);
      const message = "Account setting successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
