import User from "../../models/user/user.model";
import { Logger } from "../../commons/libs/logger";
import { Role } from "../../models/role/role.model";
import { Status } from "../../commons/constants/constants";
import { UserAccessService } from "../user/user-access-service";
import { IRole, RoleLevel } from "../../models/role/role.interface";
import {
  NotFoundException,
  InvalidInputException,
  UnauthorizedException,
} from "../../commons/errors/exceptions";

const logger = Logger.Instance;

export class RoleService {
  private static _instance: RoleService;
  private userAccessService = UserAccessService.Instance;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(
    roleData: Partial<IRole>,
    creatorUserId?: string
  ): Promise<IRole> {
    try {
      if (!roleData.name || !roleData.code || !roleData.level) {
        throw new InvalidInputException(
          "Role name, code, and level are required"
        );
      }

      const [nameExists, codeExists] = await Promise.all([
        Role.findOne({ name: roleData.name.trim().toUpperCase() }),
        Role.findOne({ code: roleData.code.trim().toUpperCase() }),
      ]);

      if (nameExists) {
        throw new InvalidInputException("Role name already exists");
      }
      if (codeExists) {
        throw new InvalidInputException("Role code already exists");
      }

      if (roleData.parentRole) {
        const parentRole = await Role.findById(roleData.parentRole);
        if (!parentRole) {
          throw new InvalidInputException("Parent role not found");
        }

        if (
          Object.values(RoleLevel).indexOf(roleData.level) <=
          Object.values(RoleLevel).indexOf(parentRole.level)
        ) {
          throw new InvalidInputException(
            "Child role level must be greater than parent role level"
          );
        }

        if (creatorUserId) {
          const canAssign = await this.userCanAssignRole(
            creatorUserId,
            roleData.parentRole.toString()
          );
          if (!canAssign) {
            throw new UnauthorizedException(
              "Cannot create role with this parent - insufficient permissions"
            );
          }
        }
      }

      const role = new Role({
        name: roleData.name.trim().toUpperCase(),
        code: roleData.code.trim().toUpperCase(),
        description: roleData.description?.trim(),
        permissions: roleData.permissions || [],
        parentRole: roleData.parentRole || null,
        childRoles: [],
        level: roleData.level,
        isAdmin: roleData.isAdmin || false,
        isSystemRole: roleData.isSystemRole || false,
        status: roleData.status ?? "ACTIVE",
      });

      const result = await role.save();

      logger.info("Role created successfully", { role: result });
      return result;
    } catch (error: any) {
      logger.error("Failed to create role", { error, roleData });
      throw error;
    }
  }

  public async getRoleById(_id: string) {
    try {
      const role = await Role.findById({ _id });
      if (!role) {
        logger.warn("Role not found by ID", { _id });
        throw new InvalidInputException("Role not found");
      }
      logger.info("Role retrieved by ID", { _id, role });
      return role;
    } catch (error: any) {
      logger.error("Failed to get role by ID", { error, _id });
      throw error;
    }
  }

  async getRoleHierarchy(roleId: string): Promise<IRole> {
    try {
      const role = await Role.findById(roleId)
        .populate("parentRole")
        .populate("childRoles")
        .populate("permissions");

      if (!role) {
        throw new NotFoundException("Role not found");
      }

      return role;
    } catch (error: any) {
      logger.error("Failed to get role hierarchy", { error, roleId });
      throw error;
    }
  }

  public async getRoles(status?: string, level?: string, fields?: string) {
    try {
      const filter: any = {};
      if (status) filter.status = status;
      if (level) filter.level = level;

      const projection = fields ? fields.split(",").join(" ") : "";

      const roles = await Role.find(filter, projection).sort({ name: -1 });

      if (roles.length === 0) {
        logger.warn("No roles found", { status, level, fields });
        throw new InvalidInputException("Roles not found");
      }

      logger.info("Roles retrieved", { count: roles.length });
      return roles;
    } catch (error: any) {
      logger.error("Failed to get roles", { error, status, level, fields });
      throw error;
    }
  }

