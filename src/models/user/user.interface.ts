import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  nameAr: string;
  nameEn: string;
  email: string;
  phone: string; // ✅ إضافة الحقل المفقود
  password: string;
  active: boolean;
  verificationCode?: string;
  updatedBy: string;
  department?: string;
  directorGeneral?: string;
  agency?: string;
  title?: string;
  userType?: string;
  deactivateDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
