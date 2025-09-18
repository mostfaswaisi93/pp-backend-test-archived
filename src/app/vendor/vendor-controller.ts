import * as express from "express";
import AuthService from "../auth/auth-service";
import { VendorService } from "./vendor-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import { create, update, getVendor, updateStatus } from "./vendor-validation";

export default class VendorController implements Controller {
  public path = "/vendors";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private vendorService: VendorService = VendorService.Instance;

  private static _instance: VendorController;

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
    this.router.post("/create", superadminOnly, create, this.createVendor);
    this.router.get(
      "/getVendorById/:_id",
      superadminOnly,
      getVendor,
      this.getVendorById
    );
    this.router.get("/", this.getVendors);
    this.router.put("/update/:_id", superadminOnly, update, this.updateVendor);
    this.router.put(
      "/updateVendorStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateVendorStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getVendor,
      this.deleteVendor
    );
  }

  public createVendor = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const vendor = await this.vendorService.create(request.body);
      const message = "Vendor created successfully.";
      return this.httpResWrapper.success(response, message, vendor);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getVendorById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const vendor = await this.vendorService.getVendorById(req.params._id);
      const message = "Vendor retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, vendor);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getVendors = async (request: Request, response: Response) => {
    try {
      const vendors = await this.vendorService.getVendors();
      const message = "Vendors retrieved successfully";
      return this.httpResWrapper.success(response, message, vendors);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateVendor = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedVendor = await this.vendorService.update(
        request.params._id,
        request.body
      );
      const message = "Vendor successfully updated.";
      return this.httpResWrapper.success(response, message, updatedVendor);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateVendorStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedVendorStatus = await this.vendorService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Vendor status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedVendorStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteVendor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.vendorService.delete(req.params._id);
      const message = "Vendor successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
