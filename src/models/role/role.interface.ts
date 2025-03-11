import mongoose from "mongoose";

export interface IRole {
  roleName: string;
  roleCode: string;
  roleDescription: string;
  permissions: mongoose.Types.ObjectId[];
  isAdminFlag: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
