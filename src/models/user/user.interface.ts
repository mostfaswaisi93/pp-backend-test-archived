// src/models/IUser.ts
import { Document } from "mongoose";

export interface IUser extends Document {
  deactivateDate: Date | null;
  active: number;
  password: string;
  email: string;
  userType: number;
  title: string;
  phone: string;
  nameEn: string;
  nameAr: string;
  directorGeneral: string;
  department: string;
  // userId: number;
  verificationCode: string | null;
  toJSON(): any;
}
