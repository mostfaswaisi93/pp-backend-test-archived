import * as express from "express";
import AuthService from "../auth/auth-service";
import { NextFunction, Request, Response } from "express";
import { NotificationService } from "./notification-service";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  create,
  update,
  getNotification,
  updateStatus,
} from "./notification-validation";

export default class NotificationController implements Controller {
  public path = "/notifications";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private notificationService: NotificationService =
    NotificationService.Instance;

  private static _instance: NotificationController;

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
    this.router.post(
      "/create",
      superadminOnly,
      create,
      this.createNotification
    );
    this.router.get(
      "/getNotificationById/:_id",
      superadminOnly,
      getNotification,
      this.getNotificationById
    );
    this.router.get("/", this.getNotifications);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updateNotification
    );
    this.router.put(
      "/updateNotificationStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateNotificationStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getNotification,
      this.deleteNotification
    );
  }

  public createNotification = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const notification = await this.notificationService.create(request.body);
      const message = "Notification created successfully.";
      return this.httpResWrapper.success(response, message, notification);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getNotificationById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const notification = await this.notificationService.getNotificationById(
        req.params._id
      );
      const message = "Notification retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, notification);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getNotifications = async (request: Request, response: Response) => {
    try {
      const notifications = await this.notificationService.getNotifications();
      const message = "Notifications retrieved successfully";
      return this.httpResWrapper.success(response, message, notifications);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateNotification = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedNotification = await this.notificationService.update(
        request.params._id,
        request.body
      );
      const message = "Notification successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedNotification
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateNotificationStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedNotificationStatus =
        await this.notificationService.updateStatus(
          request.params._id,
          request.body
        );
      const message = "Notification status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedNotificationStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.notificationService.delete(req.params._id);
      const message = "Notification successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
