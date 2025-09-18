import * as express from "express";
import AuthService from "../auth/auth-service";
import { EstimateService } from "./estimate-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  create,
  update,
  getEstimate,
  updateStatus,
} from "./estimate-validation";

export default class EstimateController implements Controller {
  public path = "/estimates";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private estimateService: EstimateService = EstimateService.Instance;

  private static _instance: EstimateController;

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
    this.router.post("/create", superadminOnly, create, this.createEstimate);
    this.router.get(
      "/getEstimateById/:_id",
      superadminOnly,
      getEstimate,
      this.getEstimateById
    );
    this.router.get("/", this.getEstimates);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updateEstimate
    );
    this.router.put(
      "/updateEstimateStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateEstimateStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getEstimate,
      this.deleteEstimate
    );
  }

  public createEstimate = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const estimate = await this.estimateService.create(request.body);
      const message = "Estimate created successfully.";
      return this.httpResWrapper.success(response, message, estimate);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getEstimateById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const estimate = await this.estimateService.getEstimateById(
        req.params._id
      );
      const message = "Estimate retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, estimate);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getEstimates = async (request: Request, response: Response) => {
    try {
      const estimates = await this.estimateService.getEstimates();
      const message = "Estimates retrieved successfully";
      return this.httpResWrapper.success(response, message, estimates);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateEstimate = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedEstimate = await this.estimateService.update(
        request.params._id,
        request.body
      );
      const message = "Estimate successfully updated.";
      return this.httpResWrapper.success(response, message, updatedEstimate);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateEstimateStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedEstimateStatus = await this.estimateService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Estimate status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedEstimateStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteEstimate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.estimateService.delete(req.params._id);
      const message = "Estimate successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
