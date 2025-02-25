import { Document } from "mongoose";

export interface IUser extends Document {
  deactivateDate: Date | null;
  password: string;
  email: string;
  phone: string;
  nameEn: string;
  nameAr: string;
  verificationCode: string | null;
  toJSON(): any;
}
