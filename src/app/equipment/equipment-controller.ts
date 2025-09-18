import * as express from "express";
import AuthService from "../auth/auth-service";
import { EquipmentService } from "./equipment-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import { Equipment } from "../../models/equipment/equipment.model";
import {
  create,
  update,
  getEquipment,
  updateStatus,
} from "./equipment-validation";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";

export default class EquipmentController implements Controller {
  public path = "/equipments";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private equipmentService: EquipmentService = EquipmentService.Instance;

  private static _instance: EquipmentController;

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
    this.router.post("/create", superadminOnly, create, this.createEquipment);
    this.router.get(
      "/getEquipmentById/:_id",
      superadminOnly,
      getEquipment,
      this.getEquipmentById
    );
    this.router.get(
      "/getLastEquipmentId",
      superadminOnly,
      this.getLastEquipmentId
    );
    this.router.get("/", this.getEquipments);
    this.router.get("/getEquipmentsWithSSP", this.getEquipmentsWithSSP);
    this.router.post("/getEquipmentName", this.getEquipmentName);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updateEquipment
    );
    this.router.put(
      "/updateEquipmentStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateEquipmentStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getEquipment,
      this.deleteEquipment
    );
  }

  public createEquipment = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const equipment = await this.equipmentService.create(request.body);
      const message = "Equipment created successfully.";
      return this.httpResWrapper.success(response, message, equipment);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getEquipmentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const equipment = await this.equipmentService.getEquipmentById(
        req.params._id
      );
      const message = "Equipment retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, equipment);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getLastEquipmentId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const equipment = await this.equipmentService.getLastEquipmentId();
      const message = "Last Equipment retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, equipment);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getEquipments = async (request: Request, response: Response) => {
    try {
      const equipments = await this.equipmentService.getEquipments();
      const message = "Equipments retrieved successfully";
      return this.httpResWrapper.success(response, message, equipments);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getEquipmentsWithSSP = async (
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
        ? { $or: [{ EquipmentName: { $regex: regex } }] }
        : {};

      const total = await Equipment.countDocuments(searchQuery);

      const equipments = await Equipment.find(searchQuery)
        .sort({ EquipmentName: 1 })
        .limit(limit)
        .skip((page - 1) * limit);

      return this.httpResWrapper.success(
        res,
        "Fetched equipments successfully",
        {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          limit,
          data: equipments,
        }
      );
    } catch (error: any) {
      this.httpResWrapper.error(res, error.message);
    }
  };

  public getEquipmentName = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const result = await this.equipmentService.getEquipmentName(request.body);

      if (result.error) {
        return this.httpResWrapper.success(response, result.message);
      }

      const equipments = result.equipments || [];

      if (equipments.length > 0) {
        const message = "Equipments fetched successfully.";
        return this.httpResWrapper.success(response, message, equipments);
      } else {
        const message = "Equipments not found.";
        return this.httpResWrapper.error(response, message);
      }
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateEquipment = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedEquipment = await this.equipmentService.update(
        request.params._id,
        request.body
      );
      const message = "Equipment successfully updated.";
      return this.httpResWrapper.success(response, message, updatedEquipment);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateEquipmentStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedEquipmentStatus = await this.equipmentService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Equipment status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedEquipmentStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteEquipment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.equipmentService.delete(req.params._id);
      const message = "Equipment successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
