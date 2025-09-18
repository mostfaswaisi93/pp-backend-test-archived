import { Schema, model } from "mongoose";
import {
  MenuType,
  AccessLevel,
  IPermission,
  PermissionAction,
} from "./permission.interface";

const permissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 100,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    action: {
      type: String,
      enum: Object.values(PermissionAction),
      required: true,
    },
    screenId: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    menuType: {
      type: String,
      enum: Object.values(MenuType),
      default: MenuType.MAIN_MENU,
    },
    accessLevel: {
      type: String,
      enum: Object.values(AccessLevel),
      default: AccessLevel.READ_ONLY,
    },
    isSystemPermission: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

permissionSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);
permissionSchema.index({ screenId: 1 });
permissionSchema.index({ screenId: 1, isActive: 1 });

export const Permission = model<IPermission>("Permission", permissionSchema);
