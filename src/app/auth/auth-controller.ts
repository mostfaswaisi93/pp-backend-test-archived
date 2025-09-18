import * as express from "express";
import AuthService from "./auth-service";
import { Request, Response, NextFunction } from "express";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  login,
  checkEmail,
  resetPassword,
  forgotPassword,
  checkProStatus,
  updateVanRegFlag,
  updateLeadRegFlag,
  forgotPasswordVerify,
  adminSignInAsPro as adminSignInAsProValidation,
  updateUserProfile as updateUserProfileValidation,
} from "./auth-validation";

export default class AuthController implements Controller {
  public path = "/auth";
  public router = express.Router();
  public middleware: any[] = [];

  private authService = AuthService.Instance;
  private httpResWrapper = HttpResWrapper.Instance;

  private static _instance: AuthController;

  static get Instance(): AuthController {
    if (!this._instance) this._instance = new this();
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
    this.router.get("/check-email/:emailId", checkEmail, this.checkEmailId);
    this.router.get(
      "/check-pro-status/:ProEmailId",
      checkProStatus,
      this.checkProStatus
    );
    this.router.put(
      "/update-van-reg-flag",
      updateVanRegFlag,
      this.updateVanRegFlag
    );
    this.router.put(
      "/update-lead-reg-flag",
      updateLeadRegFlag,
      this.updateLeadRegFlag
    );
    this.router.post(
      "/forgot-password-verify",
      forgotPasswordVerify,
      this.getForgotPasswordVerifyMethod
    );
    this.router.post(
      "/admin-sign-in-as-pro",
      this.authService.authenticate,
      adminSignInAsProValidation,
      this.adminSignInAsPro
    );
    this.router.put(
      "/update-user-profile",
      this.authService.authenticate,
      updateUserProfileValidation,
      this.updateUserProfile
    );
  }

  // ✅ Login
  private login = async (request: Request, response: Response) => {
    const email = (request.body.email as string)?.toLowerCase().trim();
    const password = request.body.password?.trim();

    try {
      const { userWithoutPassword, token } = await this.authService.login(
        email,
        password
      );
      this.httpResWrapper.success(
        response,
        "Login successful.",
        userWithoutPassword,
        { accessToken: token }
      );
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  // ✅ Logout
  private logout = async (request: Request, response: Response) => {
    const token = request.headers.authorization ?? "";

    if (!token)
      return this.httpResWrapper.error(response, "No token provided.", 401);

    try {
      await this.authService.logout(token);
      this.httpResWrapper.success(response, "Logged out successfully.");
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
      this.httpResWrapper.success(
        response,
        "Password reset link sent successfully.",
        result
      );
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
    const { password, verificationToken } = request.body;
    try {
      const result = await this.authService.resetPassword(
        verificationToken,
        password
      );
      this.httpResWrapper.success(
        response,
        "Password reset successfully.",
        result
      );
    } catch (error) {
      next(error);
    }
  };

  // ✅ Generate CAPTCHA
  private generateCAPTCHA = async (request: Request, response: Response) => {
    try {
      const captcha = this.authService.generateCAPTCHA();
      this.httpResWrapper.success(
        response,
        "CAPTCHA generated successfully.",
        captcha
      );
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  // ✅ Check Email
  private checkEmailId = async (request: Request, response: Response) => {
    try {
      const emailId = request.params.emailId;
      const result = await this.authService.checkEmailId(emailId);
      if (result.length)
        this.httpResWrapper.success(response, "Login Data Found.", result);
      else this.httpResWrapper.error(response, "Login Data Not Found.");
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  // ✅ Check Pro Status
  private checkProStatus = async (request: Request, response: Response) => {
    try {
      const ProEmailId = request.params.ProEmailId;
      const result = await this.authService.checkProStatus(ProEmailId);
      this.httpResWrapper.success(response, "Success", result);
    } catch (error: any) {
      this.httpResWrapper.error(
        response,
        error.message || "Something went wrong"
      );
    }
  };

  // ✅ Update Van Registration Flag
  private updateVanRegFlag = async (request: Request, response: Response) => {
    try {
      const { emailId, vanlynkRegCompletedFlag } = request.body;
      const result = await this.authService.updateVanRegFlag(
        emailId,
        vanlynkRegCompletedFlag
      );
      this.httpResWrapper.success(
        response,
        "Status Changed successfully",
        result
      );
    } catch (error: any) {
      this.httpResWrapper.error(
        response,
        error.message || "Vanlynk Registration Status unsuccessful"
      );
    }
  };

  // ✅ Update Lead Registration Flag
  private updateLeadRegFlag = async (request: Request, response: Response) => {
    try {
      const { emailId, leadRegCompletedFlag } = request.body;
      const result = await this.authService.updateLeadRegStatus(
        emailId,
        leadRegCompletedFlag
      );
      this.httpResWrapper.success(
        response,
        "Status Changed successfully",
        result
      );
    } catch (error: any) {
      this.httpResWrapper.error(
        response,
        error.message || "Lead Registration Status unsuccessful"
      );
    }
  };

  // ✅ Forgot Password Verify Method
  private getForgotPasswordVerifyMethod = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { emailId, role } = request.body;
      const result = await this.authService.getForgotPasswordVerifyMethod(
        emailId,
        role
      );
      this.httpResWrapper.success(
        response,
        "Get Forgot Methods Success.",
        result
      );
    } catch (error: any) {
      this.httpResWrapper.error(
        response,
        error.message || "Email or Role not valid."
      );
    }
  };

  // ✅ Admin Sign-In As Pro
  private adminSignInAsPro = async (request: Request, response: Response) => {
    try {
      const adminEmail = "request.user?.email";
      const proEmail = "request.body.proEmail";
      // const adminEmail = request.user?.email;
      // const proEmail = request.body.proEmail;
      if (!adminEmail || !proEmail)
        return this.httpResWrapper.error(
          response,
          "Missing admin or pro email."
        );

      const { userWithoutPassword, token } =
        await this.authService.adminSignInAsPro(adminEmail, proEmail);
      this.httpResWrapper.success(
        response,
        "Pro login successful",
        userWithoutPassword,
        { accessToken: token }
      );
    } catch (error: any) {
      this.httpResWrapper.error(
        response,
        error.message || "Login as Pro failed."
      );
    }
  };

  private updateUserProfile = async (request: Request, response: Response) => {
    try {
      // const email = request.user?.email;
      const email = "request.user?.email";
      if (!email)
        return this.httpResWrapper.error(response, "User email not found.");

      const updatedData = request.body;
      const result = await this.authService.updateUserProfile(
        email,
        updatedData
      );
      this.httpResWrapper.success(
        response,
        "User profile updated successfully.",
        result
      );
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };
}
