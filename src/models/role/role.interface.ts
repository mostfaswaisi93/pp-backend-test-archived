import mongoose, { Document } from "mongoose";
import { Status } from "../../commons/constants/constants";

export enum RoleLevel {
  SUPERADMIN = "SUPERADMIN",
  PRO = "PRO", // = ADMIN
  STAFF = "STAFF",
  CUSTOMER = "CUST",
  VANCUSTOMER = "VANCUST",
}

export interface IRole extends Document {
  _id: mongoose.Types.ObjectId;
  name: string; // Unique name for the role
  code: string; // Unique code for the role
  description?: string; // Description of the role
  permissions: (mongoose.Types.ObjectId | string)[];
  parentRole?: mongoose.Types.ObjectId | string; // Reference to parent role
  childRoles?: (mongoose.Types.ObjectId | string)[]; // References to child roles
  level: RoleLevel; // Role level
  isAdmin?: boolean; // Is the role an admin role?
  isSystemRole?: boolean; // Cannot be deleted if true
  status: Status;
  deletedAt?: Date | null; // Soft delete improvement
  createdAt?: Date;
  updatedAt?: Date;
}
