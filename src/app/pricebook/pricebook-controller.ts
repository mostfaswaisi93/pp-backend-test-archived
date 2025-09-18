import * as express from "express";
import AuthService from "../auth/auth-service";
import { PricebookService } from "./pricebook-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  create,
  update,
  getPricebook,
  updateStatus,
} from "./pricebook-validation";

export default class PricebookController implements Controller {
  public path = "/pricebooks";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private pricebookService: PricebookService = PricebookService.Instance;

  private static _instance: PricebookController;

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
    this.router.post("/create", superadminOnly, create, this.createPricebook);
    this.router.get(
      "/getPricebookById/:_id",
      superadminOnly,
      getPricebook,
      this.getPricebookById
    );
    this.router.get("/", this.getPricebooks);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updatePricebook
    );
    this.router.put(
      "/updatePricebookStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updatePricebookStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getPricebook,
      this.deletePricebook
    );
  }

  public createPricebook = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const pricebook = await this.pricebookService.create(request.body);
      const message = "Pricebook created successfully.";
      return this.httpResWrapper.success(response, message, pricebook);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getPricebookById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const pricebook = await this.pricebookService.getPricebookById(
        req.params._id
      );
      const message = "Pricebook retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, pricebook);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getPricebooks = async (request: Request, response: Response) => {
    try {
      const pricebooks = await this.pricebookService.getPricebooks();
      const message = "Pricebooks retrieved successfully";
      return this.httpResWrapper.success(response, message, pricebooks);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updatePricebook = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedPricebook = await this.pricebookService.update(
        request.params._id,
        request.body
      );
      const message = "Pricebook successfully updated.";
      return this.httpResWrapper.success(response, message, updatedPricebook);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updatePricebookStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedPricebookStatus = await this.pricebookService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Pricebook status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedPricebookStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deletePricebook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.pricebookService.delete(req.params._id);
      const message = "Pricebook successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