  async getRolesWithHierarchy(): Promise<IRole[]> {
    try {
      const roles = await Role.find({ status: "ACTIVE" })
        .populate("parentRole")
        .populate("childRoles")
        .populate("permissions")
        .sort({ level: 1 });

      logger.info("Roles retrieved with hierarchy", { count: roles.length });
      return roles;
    } catch (error: any) {
      logger.error("Failed to get all roles with hierarchy", { error });
      throw error;
    }
  }

  public async update(_id: string, data: IRole) {
    try {
      const role = await Role.findOne({ _id });
      if (!role) {
        logger.warn("Role not found for update", { _id });
        throw new NotFoundException();
      }

      if (data.code && data.code !== role.code) {
        let roleExist = await Role.findOne({ code: data.code });
        if (roleExist && roleExist._id.toString() !== _id) {
          logger.warn("Attempt to update role to an existing code", {
            _id,
            newCode: data.code,
          });
          throw new InvalidInputException("Role code already exists");
        }
      }

      if (data.name && data.name !== role.name) {
        let roleExist = await Role.findOne({ name: data.name });
        if (roleExist && roleExist._id.toString() !== _id) {
          logger.warn("Attempt to update role to an existing name", {
            _id,
            newName: data.name,
          });
          throw new InvalidInputException("Role name already exists");
        }
      }

      const updatedRole = await Role.findByIdAndUpdate(
        _id,
        {
          $set: {
            name: data.name ?? role.name,
            code: data.code ?? role.code,
            description: data.description ?? role.description,
            permissions: data.permissions ?? role.permissions,
            parentRole: data.parentRole ?? role.parentRole,
            level: data.level ?? role.level,
            isAdmin: data.isAdmin ?? role.isAdmin,
            isSystemRole: data.isSystemRole ?? role.isSystemRole,
            status: data.status ?? role.status,
          },
        },
        { new: true, runValidators: true }
      );

      if (!updatedRole) {
        logger.warn("Role not found after update attempt", { _id });
        throw new InvalidInputException("Role not found");
      }

      logger.info("Role updated successfully", { _id, updatedRole });
      return updatedRole;
    } catch (error: any) {
      logger.error("Failed to update role", { error, _id, data });
      throw error;
    }
  }

  public async updateStatus(_id: string, data: IRole) {
    try {
      let role = await Role.findOne({ _id });
      if (!role) {
        logger.warn("Role not found for status update", { _id });
        throw new NotFoundException();
      }

      let updatedStatus = await Role.findByIdAndUpdate(
        _id,
        { $set: { status: data.status || role.status } },
        { new: true }
      );

      if (!updatedStatus) {
        logger.warn("Role not found after status update attempt", { _id });
        throw new InvalidInputException("Role not found");
      }

      logger.info("Role status updated successfully", { _id, updatedStatus });
      return updatedStatus;
    } catch (error: any) {
      logger.error("Failed to update role status", { error, _id, data });
      throw error;
    }
  }

  async userCanAssignRole(
    assignerUserId: string,
    targetRoleId: string
  ): Promise<boolean> {
    try {
      const assignerRoles =
        await this.userAccessService.getUserAllRoles(assignerUserId);
      const targetRole = await Role.findById(targetRoleId);
      if (!targetRole) return false;

      if (assignerRoles.some((role) => role.level === RoleLevel.SUPERADMIN)) {
        return true;
      }

      const assignerHighestLevelIndex = Math.min(
        ...assignerRoles.map((role) =>
          Object.values(RoleLevel).indexOf(role.level)
        )
      );

      const targetRoleLevelIndex = Object.values(RoleLevel).indexOf(
        targetRole.level
      );

      return targetRoleLevelIndex >= assignerHighestLevelIndex;
    } catch (error: any) {
      logger.error("Error checking role assignment permission", {
        error,
        assignerUserId,
        targetRoleId,
      });
      return false;
    }
  }

