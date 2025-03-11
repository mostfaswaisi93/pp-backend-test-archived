import { NextFunction, Request, Response } from "express";
import * as express from "express";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import { ProService } from "./pro-service";
import AuthService from "../auth/auth-service";
import Controller from "../../interfaces/controller.interface";
import { create } from "./pro-validation";
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
  }

  private getPros = async (request: Request, response: Response) => {
    try {
      const pros = await this.proService.getAllPros();
      return this.httpResWrapper.success(response, pros);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  private getProById = async (request: Request, response: Response) => {
    try {
      const pro = await this.proService.getProById(request.params.id);
      return this.httpResWrapper.success(response, pro);
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
      return this.httpResWrapper.success(response, createdPro);
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
      return this.httpResWrapper.success(response, updatedPro);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  private deletePro = async (request: Request, response: Response) => {
    try {
      await this.proService.delete(request.params.id);
      return this.httpResWrapper.success(response, {
        message: "Pro deleted successfully",
      });
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };
}
