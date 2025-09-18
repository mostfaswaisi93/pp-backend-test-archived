import mongoose, { Schema, model } from "mongoose";
import { IRole, RoleLevel } from "./role.interface";
import { Status } from "../../commons/constants/constants";

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 50,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 20,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
    parentRole: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    childRoles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    level: {
      type: String,
      enum: Object.values(RoleLevel),
      required: true,
    },
    isAdmin: { type: Boolean, default: false },
    isSystemRole: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

roleSchema.index({ name: 1 }, { unique: true });
roleSchema.index({ code: 1 }, { unique: true });
roleSchema.index({ level: 1 });
roleSchema.index({ parentRole: 1 });

// ✅ Pre-save middleware to handle hierarchy
roleSchema.pre<IRole>("save", async function (next) {
  if (this.isNew && this.parentRole) {
    await (this.constructor as mongoose.Model<IRole>).findByIdAndUpdate(
      this.parentRole,
      { $addToSet: { childRoles: this._id } }
    );
  }
  next();
});

// ✅ Pre-remove middleware to clean up hierarchy
roleSchema.pre<IRole>(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    if (this.parentRole) {
      await (this.constructor as mongoose.Model<IRole>).findByIdAndUpdate(
        this.parentRole,
        { $pull: { childRoles: this._id } }
      );
    }

    await (this.constructor as mongoose.Model<IRole>).updateMany(
      { parentRole: this._id },
      { $unset: { parentRole: 1 } }
    );

    next();
  }
);

export const Role = model<IRole>("Role", roleSchema);
