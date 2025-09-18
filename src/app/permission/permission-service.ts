import { Logger } from "../../commons/libs/logger";
import { Permission } from "../../models/permission/permission.model";
import {
  MenuType,
  AccessLevel,
  IPermission,
  PermissionAction,
} from "../../models/permission/permission.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

const logger = Logger.Instance;

export class PermissionService {
  private static _instance: PermissionService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  public async create(data: Partial<IPermission>) {
    try {
      if (
        !data.name ||
        typeof data.name !== "string" ||
        data.name.trim() === ""
      ) {
        throw new InvalidInputException(
          "Permission name is required and must be a valid string"
        );
      }

      if (!data.displayName || typeof data.displayName !== "string") {
        throw new InvalidInputException("Display name is required");
      }

      if (
        !data.action ||
        !Object.values(PermissionAction).includes(data.action)
      ) {
        throw new InvalidInputException(
          "Invalid or missing action for permission"
        );
      }

      const existingPermission = await Permission.findOne({
        name: data.name.toLowerCase(),
      }).collation({ locale: "en", strength: 2 });

      if (existingPermission) {
        logger.warn("Attempt to create existing permission", {
          name: data.name,
        });
        throw new InvalidInputException("Permission name already exists");
      }

      const permission = new Permission({
        name: data.name.toLowerCase(),
        displayName: data.displayName.trim(),
        description: data.description?.trim(),
        action: data.action,
        screenId: data.screenId?.trim(),
        isActive: data.isActive ?? true,
        menuType: data.menuType ?? MenuType.MAIN_MENU,
        accessLevel: data.accessLevel ?? AccessLevel.READ_ONLY,
        isSystemPermission: data.isSystemPermission ?? false,
      });

      const result = await permission.save();
      logger.info("Permission created successfully", { permission: result });

      return result;
    } catch (error: any) {
      logger.error("Failed to create permission", { error, data });
      throw error;
    }
  }

  public async getPermissionById(_id: string) {
    try {
      const permission = await Permission.findById(_id);
      if (!permission) {
        logger.warn("Permission not found by ID", { _id });
        throw new InvalidInputException("Permission not found");
      }
      logger.info("Permission retrieved by ID", { _id, permission });
      return permission;
    } catch (error: any) {
      logger.error("Failed to get permission by ID", { error, _id });
      throw error;
    }
  }

  public async getPermissions(isActive?: boolean, fields?: string) {
    try {
      const filter: any = { deletedAt: null };
      if (typeof isActive !== "undefined") {
        filter.isActive = isActive;
      }

      const projection = fields ? fields.split(",").join(" ") : "";

      const permissions = await Permission.find(filter, projection).sort({
        name: -1,
      });

      if (permissions.length === 0) {
        logger.warn("No permissions found", { isActive, fields });
        throw new InvalidInputException("Permissions not found");
      }

      logger.info("Permissions retrieved", { count: permissions.length });
      return permissions;
    } catch (error: any) {
      logger.error("Failed to get permissions", { error, isActive, fields });
      throw error;
    }
  }

  public async update(_id: string, data: Partial<IPermission>) {
    try {
      const permission = await Permission.findById(_id);
      if (!permission) {
        logger.warn("Permission not found for update", { _id });
        throw new NotFoundException("Permission not found");
      }

      if (data.name && data.name !== permission.name) {
        const existingPermission = await Permission.findOne({
          name: data.name.toLowerCase(),
        }).collation({ locale: "en", strength: 2 });

        if (existingPermission && existingPermission._id.toString() !== _id) {
          logger.warn("Attempt to update permission to an existing name", {
            _id,
            newName: data.name,
          });
          throw new InvalidInputException("Permission name already exists");
        }
      }

      permission.name = data.name?.toLowerCase() ?? permission.name;
      permission.displayName = data.displayName ?? permission.displayName;
      permission.description = data.description ?? permission.description;
      permission.screenId = data.screenId ?? permission.screenId;
      permission.action = data.action ?? permission.action;
      permission.isActive = data.isActive ?? permission.isActive;
      permission.menuType = data.menuType ?? permission.menuType;
      permission.accessLevel = data.accessLevel ?? permission.accessLevel;

      const updatedPermission = await permission.save();
      logger.info("Permission updated successfully", {
        _id,
        updatedPermission,
      });
      return updatedPermission;
    } catch (error: any) {
      logger.error("Failed to update permission", { error, _id, data });
      throw error;
    }
  }

  public async updateStatus(_id: string, isActive: boolean) {
    try {
      const permission = await Permission.findByIdAndUpdate(
        _id,
        { $set: { isActive } },
        { new: true }
      );

      if (!permission) {
        logger.warn("Permission not found after status update attempt", {
          _id,
        });
        throw new InvalidInputException("Permission not found");
      }

      logger.info("Permission status updated successfully", {
        _id,
        permission,
      });
      return permission;
    } catch (error: any) {
      logger.error("Failed to update permission status", {
        error,
        _id,
        isActive,
      });
      throw error;
    }
  }

  public async delete(_id: string) {
    try {
      const permission = await Permission.findById(_id);
      if (!permission) {
        logger.warn("Permission not found for deletion", { _id });
        throw new InvalidInputException("Permission not found");
      }

      permission.deletedAt = new Date();
      permission.isActive = false;

      const updatedPermission = await permission.save();
      logger.info("Permission soft deleted successfully", {
        _id,
        updatedPermission,
      });

      return updatedPermission;
    } catch (error: any) {
      logger.error("Failed to soft delete permission", { error, _id });
      throw error;
    }
  }

  public async restore(_id: string) {
    try {
      const permission = await Permission.findById(_id);
      if (!permission) {
        logger.warn("Permission not found for restore", { _id });
        throw new InvalidInputException("Permission not found");
      }

      permission.deletedAt = null;
      permission.isActive = true;

      const restoredPermission = await permission.save();
      logger.info("Permission restored successfully", {
        _id,
        restoredPermission,
      });

      return restoredPermission;
    } catch (error: any) {
      logger.error("Failed to restore permission", { error, _id });
      throw error;
    }
  }
}
