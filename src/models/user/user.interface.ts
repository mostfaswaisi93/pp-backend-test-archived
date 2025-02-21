import { Document } from "mongoose";

export interface IUser extends Document {
  nameAr: string;
  nameEn: string;
  email: string;
  password: string;
  active: boolean;
  updatedBy: string;
  department?: string;
  directorGeneral?: string;
  agency?: string;
  title?: string;
  userType?: string;
  deactivateDate?: Date;
}
