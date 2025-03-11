import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  firebaseUID: string; // Changed firebaseId to firebaseUID
  deviceId: string;
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
  rbac: object[]; // It is preferable to specify a more defined data type instead of object[]
  roles: mongoose.Types.ObjectId[]; // مصفوفة تحتوي على دور واحد فقط
  permissions: string[]; // Array of Permission IDs (if granted individually)
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
  status: string;
  isDeleted: boolean;
  isDeactivated: boolean;
}
