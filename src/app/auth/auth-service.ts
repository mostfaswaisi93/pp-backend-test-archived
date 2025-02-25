import * as crypto from "crypto";
import User from "../../models/user/user.model";
import {
  InvalidEmailOrPasswordException,
  InvalidInputException,
  AccountNotVerifiedException,
} from "../../commons/errors/exceptions";
import AccessTokenService from "./access-token-service";
import * as i18n from "i18n";
import { PasswordCheckService } from "../../commons/validators/password-check-service";
import { USER_TYPES } from "../../commons/constants/constants";
import * as jwt from "jsonwebtoken";
import { NextFunction } from "express";

export default class AuthService {
  private accessTokenService = AccessTokenService.Instance;
  private passwordCheckService = PasswordCheckService.Instance;
  private userTypes = USER_TYPES;

  private static _instance: AuthService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  constructor() {}

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new InvalidEmailOrPasswordException();
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).populate("agency");

    if (!user) {
      throw new InvalidEmailOrPasswordException();
    }

    // if (user.active === 2 || (user.agency && user.agency.active === 2)) {
    //   throw new AccountNotVerifiedException();
    // }

    if (!this.validPassword(password, user.password)) {
      throw new InvalidEmailOrPasswordException();
    }

    const accessToken = this.accessTokenService.createToken(user);
    return { user, accessToken };
  }

  async logout(accessToken: string): Promise<any> {
    return this.accessTokenService.deleteToken(accessToken);
  }

  async resetPasswordCheckVerificationCode(verificationCode: string) {
    if (!verificationCode) {
      throw new InvalidInputException(i18n.__("verificationCode_is_required"));
    }

    const user = await User.findOne({ verificationCode, active: 1 });

    if (!user) {
      throw new InvalidInputException(i18n.__("verificationCode_not_valid"));
    }

    return user;
  }

  async resetPassword(verificationCode: string, password: string) {
    if (!password) {
      throw new InvalidInputException(i18n.__("password_required"));
    }

    if (!this.passwordCheckService.checkPasswordValidity(password)) {
      throw new InvalidInputException(i18n.__("complex_password_required"));
    }

    const user =
      await this.resetPasswordCheckVerificationCode(verificationCode);
    user.password = this.setPassword(password);
    // user.verificationCode = null;

    await user.save();
    return user;
  }

  async forgetPassword(email: string) {
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      active: 1,
    });

    if (!user) {
      throw new InvalidInputException(i18n.__("email_not_exist"));
    }

    // user.verificationCode = this.generateVerificationCode();
    await user.save();

    return true;
  }

  private generateVerificationCode(): string {
    const randomChars = "0123456789";
    let result = "";

    for (let i = 0; i < 5; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }

    return result;
  }

  private setPassword(password: string): string {
    const salt = "e!uAg+-C!3xTkT9F";
    return crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
  }

  public validPassword(password: string, dbHash: string): boolean {
    return this.setPassword(password) === dbHash;
  }

  isAdmin = (req: any, res: any, next: any) => {
    if (req.user.userType === this.userTypes.Admin) {
      next();
    } else {
      res.status(401).send({
        code: 401,
        message: i18n.__("unauthorized_access"),
      });
    }
  };

  // authenticate = (req: any, res: any, next: any) => {
  //   const token = req.headers["authorization"]?.split(" ")[1]; // استخراج التوكن من الـ headers

  //   if (!token) {
  //     return res.status(401).send({ message: "No token provided" });
  //   }

  //   jwt.verify(token, "your-secret-key", (err: any, decoded: any) => {
  //     if (err) {
  //       return res.status(401).send({ message: "Unauthorized" });
  //     }
  //     req.user = decoded; // حفظ بيانات المستخدم في request
  //     next();
  //   });
  // };

  authenticate(req: Request, res: Response, next: NextFunction) {
    console.log("Authenticating...");
    next();
  }
}
