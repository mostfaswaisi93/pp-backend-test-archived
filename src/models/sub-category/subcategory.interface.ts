import { Document } from "mongoose";

export interface ISubCategory extends Document {
  _id: string;
  loginId?: string;
  proId?: string;
  createdAt: Date;
  updatedAt: Date;
}
