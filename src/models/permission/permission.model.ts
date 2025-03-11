import { Schema, model } from "mongoose";
import { IPermission } from "./permission.interface";

const permissionSchema = new Schema<IPermission>(
  {
    name: { type: String, unique: true, required: true },
    displayName: { type: String, required: true },
    description: { type: String, required: true },
    screenId: { type: String, required: true },
    ACCESS: { type: Boolean, required: true },
    MENU_TYPE: {
      type: String,
      enum: ["main-menu", "sub-menu"],
      required: true,
    },
    ACCESS_LEVEL: { type: String, enum: ["ADMIN", "VIEW"], required: true },
  },
  { timestamps: true }
);

export const Permission = model<IPermission>("Permission", permissionSchema);
