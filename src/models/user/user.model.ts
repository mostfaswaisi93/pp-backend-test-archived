import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import * as i18n from "i18n";
import { IUser } from "./user.interface";

const UserSchema = new Schema<IUser>(
  {
    deactivateDate: { type: Date, default: null },
    // active: { type: Number, required: true },
    password: { type: String, required: true, minlength: 8 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // userType: { type: Number, required: true },
    // title: { type: String, required: true },
    phone: { type: String, required: true, maxlength: 15 },
    nameEn: { type: String, required: true },
    nameAr: { type: String, required: true },
    // directorGeneral: { type: String, required: true },
    // department: { type: String, required: true },
    verificationCode: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified("email")) {
    this.email = this.email.trim().toLowerCase();
  }
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.verificationCode;
  user["name"] = i18n.getLocale() === "en" ? user.nameEn : user.nameAr;
  return user;
};

const User = model<IUser>("User", UserSchema);

export default User;
