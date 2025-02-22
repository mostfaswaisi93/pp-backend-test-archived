import { NextFunction, Request, Response } from "express";
import * as express from "express";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import AuthService from "./auth-service";
import { UserService } from "../user/user-service";
import AccessTokenService from "./access-token-service";
import { login, forgetPassword, resetPassword } from "./auth-validation";

export default class AuthController {
  public path = "/auth";
  public router = express.Router();
  private httpResWrapper = new HttpResWrapper();
  private authService = AuthService.Instance;
  private accessTokenService = AccessTokenService.Instance;
  private userService = UserService.Instance;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", login, this.login);
    this.router.post("/me", this.authService.authenticate, this.me);
    this.router.get("/generateCaptcha", this.generateCaptcha);
    this.router.post("/forget-password", forgetPassword, this.forgetPassword);
    this.router.post("/reset-password", resetPassword, this.resetPassword);
    this.router.delete("/", this.authService.authenticate, this.logout);
  }

  private async handleResponse(res: Response, promise: Promise<any>) {
    try {
      const result = await promise;
      this.httpResWrapper.success(res, result);
    } catch (error) {
      this.httpResWrapper.error(res, error);
    }
  }

  private login = (req: Request, res: Response) => {
    const { email, password } = req.body;
    this.handleResponse(res, this.authService.login(email, password));
  };

  private me = (req: Request, res: Response) => {
    const { userId } = req.user;
    this.handleResponse(res, this.userService.findById(userId));
  };

  private logout = (req: Request, res: Response) => {
    const { token } = req.user;
    this.handleResponse(res, this.authService.logout(token));
  };

  private forgetPassword = (req: Request, res: Response) => {
    const { email } = req.body;
    this.handleResponse(res, this.authService.forgetPassword(email));
  };

  private resetPassword = (req: Request, res: Response) => {
    const { password, verificationToken } = req.body;
    this.handleResponse(
      res,
      this.authService.resetPassword(verificationToken, password)
    );
  };

  private generateCaptcha = (req: Request, res: Response) => {
    this.handleResponse(res, this.authService.generateCaptcha());
  };
}
