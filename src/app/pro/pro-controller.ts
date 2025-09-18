import { NextFunction, Request, Response } from "express";
import * as express from "express";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import { ProService } from "./pro-service";
import AuthService from "../auth/auth-service";
import Controller from "../../interfaces/controller.interface";
import {
  create,
  getProProfile,
  searchPro,
  getEmailDataValidation,
} from "./pro-validation";
import { Error as MongooseError } from "mongoose";

export default class ProController implements Controller {
  public path = "/pros";
  public router = express.Router();
  public middleware: any[] = [];
  // public middleware: any[] = [AuthService.Instance.authenticate];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private proService: ProService = ProService.Instance;
  private authService: AuthService = AuthService.Instance;

  private static _instance: ProController;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/",
      create,
      // AuthService.Instance.isAdmin,
      this.createPro
    );
    this.router.get("/", this.getPros);
    this.router.get("/:id", this.getProById);
    // this.router.put("/:id", AuthService.Instance.isAdmin, this.updatePro);
    // this.router.delete("/:id", AuthService.Instance.isAdmin, this.deletePro);
    this.router.get("/profile/:id", getProProfile, this.getProProfile);
    this.router.get(
      "/profile-details/:id",
      getProProfile,
      this.getProProfileDetails
    );
    this.router.get("/categories", this.getProCategory);
    this.router.get("/search/:search", searchPro, this.findByProSearch);
    this.router.get(
      "/email-data/:loginId",
      getEmailDataValidation,
      this.getProEmailData
    );
    this.router.get(
      "/roles-permissions/:loginId",
      getEmailDataValidation,
      this.getProRolesAndPermissions
    );
  }

  private getPros = async (request: Request, response: Response) => {
    try {
      const pros = await this.proService.getAllPros();
      const message = "Get Pros successful";
      return this.httpResWrapper.success(response, message, pros);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  private getProById = async (request: Request, response: Response) => {
    try {
      const pro = await this.proService.getProById(request.params.id);
      const message = "Get Pro By Id successful";
      return this.httpResWrapper.success(response, message, pro);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  private createPro = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const createdPro = await this.proService.create(request.body);
      const message = "Created Pro successful";
      return this.httpResWrapper.success(response, message, createdPro);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  private updatePro = async (request: Request, response: Response) => {
    try {
      const updatedPro = await this.proService.update(
        request.params.id,
        request.body
      );
      const message = "Update Pro successful";
      return this.httpResWrapper.success(response, message, updatedPro);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  private deletePro = async (request: Request, response: Response) => {
    try {
      await this.proService.delete(request.params.id);
      const message = "Pro deleted successfully";
      return this.httpResWrapper.success(response, message);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  private getProProfile = async (req: Request, res: Response) => {
    try {
      const pro = await this.proService.getProProfile();
      // const pro = await this.proService.getProProfile(req);
      const message = "Fetched Pro profile successfully";
      return this.httpResWrapper.success(res, message, pro);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  private getProProfileDetails = async (req: Request, res: Response) => {
    try {
      const proDetails = await this.proService.getProProfileDetails(
        req.params.id,
        req.body.role
      );
      const message = "Fetched Pro profile details successfully";
      return this.httpResWrapper.success(res, message, proDetails);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  private getProCategory = async (req: Request, res: Response) => {
    try {
      const categories = await this.proService.getProCategory();
      const message = "Fetched Pro categories successfully";
      return this.httpResWrapper.success(res, message, categories);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  private findByProSearch = async (req: Request, res: Response) => {
    try {
      const { search } = req.params;
      const results = await this.proService.findByProSearch(search);
      return this.httpResWrapper.success(res, "Search successful", results);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  private getProEmailData = async (req: Request, res: Response) => {
    try {
      const loginId = req.params.loginId;
      const proData = await this.proService.getProEmailData(loginId);
      const message = "Get Pro Email Data successful";
      return this.httpResWrapper.success(res, message, proData);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  private getProRolesAndPermissions = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const loginId = request.params.loginId;
      const data = await this.proService.getProRolesAndPermissions(loginId);
      return this.httpResWrapper.success(
        response,
        "Get Pro Roles and Permissions successful",
        data
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };
}
