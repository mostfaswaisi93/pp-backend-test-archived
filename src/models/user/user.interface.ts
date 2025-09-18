import mongoose, { Document } from "mongoose";
import { Status } from "../../commons/constants/constants";

export interface IUser extends Document {
  _id: string;
  firebaseUID: string; // Changed firebaseId to firebaseUID
  deviceId: string; // Changed deviceIdId to deviceId
  email: string; // Changed emailId to email
  password?: string;
  tempPassword?: string;
  phoneNumber: string; // Changed mobileNumber to phoneNumber
  firstName?: string | null; // Changed string? to string | null
  lastName?: string | null; // Changed string? to string | null
  image: string[]; // Changed object[] to string[] if images are URLs
  proEmail?: string; // Changed proEmailId to proEmail
  proId?: string;
  emailVerificationCode?: string;
  mobileVerificationCode?: string;
  roles: mongoose.Types.ObjectId[]; // Array of role references { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true }
  permissions: mongoose.Types.ObjectId[]; // User-specific permissions (override role permissions)
  vanlynk?: string;
  leadgen?: string;
  companyName?: string;
  companyLogo?: string;
  isUserRegComplete?: boolean; // Changed userRegCompletedFlag to isUserRegComplete
  isLeadRegComplete?: boolean; // Changed leadRegCompletedFlag to isLeadRegComplete
  isVanlynkRegComplete?: boolean; // Changed vanlynkRegCompletedFlag to isVanlynkRegComplete
  isVerified: boolean;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  status: Status;
  isDeleted: boolean;
  isDeactivated: boolean;
}
