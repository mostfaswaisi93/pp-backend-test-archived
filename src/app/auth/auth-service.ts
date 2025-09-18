import i18n from "i18n";
import bcrypt from "bcrypt";
import svgCaptcha from "svg-captcha";
import User from "../../models/user/user.model";
import { Logger } from "../../commons/libs/logger";
import AccessTokenService from "./access-token-service";
import { RoleLevel } from "../../models/role/role.interface";
import { PermissionAction } from "../../models/permission/permission.interface";
import {
  TokenNotValidException,
  InvalidEmailOrPasswordException,
} from "../../commons/errors/exceptions";
import { UserAccessService } from "../user/user-access-service";

const logger = Logger.Instance;
const userAccessService = UserAccessService.Instance;

export default class AuthService {
  private userData = User;
  private accessTokenService = AccessTokenService.Instance;
  private static _instance: AuthService;

  static get Instance(): AuthService {
    return this._instance ?? (this._instance = new this());
  }

  constructor() {}

  public authenticate = async (request: any, response: any, next: any) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) throw new TokenNotValidException();

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

      const { user, token: foundToken } =
        await this.accessTokenService.refreshToken(token);

      if (!user) throw new TokenNotValidException();

      request.user = user;
      request.token = foundToken;

      if (foundToken !== token) {
        response.setHeader("x-access-token", foundToken);
        logger.info(`Token sent back to client in header: ${user.email}`);
      }

      next();
    } catch (error: any) {
      logger.warn(`Authentication failed: ${error.message}`);
      response
        .status(401)
        .json({ code: 401, message: i18n.__("token_not_valid") });
    }
  };

  // ✅ User authentication (login)
  async login(email: string, password: string) {
    if (!email || !password) throw new InvalidEmailOrPasswordException();

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
  async logout(token: string): Promise<void> {
    if (!token) {
      logger.error("No token provided for logout.");
      throw new TokenNotValidException();
    }
    await this.accessTokenService.deleteToken(token);
  }

  // ✅ Validate password
  public async isPasswordValid(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // ✅ Generate CAPTCHA
  generateCAPTCHA = (): svgCaptcha.CaptchaObj => {
    return svgCaptcha.create({
      color: true,
      background: "#8292ab",
      size: 5,
    });
  };

  // ✅ Role-based access
  public checkRole(requiredRole: string) {
    return async (request: any, response: any, next: any) => {
      try {
        const userId = request.user?._id;
        if (!userId)
          return response
            .status(401)
            .json({ code: 401, message: i18n.__("user_not_found") });

        const hasRole = await userAccessService.userHasRole(
          userId,
          requiredRole
        );
        if (hasRole) return next();

        return response
          .status(403)
          .json({ code: 403, message: i18n.__("unauthorized_access") });
      } catch (error) {
        logger.error("Role check failed", { error, requiredRole });
        return response
          .status(500)
          .json({ code: 500, message: i18n.__("server_error") });
      }
    };
  }

  // ✅ Role-based access (multiple roles)
  public checkRoles(requiredRoles: string[]) {
    return async (request: any, response: any, next: any) => {
      try {
        const userId = request.user?._id;
        if (!userId)
          return response
            .status(401)
            .json({ code: 401, message: i18n.__("user_not_found") });

        const hasAnyRole = await userAccessService.userHasAnyRole(
          userId,
          requiredRoles
        );
        if (hasAnyRole) return next();

        return response
          .status(403)
          .json({ code: 403, message: i18n.__("unauthorized_access") });
      } catch (error) {
        logger.error("Roles check failed", { error, requiredRoles });
        return response
          .status(500)
          .json({ code: 500, message: i18n.__("server_error") });
      }
    };
  }

  // ✅ Permission-based access
  public checkPermission(requiredPermission: string) {
    return async (request: any, response: any, next: any) => {
      try {
        const userId = request.user?._id;
        if (!userId)
          return response
            .status(401)
            .json({ code: 401, message: i18n.__("user_not_found") });

        const hasPermission = await userAccessService.userHasPermission(
          userId,
          requiredPermission
        );
        if (hasPermission) return next();

        return response
          .status(403)
          .json({ code: 403, message: i18n.__("unauthorized_access") });
      } catch (error) {
        logger.error("Permission check failed", { error, requiredPermission });
        return response
          .status(500)
          .json({ code: 500, message: i18n.__("server_error") });
      }
    };
  }

  // ✅ Check email existence
  public async checkEmailId(emailId: string): Promise<any[]> {
    const data = await User.find({ email: emailId });
    if (!data.length) return [];
    return data.map((el) => ({
      emailId: el.email,
      fireBaseId: el.firebaseUID,
      deviceId: el.deviceId,
    }));
  }

  // ✅ Check Pro user status
  public async checkProStatus(ProEmailId: string) {
    const user = await this.userData.findOne({ email: ProEmailId });
    if (!user) throw new Error("LoginId Not found.");

    return {
      status: user.status,
      emailId: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  // ✅ Update user profile
  public async updateUserProfile(email: string, updatedData: Partial<any>) {
    const user = await this.userData.findOne({ email });
    if (!user) throw new Error("User not found.");

    Object.assign(user, updatedData);
    await user.save();

    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  // ✅ Forgot password method
  public async forgotPassword(emailId: string) {
    const user = await this.userData.findOne({ email: emailId });
    if (!user) throw new InvalidEmailOrPasswordException();

    const token = await this.accessTokenService.createToken(user);
    return { token, email: user.email };
  }

  // ✅ Reset password method
  public async resetPassword(verificationToken: string, newPassword: string) {
    const { user } = await this.accessTokenService.findToken(verificationToken);
    if (!user) throw new TokenNotValidException();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userData.updateOne(
      { _id: user.userId },
      { password: hashedPassword }
    );
    await this.accessTokenService.deleteToken(verificationToken);

    return { message: "Password reset successful" };
  }

  // ✅ Update Vanlynk registration status
  public async updateVanRegFlag(
    emailId: string,
    vanlynkRegCompletedFlag: boolean
  ) {
    const result = await this.userData.updateOne(
      { email: emailId },
      { vanlynkRegCompletedFlag },
      { upsert: true }
    );
    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      throw new Error("Vanlynk Registration Status unsuccessful");
    }
    return result;
  }

  // ✅ Update Lead Registration status
  public async updateLeadRegStatus(
    emailId: string,
    leadRegCompletedFlag: boolean
  ): Promise<any> {
    const result = await this.userData.updateOne(
      { email: emailId },
      { leadRegCompletedFlag },
      { upsert: true }
    );
    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      throw new Error("Lead Registration Status unsuccessful");
    }
    return result;
  }

  // ✅ Get forgot password verification method
  public async getForgotPasswordVerifyMethod(
    emailId: string,
    roleCode?: string
  ) {
    const user = await this.userData
      .findOne({
        email: emailId, // Fixed: should be 'email' not 'emailId'
      })
      .populate("roles");

    if (!user) {
      throw new InvalidEmailOrPasswordException();
    }

    // If roleCode is provided, verify user has that role
    if (roleCode) {
      const hasRole = await userAccessService.userHasRole(user._id, roleCode);
      if (!hasRole) {
        throw new InvalidEmailOrPasswordException();
      }
    }

    const userRoles = await userAccessService.getUserAllRoles(user._id);

    return {
      id: user._id,
      status: user.status,
      firstName: user.firstName,
      lastName: user.lastName,
      proId: user.proId,
      image: user.image,
      roles: userRoles.map((role: any) => ({
        id: role._id,
        name: role.name,
        code: role.code,
        level: role.level,
      })),
      vanlynk: user.vanlynk,
      leadgen: user.leadgen,
      companyName: user.companyName,
      companyLogo: user.companyLogo,
    };
  }

  // ✅ Admin sign-in as Pro user
  public async adminSignInAsPro(adminEmail: string, proEmail: string) {
    const adminUser = await this.userData.findOne({ email: adminEmail });
    if (!adminUser) throw new Error("Admin not found.");

    // Check if admin user has admin or superadmin role
    const isAdmin = await userAccessService.userHasAnyRole(adminUser._id, [
      "admin",
      "SUPERADMIN",
    ]);
    if (!isAdmin) throw new Error("Unauthorized: Not an admin user.");

    const proUser = await this.userData.findOne({ email: proEmail });
    if (!proUser) throw new Error("Pro user not found.");

    const token = await this.accessTokenService.createToken(proUser);
    const { password: _, ...userWithoutPassword } = proUser.toObject();

    return { userWithoutPassword, token };
  }

  public checkPermissionForAction(action: PermissionAction) {
    return async (request: any, response: any, next: any) => {
      try {
        const userId = request.user?._id;
        if (!userId)
          return response
            .status(401)
            .json({ code: 401, message: i18n.__("user_not_found") });

        const hasPermission =
          await userAccessService.userHasPermissionForAction(
            userId,
            action,
            action,
            action
          );

        if (hasPermission) return next();

        return response
          .status(403)
          .json({ code: 403, message: i18n.__("unauthorized_access") });
      } catch (error) {
        logger.error("Permission action check failed", { error, action });
        return response
          .status(500)
          .json({ code: 500, message: i18n.__("server_error") });
      }
    };
  }

  public checkRoleLevel(requiredLevel: RoleLevel) {
    return async (request: any, response: any, next: any) => {
      try {
        const userId = request.user?._id;
        if (!userId)
          return response
            .status(401)
            .json({ code: 401, message: i18n.__("user_not_found") });

        const canAccess = await userAccessService.userCanAccessResourceByLevel(
          userId,
          requiredLevel
        );
        if (canAccess) return next();

        return response
          .status(403)
          .json({ code: 403, message: i18n.__("unauthorized_access") });
      } catch (error) {
        logger.error("Role level check failed", { error, requiredLevel });
        return response
          .status(500)
          .json({ code: 500, message: i18n.__("server_error") });
      }
    };
  }

  public async getUserEffectivePermissions(userId: string) {
    try {
      return await userAccessService.getUserEffectivePermissionNames(userId);
    } catch (error: any) {
      logger.error("Error getting user effective permissions", {
        error,
        userId,
      });
      throw error;
    }
  }

  public async getUserRolesWithHierarchy(userId: string) {
    try {
      return await userAccessService.getUserAllRoles(userId);
    } catch (error: any) {
      logger.error("Error getting user roles with hierarchy", {
        error,
        userId,
      });
      throw error;
    }
  }
}
