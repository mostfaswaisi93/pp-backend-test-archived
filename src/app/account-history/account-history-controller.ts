import * as express from "express";
import AuthService from "../auth/auth-service";
import { AccountHistoryService } from "./account-history-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import { AccountHistory } from "../../models/account-history/account-history.model";
import {
  create,
  update,
  getAccountHistory,
  updateStatus,
} from "./account-history-validation";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";

export default class AccountHistoryController implements Controller {
  public path = "/accountHistories";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private accountHistoryService: AccountHistoryService =
    AccountHistoryService.Instance;

  private static _instance: AccountHistoryController;

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
      checkRole.bind(AuthService.Instance, "SUPERADMIN"),
    ];
    this.router.post(
      "/create",
      superadminOnly,
      create,
      this.createAccountHistory
    );
    this.router.get(
      "/getAccountHistoryById/:_id",
      superadminOnly,
      getAccountHistory,
      this.getAccountHistoryById
    );
    this.router.get(
      "/getLastAccountHistoryId",
      superadminOnly,
      this.getLastAccountHistoryId
    );
    this.router.get("/", this.getAccountHistories);
    this.router.get(
      "/getAccountHistoriesWithSSP",
      this.getAccountHistoriesWithSSP
    );
    this.router.post("/getAccountHistoryName", this.getAccountHistoryName);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updateAccountHistory
    );
    this.router.put(
      "/updateAccountHistoryStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateAccountHistoryStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getAccountHistory,
      this.deleteAccountHistory
    );
  }

  public createAccountHistory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const accountHistory = await this.accountHistoryService.create(
        request.body
      );
      const message = "Account History created successfully.";
      return this.httpResWrapper.success(response, message, accountHistory);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getAccountHistoryById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const accountHistory =
        await this.accountHistoryService.getAccountHistoryById(req.params._id);
      const message = "Account History retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, accountHistory);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getLastAccountHistoryId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const accountHistory =
        await this.accountHistoryService.getLastAccountHistoryId();
      const message = "Last Account History retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, accountHistory);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getAccountHistories = async (request: Request, response: Response) => {
    try {
      const accountHistories =
        await this.accountHistoryService.getAccountHistories();
      const message = "Account Histories retrieved successfully";
      return this.httpResWrapper.success(response, message, accountHistories);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getAccountHistoriesWithSSP = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const searchKey = req.body.searchKey ? req.body.searchKey.trim() : "";

      const regex = new RegExp(
        searchKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      const searchQuery = searchKey
        ? { $or: [{ AccountHistoryName: { $regex: regex } }] }
        : {};

      const total = await AccountHistory.countDocuments(searchQuery);

      const accountHistories = await AccountHistory.find(searchQuery)
        .sort({ AccountHistoryName: 1 })
        .limit(limit)
        .skip((page - 1) * limit);

      return this.httpResWrapper.success(
        res,
        "Fetched accountHistories successfully",
        {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          limit,
          data: accountHistories,
        }
      );
    } catch (error: any) {
      this.httpResWrapper.error(res, error.message);
    }
  };

  public getAccountHistoryName = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const result = await this.accountHistoryService.getAccountHistoryName(
        request.body
      );

      if (result.error) {
        return this.httpResWrapper.success(response, result.message);
      }

      const accountHistories = result.accountHistories || [];

      if (accountHistories.length > 0) {
        const message = "Account Histories fetched successfully.";
        return this.httpResWrapper.success(response, message, accountHistories);
      } else {
        const message = "Account Histories not found.";
        return this.httpResWrapper.error(response, message);
      }
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateAccountHistory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedAccountHistory = await this.accountHistoryService.update(
        request.params._id,
        request.body
      );
      const message = "AccountHistory successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedAccountHistory
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateAccountHistoryStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedAccountHistoryStatus =
        await this.accountHistoryService.updateStatus(
          request.params._id,
          request.body
        );
      const message = "Account History status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedAccountHistoryStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteAccountHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.accountHistoryService.delete(req.params._id);
      const message = "Account History successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
