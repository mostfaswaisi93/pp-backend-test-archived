import mongoose from "mongoose";

export interface IRole {
  _id: string;
  roleName: string;
  roleCode: string;
  roleDescription: string;
  permissions: mongoose.Types.ObjectId[];
  isAdminFlag: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
