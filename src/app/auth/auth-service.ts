import i18n from "i18n";
import bcrypt from "bcrypt";
import svgCaptcha from "svg-captcha";
import User from "../../models/user/user.model";
import { Logger } from "../../commons/libs/logger";
import AccessTokenService from "./access-token-service";
import { InvalidEmailOrPasswordException } from "../../commons/errors/exceptions";
import { Role } from "../../models/role/role.model";

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

    const data = await this.userData.findOne({ email });

    if (
      !data ||
      !data.password ||
      !(await this.validPassword(password, data.password))
    ) {
      throw new InvalidEmailOrPasswordException();
    }

    const token = await this.accessTokenService.createToken(data);
    const { password: _, ...userWithoutPassword } = data.toObject();

    return { userWithoutPassword, token };
  }

  // ✅ User logout
  async logout(token: string): Promise<any> {
    if (!token) {
      logger.error("No token provided to logout.");
      throw new Error("Invalid token");
    }
    return this.accessTokenService.deleteToken(token);
  }

  // ✅ JWT Authentication middleware
  authenticate = async (req: any, res: any, next: any) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({
        code: 401,
        message: i18n.__("token_not_valid"),
      });
    }

    try {
      const payload = await this.accessTokenService.findToken(token);

      if (!payload) {
        return res
          .status(401)
          .json({ message: "Access denied: Invalid token" });
      }

      req.user = payload;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Access denied: Invalid token" });
    }
  };

  async verifyUserRole(email: string) {
    const user = await this.userData
      .findOne(
        { email },
        {
          phoneNumber: 1,
          roles: 1,
          _id: 1,
          email: 1,
          status: 1,
          isVanlynkRegComplete: 1,
          isLeadRegComplete: 1,
          isUserRegComplete: 1,
        }
      )
      .populate("roles", "roleCode roleDescription");

    return user;
  }

  // ✅ Validate password
  public async validPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compareSync(password, hashedPassword);
  }

  // ✅ Forgot password
  async forgotPassword(email: string) {}

  // ✅ Reset password
  async resetPassword(verificationToken: any, password: any) {}

  // ✅ Generate CAPTCHA
  generateCAPTCHA = async () => {
    return await svgCaptcha.create({
      color: true,
      background: "#8292ab",
      size: 5,
    });
  };

  // ✅ Admin authorization middleware
  checkAdmin = (req: any, res: any, next: any) => {
    let userTypes: any;
    // userTypes = {
    //   superadmin: 1,
    //   pro: 2,
    //   staff: 3,
    // };
    if (req.user.userType === userTypes?.Admin) {
      next();
    } else {
      res.status(401).send({
        code: 401,
        message: i18n.__("unauthorized_access"),
      });
    }
  };
}
