import * as express from "express";
import AuthService from "../auth/auth-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import { PurchaseOrderService } from "./purchase-order-service";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  create,
  update,
  getPurchaseOrder,
  updateStatus,
} from "./purchase-order-validation";

export default class PurchaseOrderController implements Controller {
  public path = "/purchase-orders";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private purchaseOrderService: PurchaseOrderService =
    PurchaseOrderService.Instance;

  private static _instance: PurchaseOrderController;

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
      this.createPurchaseOrder
    );
    this.router.get(
      "/getPurchaseOrderById/:_id",
      superadminOnly,
      getPurchaseOrder,
      this.getPurchaseOrderById
    );
    this.router.get("/", this.getPurchaseOrders);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updatePurchaseOrder
    );
    this.router.put(
      "/updatePurchaseOrderStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updatePurchaseOrderStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getPurchaseOrder,
      this.deletePurchaseOrder
    );
  }

  public createPurchaseOrder = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const purchaseOrder = await this.purchaseOrderService.create(
        request.body
      );
      const message = "Purchase order created successfully.";
      return this.httpResWrapper.success(response, message, purchaseOrder);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getPurchaseOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const purchaseOrder =
        await this.purchaseOrderService.getPurchaseOrderById(req.params._id);
      const message = "Purchase order retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, purchaseOrder);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getPurchaseOrders = async (request: Request, response: Response) => {
    try {
      const purchaseOrders =
        await this.purchaseOrderService.getPurchaseOrders();
      const message = "Purchase orders retrieved successfully";
      return this.httpResWrapper.success(response, message, purchaseOrders);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updatePurchaseOrder = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedPurchaseOrder = await this.purchaseOrderService.update(
        request.params._id,
        request.body
      );
      const message = "Purchase order successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedPurchaseOrder
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updatePurchaseOrderStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedPurchaseOrderStatus =
        await this.purchaseOrderService.updateStatus(
          request.params._id,
          request.body
        );
      const message = "Purchase order status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedPurchaseOrderStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deletePurchaseOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.purchaseOrderService.delete(req.params._id);
      const message = "Purchase order successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
