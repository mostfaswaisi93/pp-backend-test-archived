import * as express from "express";
import AuthService from "../auth/auth-service";
import { PriceListService } from "./price-list-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  create,
  update,
  getPriceList,
  updateStatus,
} from "./price-list-validation";

export default class PriceListController implements Controller {
  public path = "/price-lists";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private priceListService: PriceListService = PriceListService.Instance;

  private static _instance: PriceListController;

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
    this.router.post("/create", superadminOnly, create, this.createPriceList);
    this.router.get(
      "/getPriceListById/:_id",
      superadminOnly,
      getPriceList,
      this.getPriceListById
    );
    this.router.get("/", this.getPriceLists);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updatePriceList
    );
    this.router.put(
      "/updatePriceListStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updatePriceListStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getPriceList,
      this.deletePriceList
    );
  }

  public createPriceList = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const priceList = await this.priceListService.create(request.body);
      const message = "Price list created successfully.";
      return this.httpResWrapper.success(response, message, priceList);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getPriceListById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const priceList = await this.priceListService.getPriceListById(
        req.params._id
      );
      const message = "Price list retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, priceList);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getPriceLists = async (request: Request, response: Response) => {
    try {
      const priceLists = await this.priceListService.getPriceLists();
      const message = "Price lists retrieved successfully";
      return this.httpResWrapper.success(response, message, priceLists);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updatePriceList = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedPriceList = await this.priceListService.update(
        request.params._id,
        request.body
      );
      const message = "Price list successfully updated.";
      return this.httpResWrapper.success(response, message, updatedPriceList);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updatePriceListStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedPriceListStatus = await this.priceListService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Price list status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedPriceListStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deletePriceList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.priceListService.delete(req.params._id);
      const message = "Price list successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
