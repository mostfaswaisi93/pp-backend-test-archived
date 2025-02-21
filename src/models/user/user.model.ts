import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.interface";

const UserSchema: Schema = new Schema(
  {
    nameAr: { type: String, required: true },
    nameEn: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    },
    password: { type: String, required: true },
    active: { type: Boolean, default: true },
    updatedBy: { type: String, required: true },
    department: { type: String },
    directorGeneral: { type: String },
    agency: { type: String },
    title: { type: String },
    userType: { type: String },
    deactivateDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>("save", function (next) {
  if (
    this.email &&
    !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(this.email)
  ) {
    return next(new Error("Invalid email format"));
  }
  next();
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
