import { Schema, model } from "mongoose";
import { IUser } from "./user.interface";
import { Status } from "../../commons/constants/constants";

const userSchema = new Schema<IUser>(
  {
    firebaseUID: { type: String, default: "" },
    deviceId: { type: String, default: "" },
    email: { type: String, required: true },
    password: { type: String },
    tempPassword: { type: String },
    phoneNumber: { type: String, required: true },
    firstName: { type: String, default: null }, // Can be null instead of undefined
    lastName: { type: String, default: null }, // Can be null instead of undefined
    image: [{ type: String }], // Changed from Object to String if images are URLs
    proEmail: { type: String, default: null }, // Can be null instead of undefined
    proId: { type: String },
    emailVerificationCode: { type: String, default: null }, // Can be null instead of undefined
    mobileVerificationCode: { type: String, default: null }, // Can be null instead of undefined
    roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }], // User-specific permissions (override role permissions)
    vanlynk: { type: String, default: null }, // Can be null instead of undefined
    leadgen: { type: String, default: null }, // Can be null instead of undefined
    companyName: { type: String, default: null }, // Can be null instead of undefined
    companyLogo: { type: String, default: null }, // Can be null instead of undefined
    isUserRegComplete: { type: Boolean, default: false }, // Changed from String to Boolean
    isLeadRegComplete: { type: Boolean, default: false }, // Changed from String to Boolean
    isVanlynkRegComplete: { type: Boolean, default: false }, // Changed from String to Boolean
    isVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    isDeactivated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
