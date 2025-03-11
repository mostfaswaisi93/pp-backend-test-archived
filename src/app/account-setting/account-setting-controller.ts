import * as express from "express";
import Controller from "../../interfaces/controller.interface";

export default class AccountSettingController implements Controller {
  public path = "/account-setting";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get("/", this.getAccountSetting);
    // this.router.post("/", this.createAccountSetting);
  }
}
