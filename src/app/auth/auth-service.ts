import i18n from "i18n";
import bcrypt from "bcrypt";
import svgCaptcha from "svg-captcha";
import User from "../../models/user/user.model";
import { Logger } from "../../commons/libs/logger";
import AccessTokenService from "./access-token-service";
import {
  InvalidEmailOrPasswordException,
  TokenNotValidException,
} from "../../commons/errors/exceptions";

const logger = Logger.Instance;

export default class AuthService {
  private userData = User;
  private accessTokenService = AccessTokenService.Instance;
  private static _instance: AuthService;

  static get Instance(): AuthService {
    return this._instance ?? (this._instance = new this());
  }

  constructor() {}

  // ✅ User authentication
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new InvalidEmailOrPasswordException();
    }

    const user = await this.userData.findOne({ email });

    if (
      !user ||
      !user.password ||
      !(await this.isPasswordValid(password, user.password))
    ) {
      throw new InvalidEmailOrPasswordException();
    }

    const token = await this.accessTokenService.createToken(user);
    const { password: _, ...userWithoutPassword } = user.toObject();

    return { userWithoutPassword, token };
  }

  // ✅ User logout
  async logout(token: string): Promise<any> {
    if (!token) {
      logger.error("No token provided for logout.");
      throw new Error("Invalid token");
    }
    return this.accessTokenService.deleteToken(token);
  }

  // ✅ Middleware to authenticate users using JWT tokens
  authenticate = async (req: any, res: any, next: any) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new TokenNotValidException();
      }

      const { user, token: foundToken } =
        await this.accessTokenService.findToken(token);

      if (!user) {
        throw new TokenNotValidException();
      }

      req.user = user;
      req.token = foundToken;
      next();
    } catch (error: any) {
      logger.warn(`Authentication failed: ${error.message}`);
      res.status(401).json({ code: 401, message: i18n.__("token_not_valid") });
    }
  };

  // ✅ Validate password
  public async isPasswordValid(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // ✅ Forgot password
  async forgotPassword(email: string) {
    // Implementation goes here
  }

  // ✅ Reset password
  async resetPassword(verificationToken: string, newPassword: string) {
    // Implementation goes here
  }

  // ✅ Generate CAPTCHA
  generateCAPTCHA = () => {
    return svgCaptcha.create({
      color: true,
      background: "#8292ab",
      size: 5,
    });
  };

  // ✅ Middleware to authorize admin users
  checkAdmin = (req: any, res: any, next: any) => {
    let userTypes: any;
    // userTypes = {
    //   superadmin: 1,
    //   pro: 2,
    //   staff: 3,
    // };
    if (req.user?.userType === userTypes?.Admin) {
      return next();
    }
    return res.status(403).json({
      code: 403,
      message: i18n.__("unauthorized_access"),
    });
  };

  public async checkRole(
    requiredRole: string, // Check Role (like: "superadmin", "pro", "staff")
    req: any,
    res: any,
    next: any
  ): Promise<void> {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({
          code: 401,
          message: i18n.__("user_not_found"),
        });
      }

      const userRoles = await User.findById(userId).populate("roles");

      if (!userRoles || !userRoles.roles || userRoles.roles.length === 0) {
        return res.status(403).json({
          code: 403,
          message: i18n.__("user_has_no_roles"),
        });
      }

      const hasRequiredRole = userRoles.roles.some(
        (role: any) =>
          role.roleCode === requiredRole || role.roleName === requiredRole
      );

      if (hasRequiredRole) {
        return next();
      }

      return res.status(403).json({
        code: 403,
        message: i18n.__("unauthorized_access"),
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: i18n.__("server_error"),
      });
    }
  }
}
