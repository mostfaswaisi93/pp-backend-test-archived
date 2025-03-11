import * as express from "express";
import AuthService from "./auth-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import { login, forgotPassword, resetPassword } from "./auth-validation";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";

export default class AuthController implements Controller {
  public path = "/auth";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private authService = AuthService.Instance;

  private static _instance: AuthController;

  static get Instance(): AuthController {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/login", login, this.login);
    this.router.get("/generateCaptcha", this.generateCAPTCHA);
    this.router.get("/verifyUser/:email", this.verifyUserRole);
    this.router.post("/forgot-password", forgotPassword, this.forgotPassword);
    this.router.post("/reset-password", resetPassword, this.resetPassword);
    this.router.delete("/logout", this.authService.authenticate, this.logout);
  }

  // ✅ Login authentication (using AuthService)
  private login = async (request: Request, response: Response) => {
    const email = (request.body.email as string).toLowerCase().trim();
    const password = request.body.password.trim();
    try {
      let user = await this.authService.login(email, password);
      const { userWithoutPassword, token } = user;
      this.httpResWrapper.success(response, userWithoutPassword, token);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  // ✅ Logout
  private logout = async (request: Request, response: Response) => {
    const token = request.headers.authorization;
    if (!token) {
      response
        .status(401)
        .json({ success: false, message: "No token provided" });
      return;
    }
    try {
      await this.authService.logout(token);
      let message = "Logged out successfully";
      this.httpResWrapper.success(response, message);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  verifyUserRole = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const email = request.body.email;
    try {
      const result = await this.authService.verifyUserRole(email);
      console.log(result);
      

      //   if (result.length > 0) {
      //     return apiResponses.successResponseWithData(res, 'Fetched User Successfully', result);
      // } else {
      //     return apiResponses.notFoundResponse(res, 'User Not Found');
      // }
      return this.httpResWrapper.success(response, result);
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const email = request.body.email;
    try {
      const result = await this.authService.forgotPassword(email);
      return this.httpResWrapper.success(response, result);
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const password = request.body.password;
    const verificationToken = request.body.verificationToken;
    try {
      const user = await this.authService.resetPassword(
        verificationToken,
        password
      );
      return this.httpResWrapper.success(response, user);
    } catch (error) {
      next(error);
    }
  };

  generateCAPTCHA = async (req: Request, res: Response) => {
    try {
      let captcha = await this.authService.generateCAPTCHA();
      this.httpResWrapper.success(res, captcha);
    } catch (error) {
      this.httpResWrapper.error(res, error);
    }
  };
}
