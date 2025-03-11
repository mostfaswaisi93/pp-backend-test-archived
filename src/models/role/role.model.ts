import mongoose, { Schema, model } from "mongoose";
import { IRole } from "./role.interface";

const roleSchema = new Schema<IRole>(
  {
    roleName: { type: String, required: true, unique: true },
    roleCode: { type: String },
    roleDescription: { type: String },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
    isAdminFlag: { type: Boolean },
    status: { type: String, default: "ACTIVE", required: true },
  },
  { timestamps: true }
);

export const Role = model<IRole>("Role", roleSchema);
