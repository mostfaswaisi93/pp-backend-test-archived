import * as express from "express";
import AuthService from "../auth/auth-service";
import { LeadService } from "./lead-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import { create, update, getLead, updateStatus } from "./lead-validation";

export default class LeadController implements Controller {
  public path = "/leads";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private leadService: LeadService = LeadService.Instance;

  private static _instance: LeadController;

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
    this.router.post("/create", superadminOnly, create, this.createLead);
    this.router.get(
      "/getLeadById/:_id",
      superadminOnly,
      getLead,
      this.getLeadById
    );
    this.router.get("/", this.getLeads);
    this.router.put("/update/:_id", superadminOnly, update, this.updateLead);
    this.router.put(
      "/updateLeadStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateLeadStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getLead,
      this.deleteLead
    );
  }

  public createLead = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const lead = await this.leadService.create(request.body);
      const message = "Lead created successfully.";
      return this.httpResWrapper.success(response, message, lead);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getLeadById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lead = await this.leadService.getLeadById(req.params._id);
      const message = "Lead retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, lead);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getLeads = async (request: Request, response: Response) => {
    try {
      const leads = await this.leadService.getLeads();
      const message = "Leads retrieved successfully";
      return this.httpResWrapper.success(response, message, leads);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateLead = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedLead = await this.leadService.update(
        request.params._id,
        request.body
      );
      const message = "Lead successfully updated.";
      return this.httpResWrapper.success(response, message, updatedLead);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateLeadStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedLeadStatus = await this.leadService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Lead status successfully updated.";
      return this.httpResWrapper.success(response, message, updatedLeadStatus);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteLead = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.leadService.delete(req.params._id);
      const message = "Lead successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
