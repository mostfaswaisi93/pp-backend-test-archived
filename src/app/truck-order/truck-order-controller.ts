import * as express from "express";
import AuthService from "../auth/auth-service";
import { TruckOrderService } from "./truck-order-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  create,
  update,
  getTruckOrder,
  updateStatus,
} from "./truck-order-validation";

export default class TruckOrderController implements Controller {
  public path = "/truck-orders";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private truckOrderService: TruckOrderService = TruckOrderService.Instance;

  private static _instance: TruckOrderController;

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
    this.router.post("/create", superadminOnly, create, this.createTruckOrder);
    this.router.get(
      "/getTruckOrderById/:_id",
      superadminOnly,
      getTruckOrder,
      this.getTruckOrderById
    );
    this.router.get("/", this.getTruckOrders);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updateTruckOrder
    );
    this.router.put(
      "/updateTruckOrderStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateTruckOrderStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getTruckOrder,
      this.deleteTruckOrder
    );
  }

  public createTruckOrder = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const truckOrder = await this.truckOrderService.create(request.body);
      const message = "Truck order created successfully.";
      return this.httpResWrapper.success(response, message, truckOrder);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getTruckOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const truckOrder = await this.truckOrderService.getTruckOrderById(
        req.params._id
      );
      const message = "Truck order retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, truckOrder);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getTruckOrders = async (request: Request, response: Response) => {
    try {
      const truckOrders = await this.truckOrderService.getTruckOrders();
      const message = "Truck orders retrieved successfully";
      return this.httpResWrapper.success(response, message, truckOrders);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateTruckOrder = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedTruckOrder = await this.truckOrderService.update(
        request.params._id,
        request.body
      );
      const message = "Truck order successfully updated.";
      return this.httpResWrapper.success(response, message, updatedTruckOrder);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateTruckOrderStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedTruckOrderStatus = await this.truckOrderService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Truck order status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedTruckOrderStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteTruckOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.truckOrderService.delete(req.params._id);
      const message = "Truck order successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
