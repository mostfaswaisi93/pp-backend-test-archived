import * as express from "express";
import { StateService } from "./state-service";
import AuthService from "../auth/auth-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import { create, update, getState, updateStatus } from "./state-validation";

export default class StateController implements Controller {
  public path = "/states";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private stateService: StateService = StateService.Instance;

  private static _instance: StateController;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/create",
      AuthService.Instance.authenticate,
      AuthService.Instance.checkRole.bind(AuthService.Instance, "superadmin"),
      create,
      this.createState
    );
    this.router.get(
      "/getStateById/:_id",
      AuthService.Instance.authenticate,
      AuthService.Instance.checkRole.bind(AuthService.Instance, "superadmin"),
      getState,
      this.getStateById
    );
    this.router.get("/", this.getStates);
    this.router.put(
      "/update/:_id",
      AuthService.Instance.authenticate,
      AuthService.Instance.checkRole.bind(AuthService.Instance, "superadmin"),
      update,
      this.updateState
    );
    this.router.put(
      "/updateStateStatus/:_id",
      AuthService.Instance.authenticate,
      AuthService.Instance.checkRole.bind(AuthService.Instance, "superadmin"),
      updateStatus,
      this.updateStateStatus
    );
    this.router.delete(
      "/delete/:_id",
      AuthService.Instance.authenticate,
      AuthService.Instance.checkRole.bind(AuthService.Instance, "superadmin"),
      getState,
      this.deleteState
    );
  }

  public createState = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const state = await this.stateService.create(request.body);
      const message = "State created successfully.";
      return this.httpResWrapper.success(response, message, state);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getStateById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const state = await this.stateService.getStateById(req.params._id);
      const message = "State retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, state);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getStates = async (request: Request, response: Response) => {
    try {
      const states = await this.stateService.getStates();
      const message = "States retrieved successfully";
      return this.httpResWrapper.success(response, message, states);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateState = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedState = await this.stateService.update(
        request.params._id,
        request.body
      );
      const message = "State successfully updated.";
      return this.httpResWrapper.success(response, message, updatedState);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateStateStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedStateStatus = await this.stateService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "State status successfully updated.";
      return this.httpResWrapper.success(response, message, updatedStateStatus);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteState = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.stateService.delete(req.params._id);
      const message = "State successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
