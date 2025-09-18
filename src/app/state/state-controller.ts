import * as express from "express";
import { Request, Response } from "express";
import { StateService } from "./state-service";
import AuthService from "../auth/auth-service";
import Controller from "../../interfaces/controller.interface";
import { NotFoundException } from "../../commons/errors/exceptions";
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
    const { authenticate, checkRole } = AuthService.Instance;
    const superadminOnly = [authenticate, checkRole("SUPERADMIN")];
    this.router.post("/create", superadminOnly, create, this.createState);
    this.router.get(
      "/getStateById/:_id",
      superadminOnly,
      getState,
      this.getStateById
    );
    this.router.get("/", this.getStates);
    this.router.get("/zipcodes/:stateCode", this.getZipcodeBasedStateName);
    this.router.put("/update/:_id", superadminOnly, update, this.updateState);
    this.router.put(
      "/updateStateStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateStateStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getState,
      this.deleteState
    );
  }

  public createState = async (request: Request, response: Response) => {
    try {
      const state = await this.stateService.create(request.body);
      const message = "State created successfully.";
      return this.httpResWrapper.success(response, message, state);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getStateById = async (request: Request, response: Response) => {
    try {
      const state = await this.stateService.getStateById(request.params._id);
      const message = "State retrieved successfully by ID.";
      return this.httpResWrapper.success(response, message, state);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getStates = async (request: Request, response: Response) => {
    try {
      const { status, fields } = request.query;

      const states = await this.stateService.getStates(
        status as string,
        fields as string
      );

      const message = "States retrieved successfully.";
      return this.httpResWrapper.success(response, message, states);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getZipcodeBasedStateName = async (
    request: Request,
    response: Response
  ) => {
    try {
      const states = await this.stateService.getZipcodeByStateCode(
        request.params.stateCode
      );
      const message = "Fetched zipcodes States successfully.";
      return this.httpResWrapper.success(response, message, states);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return this.httpResWrapper.error(response, error.message);
      }
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateState = async (request: Request, response: Response) => {
    try {
      const state = await this.stateService.update(
        request.params._id,
        request.body
      );
      const message = "State successfully updated.";
      return this.httpResWrapper.success(response, message, state);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateStateStatus = async (request: Request, response: Response) => {
    try {
      const state = await this.stateService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "State status successfully updated.";
      return this.httpResWrapper.success(response, message, state);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteState = async (request: Request, response: Response) => {
    try {
      await this.stateService.delete(request.params._id);
      const message = "State successfully deleted.";
      return this.httpResWrapper.success(response, message);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };
}
