import mongoose from "mongoose";

export interface IRole {
  _id: string;
  name: string;
  code?: string;
  description?: string;
  permissions: mongoose.Types.ObjectId[];
  isAdmin?: boolean;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}
