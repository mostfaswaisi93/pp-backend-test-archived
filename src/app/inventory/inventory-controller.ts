import * as express from "express";
import AuthService from "../auth/auth-service";
import { InventoryService } from "./inventory-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import { Inventory } from "../../models/inventory/inventory.model";
import {
  create,
  update,
  getInventory,
  updateStatus,
} from "./inventory-validation";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";

export default class InventoryController implements Controller {
  public path = "/inventories";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private inventoryService: InventoryService = InventoryService.Instance;

  private static _instance: InventoryController;

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
    this.router.post("/create", superadminOnly, create, this.createInventory);
    this.router.get(
      "/getInventoryById/:_id",
      superadminOnly,
      getInventory,
      this.getInventoryById
    );
    this.router.get(
      "/getLastInventoryId",
      superadminOnly,
      this.getLastInventoryId
    );
    this.router.get("/", this.getInventories);
    this.router.get("/getInventoriesWithSSP", this.getInventoriesWithSSP);
    this.router.post("/getInventoryName", this.getInventoryName);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updateInventory
    );
    this.router.put(
      "/updateInventoryStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateInventoryStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getInventory,
      this.deleteInventory
    );
  }

  public createInventory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const inventory = await this.inventoryService.create(request.body);
      const message = "Inventory created successfully.";
      return this.httpResWrapper.success(response, message, inventory);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getInventoryById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const inventory = await this.inventoryService.getInventoryById(
        req.params._id
      );
      const message = "Inventory retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, inventory);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getLastInventoryId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const inventory = await this.inventoryService.getLastInventoryId();
      const message = "Last Inventory retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, inventory);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getInventories = async (request: Request, response: Response) => {
    try {
      const inventories = await this.inventoryService.getInventories();
      const message = "Inventories retrieved successfully";
      return this.httpResWrapper.success(response, message, inventories);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getInventoriesWithSSP = async (
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
        ? { $or: [{ InventoryName: { $regex: regex } }] }
        : {};

      const total = await Inventory.countDocuments(searchQuery);

      const inventories = await Inventory.find(searchQuery)
        .sort({ InventoryName: 1 })
        .limit(limit)
        .skip((page - 1) * limit);

      return this.httpResWrapper.success(
        res,
        "Fetched inventories successfully",
        {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          limit,
          data: inventories,
        }
      );
    } catch (error: any) {
      this.httpResWrapper.error(res, error.message);
    }
  };

  public getInventoryName = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const result = await this.inventoryService.getInventoryName(request.body);

      if (result.error) {
        return this.httpResWrapper.success(response, result.message);
      }

      const inventories = result.inventories || [];

      if (inventories.length > 0) {
        const message = "Inventories fetched successfully.";
        return this.httpResWrapper.success(response, message, inventories);
      } else {
        const message = "Inventories not found.";
        return this.httpResWrapper.error(response, message);
      }
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateInventory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedInventory = await this.inventoryService.update(
        request.params._id,
        request.body
      );
      const message = "Inventory successfully updated.";
      return this.httpResWrapper.success(response, message, updatedInventory);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateInventoryStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedInventoryStatus = await this.inventoryService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Inventory status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedInventoryStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteInventory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.inventoryService.delete(req.params._id);
      const message = "Inventory successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
