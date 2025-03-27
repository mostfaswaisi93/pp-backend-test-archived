import * as express from "express";
import AuthService from "../auth/auth-service";
import { PromoService } from "./promo-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import { create, update, getPromo, updateStatus } from "./promo-validation";

export default class PromoController implements Controller {
  public path = "/promos";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private promoService: PromoService = PromoService.Instance;

  private static _instance: PromoController;

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
    this.router.post("/create", superadminOnly, create, this.createPromo);
    this.router.get(
      "/getPromoById/:_id",
      superadminOnly,
      getPromo,
      this.getPromoById
    );
    this.router.get("/", this.getPromos);
    this.router.put("/update/:_id", superadminOnly, update, this.updatePromo);
    this.router.put(
      "/updatePromoStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updatePromoStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getPromo,
      this.deletePromo
    );
  }

  public createPromo = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const promo = await this.promoService.create(request.body);
      const message = "Promo created successfully.";
      return this.httpResWrapper.success(response, message, promo);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getPromoById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const promo = await this.promoService.getPromoById(req.params._id);
      const message = "Promo retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, promo);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getPromos = async (request: Request, response: Response) => {
    try {
      const promos = await this.promoService.getPromos();
      const message = "Promos retrieved successfully";
      return this.httpResWrapper.success(response, message, promos);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updatePromo = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedPromo = await this.promoService.update(
        request.params._id,
        request.body
      );
      const message = "Promo successfully updated.";
      return this.httpResWrapper.success(response, message, updatedPromo);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updatePromoStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedPromoStatus = await this.promoService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Promo status successfully updated.";
      return this.httpResWrapper.success(response, message, updatedPromoStatus);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deletePromo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.promoService.delete(req.params._id);
      const message = "Promo successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
