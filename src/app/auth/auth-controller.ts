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
    this.router.post("/forgot-password", forgotPassword, this.forgotPassword);
    this.router.post("/reset-password", resetPassword, this.resetPassword);
    this.router.delete("/logout", this.authService.authenticate, this.logout);
  }

  // ✅ Login authentication (using AuthService)
  private login = async (request: Request, response: Response) => {
    const email = (request.body.email as string).toLowerCase().trim();
    const password = request.body.password.trim();

    try {
      const user = await this.authService.login(email, password);
      const { userWithoutPassword, token } = user;

      const message = "Login successful.";
      this.httpResWrapper.success(
        response,
        message,
        userWithoutPassword,
        token
      );
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  // ✅ Logout
  private logout = async (request: Request, response: Response) => {
    const token = request.headers.authorization ?? "";

    if (!token) {
      const message = "No token provided.";
      this.httpResWrapper.error(response, message, 401);
      return this.httpResWrapper.error(response, message, 401);
    }

    try {
      await this.authService.logout(token);
      const message = "Logged out successfully.";
      this.httpResWrapper.success(response, message);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  // ✅ Forgot Password
  private forgotPassword = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const email = request.body.email;

    try {
      const result = await this.authService.forgotPassword(email);
      const message = "Password reset link sent successfully.";
      return this.httpResWrapper.success(response, message, result);
    } catch (error) {
      next(error);
    }
  };

  // ✅ Reset Password
  private resetPassword = async (
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
      const message = "Password reset successfully.";
      return this.httpResWrapper.success(response, message, user);
    } catch (error) {
      next(error);
    }
  };

  // ✅ Generate CAPTCHA
  private generateCAPTCHA = async (req: Request, res: Response) => {
    try {
      const captcha = await this.authService.generateCAPTCHA();
      const message = "CAPTCHA generated successfully.";
      this.httpResWrapper.success(res, message, captcha);
    } catch (error) {
      this.httpResWrapper.error(res, error);
    }
  };
}
