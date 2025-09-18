import mongoose, { Document } from "mongoose";

export enum MenuType {
  SUB_MENU = "sub-menu",
  MAIN_MENU = "main-menu",
}

export enum AccessLevel {
  ADMIN = "ADMIN",
  READ_WRITE = "READ_WRITE",
  READ_ONLY = "READ_ONLY",
  WRITE_ONLY = "WRITE_ONLY",

  SUPERADMIN = "SUPERADMIN",
  EDIT = "EDIT",
  VIEW = "VIEW",
}

export enum PermissionAction {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  APPROVE = "APPROVE",
  EXPORT = "EXPORT",
  IMPORT = "IMPORT",
  SHARE = "SHARE",
  MANAGE = "MANAGE",
}

export interface IPermission extends Document {
  _id: mongoose.Types.ObjectId;
  name: string; // Unique identifier like "create__estimate"
  displayName: string; // Human readable name like "Create Estimate"
  description?: string; // Description of what this permission does
  action: PermissionAction; // Action type
  screenId?: string; // For UI permissions like "/estimates/create"
  isActive: boolean; // Active/inactive flag
  menuType: MenuType; // For UI categorization
  accessLevel: AccessLevel; // Access level for this permission
  isSystemPermission?: boolean; // Cannot be deleted if true
  deletedAt?: Date | null; // Soft delete improvement
  createdAt: Date;
  updatedAt: Date;
}
