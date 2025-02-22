import { Document } from "mongoose";

export interface IUser extends Document {
  nameAr: string;
  nameEn: string;
  email: string;
  password: string;
  active: boolean;
  updatedBy: string;
  department?: string;
  verificationCode?: string;
  directorGeneral?: string;
  // agency?: IAgency;
  title?: string;
  userType?: string;
  deactivateDate?: Date;
}
