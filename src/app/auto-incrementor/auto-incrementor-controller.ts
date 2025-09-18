import * as express from "express";
import AuthService from "../auth/auth-service";
import { AutoIncrementorService } from "./auto-incrementor-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import { AutoIncrementor } from "../../models/auto-incrementor/auto-incrementor.model";
import {
  create,
  update,
  getAutoIncrementor,
  updateStatus,
} from "./auto-incrementor-validation";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";

export default class AutoIncrementorController implements Controller {
  public path = "/auto-incrementors";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private autoIncrementorService: AutoIncrementorService =
    AutoIncrementorService.Instance;

  private static _instance: AutoIncrementorController;

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
      this.createAutoIncrementor
    );
    this.router.get(
      "/getAutoIncrementorById/:_id",
      superadminOnly,
      getAutoIncrementor,
      this.getAutoIncrementorById
    );
    this.router.get(
      "/getLastAutoIncrementorId",
      superadminOnly,
      this.getLastAutoIncrementorId
    );
    this.router.get("/", this.getAutoIncrementors);
    this.router.get(
      "/getAutoIncrementorsWithSSP",
      this.getAutoIncrementorsWithSSP
    );
    this.router.post("/getAutoIncrementorName", this.getAutoIncrementorName);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updateAutoIncrementor
    );
    this.router.put(
      "/updateAutoIncrementorStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateAutoIncrementorStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getAutoIncrementor,
      this.deleteAutoIncrementor
    );
  }

  public createAutoIncrementor = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const autoIncrementor = await this.autoIncrementorService.create(
        request.body
      );
      const message = "Auto Incrementor created successfully.";
      return this.httpResWrapper.success(response, message, autoIncrementor);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getAutoIncrementorById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const autoIncrementor =
        await this.autoIncrementorService.getAutoIncrementorById(
          req.params._id
        );
      const message = "Auto Incrementor retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, autoIncrementor);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getLastAutoIncrementorId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const autoIncrementor =
        await this.autoIncrementorService.getLastAutoIncrementorId();
      const message = "Last Auto Incrementor retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, autoIncrementor);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getAutoIncrementors = async (request: Request, response: Response) => {
    try {
      const autoIncrementors =
        await this.autoIncrementorService.getAutoIncrementors();
      const message = "Auto Incrementors retrieved successfully";
      return this.httpResWrapper.success(response, message, autoIncrementors);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getAutoIncrementorsWithSSP = async (
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
        ? { $or: [{ AutoIncrementorName: { $regex: regex } }] }
        : {};

      const total = await AutoIncrementor.countDocuments(searchQuery);

      const autoIncrementors = await AutoIncrementor.find(searchQuery)
        .sort({ AutoIncrementorName: 1 })
        .limit(limit)
        .skip((page - 1) * limit);

      return this.httpResWrapper.success(
        res,
        "Fetched auto Incrementors successfully",
        {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          limit,
          data: autoIncrementors,
        }
      );
    } catch (error: any) {
      this.httpResWrapper.error(res, error.message);
    }
  };

  public getAutoIncrementorName = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const result = await this.autoIncrementorService.getAutoIncrementorName(
        request.body
      );

      if (result.error) {
        return this.httpResWrapper.success(response, result.message);
      }

      const autoIncrementors = result.autoIncrementors || [];

      if (autoIncrementors.length > 0) {
        const message = "Auto Incrementors fetched successfully.";
        return this.httpResWrapper.success(response, message, autoIncrementors);
      } else {
        const message = "Auto Incrementors not found.";
        return this.httpResWrapper.error(response, message);
      }
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateAutoIncrementor = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedAutoIncrementor = await this.autoIncrementorService.update(
        request.params._id,
        request.body
      );
      const message = "Auto Incrementor successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedAutoIncrementor
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateAutoIncrementorStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedAutoIncrementorStatus =
        await this.autoIncrementorService.updateStatus(
          request.params._id,
          request.body
        );
      const message = "Auto Incrementor status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedAutoIncrementorStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteAutoIncrementor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.autoIncrementorService.delete(req.params._id);
      const message = "Auto Incrementor successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
