import User from "../../models/user/user.model";
import { Logger } from "../../commons/libs/logger";
import { IRole, RoleLevel } from "../../models/role/role.interface";
import { NotFoundException } from "../../commons/errors/exceptions";
import {
  IPermission,
  PermissionAction,
} from "../../models/permission/permission.interface";

const logger = Logger.Instance;

export class UserAccessService {
  private static _instance: UserAccessService;

  static get Instance(): UserAccessService {
    return this._instance ?? (this._instance = new this());
  }

  public async userHasRole(userId: string, roleCode: string): Promise<boolean> {
    try {
      const user = await User.findById(userId).populate("roles");

      if (!user) return false;

      const normalizedCode = roleCode.toUpperCase();

      return (user.roles as any[]).some(
        (role) => role.code.toUpperCase() === normalizedCode
      );
    } catch (error: any) {
      logger.error("Error checking user role", { error, userId, roleCode });
      return false;
    }
  }

  async userHasAnyRole(userId: string, roleCodes: string[]): Promise<boolean> {
    try {
      for (const roleCode of roleCodes) {
        const hasRole = await this.userHasRole(userId, roleCode);
        if (hasRole) return true;
      }
      return false;
    } catch (error: any) {
      logger.error("Error checking user roles", { error, userId, roleCodes });
      return false;
    }
  }

  async userHasPermission(
    userId: string,
    permissionName: string
  ): Promise<boolean> {
    try {
      const user = await User.findById(userId)
        .populate({
          path: "roles",
          populate: { path: "permissions" },
        })
        .populate("permissions");

      if (!user) return false;

      const permissions = new Set<string>();

      const userRoles = user.roles as any[];
      for (const role of userRoles) {
        const rolePermissions = role.permissions || [];
        rolePermissions.forEach((perm: any) => {
          if (perm.isActive) {
            permissions.add(perm.name);
          }
        });
      }

      const userSpecificPermissions =
        user.permissions as unknown as IPermission[];
      userSpecificPermissions.forEach((perm: IPermission) => {
        if (perm.isActive) {
          permissions.add(perm.name);
        } else {
          permissions.delete(perm.name);
        }
      });

      return Array.from(permissions).includes(permissionName);
    } catch (error: any) {
      logger.error("Error checking user permission", {
        error,
        userId,
        permissionName,
      });
      return false;
    }
  }

  async userHasPermissionForAction(
    userId: string,
    category: string,
    action: PermissionAction,
    resource?: string
  ): Promise<boolean> {
    const permissionName = resource
      ? `${category.toLowerCase()}.${action.toLowerCase()}.${resource}`
      : `${category.toLowerCase()}.${action.toLowerCase()}`;

    return await this.userHasPermission(userId, permissionName);
  }

  async getUserAllPermissions(userId: string): Promise<IPermission[]> {
    try {
      const user = await User.findById(userId)
        .populate({
          path: "roles",
          populate: { path: "permissions" },
        })
        .populate("permissions");

      if (!user) throw new NotFoundException("User not found");

      const permissions = new Map<string, IPermission>();

      const userRoles = user.roles as any[];
      for (const role of userRoles) {
        const rolePermissions = role.permissions || [];
        rolePermissions.forEach((perm: IPermission) => {
          if (perm.isActive) {
            permissions.set(perm.name, perm);
          }
        });
      }

      const userPermissions = user.permissions as unknown as IPermission[];
      userPermissions.forEach((perm: IPermission) => {
        if (perm.isActive) {
          permissions.set(perm.name, perm);
        } else {
          permissions.delete(perm.name);
        }
      });

      return Array.from(permissions.values());
    } catch (error: any) {
      logger.error("Error getting user permissions", { error, userId });
      throw error;
    }
  }

  async getUserAllRoles(userId: string): Promise<IRole[]> {
    try {
      const user = await User.findById(userId).populate({
        path: "roles",
        populate: { path: "parentRole childRoles" },
      });

      if (!user) throw new NotFoundException("User not found");

      return user.roles as unknown as IRole[];
    } catch (error: any) {
      logger.error("Error getting user roles", { error, userId });
      throw error;
    }
  }

  async userCanAccessResourceByLevel(
    userId: string,
    requiredLevel: RoleLevel
  ): Promise<boolean> {
    try {
      const userRoles = await this.getUserAllRoles(userId);
      // const userHighestLevel = Math.min(...userRoles.map((role) => role.level));

      // return userHighestLevel <= requiredLevel;
      return true;
    } catch (error: any) {
      logger.error("Error checking resource access", {
        error,
        userId,
        requiredLevel,
      });
      return false;
    }
  }

  async getUserEffectivePermissionNames(userId: string): Promise<string[]> {
    try {
      const permissions = await this.getUserAllPermissions(userId);
      return permissions.map((perm) => perm.name);
    } catch (error: any) {
      logger.error("Error getting effective permissions", { error, userId });
      return [];
    }
  }
}
