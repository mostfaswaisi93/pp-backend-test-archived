import * as express from "express";
import { Request, Response } from "express";
import { ZipcodeService } from "./zipcode-service";
import AuthService from "../auth/auth-service";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import { create, getZipcode, update, updateStatus } from "./zipcode-validation";

export default class ZipcodeController implements Controller {
  public path = "/zipcodes";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private zipcodeService: ZipcodeService = ZipcodeService.Instance;

  private static _instance: ZipcodeController;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const { authenticate, checkRole } = AuthService.Instance;
    const superadminOnly = [authenticate, checkRole("SUPERADMIN")];

    this.router.post("/create", superadminOnly, create, this.createZipcode);
    this.router.get(
      "/getZipcodeById/:_id",
      superadminOnly,
      getZipcode,
      this.getZipcodeById
    );
    this.router.get("/", this.getZipcodes);
    this.router.put("/update/:_id", superadminOnly, update, this.updateZipcode);
    this.router.put(
      "/updateZipcodeStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateZipcodeStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getZipcode,
      this.deleteZipcode
    );
  }

  public createZipcode = async (request: Request, response: Response) => {
    try {
      const zipcode = await this.zipcodeService.create(request.body);
      const message = "Zipcode created successfully.";
      return this.httpResWrapper.success(response, message, zipcode);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getZipcodeById = async (request: Request, response: Response) => {
    try {
      const zipcode = await this.zipcodeService.getZipcodeById(
        request.params._id
      );
      const message = "Zipcode retrieved successfully by ID.";
      return this.httpResWrapper.success(response, message, zipcode);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getZipcodes = async (request: Request, response: Response) => {
    try {
      const { status, fields } = request.query;

      const zipcodes = await this.zipcodeService.getZipcodes(
        status as string,
        fields as string
      );

      const message = "Zipcodes retrieved successfully.";
      return this.httpResWrapper.success(response, message, zipcodes);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateZipcode = async (request: Request, response: Response) => {
    try {
      const zipcode = await this.zipcodeService.update(
        request.params._id,
        request.body
      );
      const message = "Zipcode successfully updated.";
      return this.httpResWrapper.success(response, message, zipcode);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateZipcodeStatus = async (request: Request, response: Response) => {
    try {
      const zipcode = await this.zipcodeService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Zipcode status successfully updated.";
      return this.httpResWrapper.success(response, message, zipcode);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteZipcode = async (request: Request, response: Response) => {
    try {
      await this.zipcodeService.delete(request.params._id);
      const message = "Zipcode successfully deleted.";
      return this.httpResWrapper.success(response, message);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };
}
