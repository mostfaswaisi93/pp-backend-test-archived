import mongoose, { Schema, model } from "mongoose";
import { IRole } from "./role.interface";

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String },
    description: { type: String },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
    isAdmin: { type: Boolean },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      required: true,
    },
  },
  { timestamps: true }
);

export const Role = model<IRole>("Role", roleSchema);