  async assignRoleToUser(
    assignerUserId: string,
    userId: string,
    roleId: string
  ): Promise<void> {
    try {
      const canAssign = await this.userCanAssignRole(assignerUserId, roleId);
      if (!canAssign) {
        throw new UnauthorizedException(
          "Cannot assign this role - insufficient permissions"
        );
      }

      const user = await User.findById(userId);
      if (!user) throw new NotFoundException("User not found");

      const role = await Role.findById(roleId);
      if (!role) throw new NotFoundException("Role not found");

      if (user.roles.some((r) => r.toString() === roleId)) {
        logger.warn("User already has this role", { userId, roleId });
        return;
      }

      user.roles.push(role._id);
      await user.save();

      logger.info("Role assigned to user successfully", {
        userId,
        roleId,
        assignerUserId,
      });
    } catch (error: any) {
      logger.error("Error assigning role to user", {
        error,
        assignerUserId,
        userId,
        roleId,
      });
      throw error;
    }
  }

  async removeRoleFromUser(
    assignerUserId: string,
    userId: string,
    roleId: string
  ): Promise<void> {
    try {
      const canAssign = await this.userCanAssignRole(assignerUserId, roleId);
      if (!canAssign) {
        throw new UnauthorizedException(
          "Cannot remove this role - insufficient permissions"
        );
      }

      const user = await User.findById(userId);
      if (!user) throw new NotFoundException("User not found");

      const hasRole = user.roles.some((r) => r.toString() === roleId);
      if (!hasRole) {
        logger.warn("User does not have this role", { userId, roleId });
        return;
      }

      user.roles = user.roles.filter((r) => r.toString() !== roleId);
      await user.save();

      logger.info("Role removed from user successfully", {
        userId,
        roleId,
        assignerUserId,
      });
    } catch (error: any) {
      logger.error("Error removing role from user", {
        error,
        assignerUserId,
        userId,
        roleId,
      });
      throw error;
    }
  }

  async getAssignableRolesByUser(assignerUserId: string): Promise<IRole[]> {
    try {
      const assignerRoles =
        await this.userAccessService.getUserAllRoles(assignerUserId);

      if (!assignerRoles || assignerRoles.length === 0) {
        logger.warn("Assigner user has no roles", { assignerUserId });
        return [];
      }

      const assignerHighestLevel = Math.min(
        ...assignerRoles.map((role) =>
          Object.values(RoleLevel).indexOf(role.level)
        )
      );

      const assignableRoles = await Role.find({
        status: "ACTIVE",
        level: { $gte: Object.values(RoleLevel)[assignerHighestLevel] },
      }).populate("permissions");

      logger.info("Assignable roles retrieved", {
        assignerUserId,
        count: assignableRoles.length,
      });

      return assignableRoles;
    } catch (error: any) {
      logger.error("Failed to get assignable roles", { error, assignerUserId });
      throw error;
    }
  }

  public async delete(_id: string) {
    try {
      const role = await Role.findById(_id);
      if (!role) {
        logger.warn("Role not found for deletion", { _id });
        throw new InvalidInputException("Role not found");
      }

      role.deletedAt = new Date();
      role.status = Status.ACTIVE;

      const updatedRole = await role.save();
      logger.info("Role soft deleted successfully", {
        _id,
        updatedRole,
      });

      return updatedRole;
    } catch (error: any) {
      logger.error("Failed to soft delete role", { error, _id });
      throw error;
    }
  }

  public async restore(_id: string): Promise<IRole> {
    try {
      const role = await Role.findById(_id);
      if (!role) {
        logger.warn("Role not found for restore", { _id });
        throw new InvalidInputException("Role not found");
      }

      role.deletedAt = null;
      role.status = Status.ACTIVE;

      const restoredRole = await role.save();

      logger.info("Role restored successfully", {
        _id,
        restoredRole,
      });

      return restoredRole;
    } catch (error: any) {
      logger.error("Failed to restore role", { error, _id });
      throw error;
    }
  }
}
