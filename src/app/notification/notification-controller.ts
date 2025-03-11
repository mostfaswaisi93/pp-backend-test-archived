import * as express from "express";
import Controller from "../../interfaces/controller.interface";

export default class NotificationController implements Controller {
  public path = "/notification";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", this.getNotification);
    // this.router.post("/", this.createNotification);
  }
}
