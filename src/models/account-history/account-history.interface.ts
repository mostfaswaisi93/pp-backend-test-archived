import mongoose, { Document } from "mongoose";

export interface IAccountHistory extends Document {
  proId?: mongoose.Types.ObjectId;
  proLoginId?: mongoose.Types.ObjectId;
  status?: string;
  notes?: string;
  file?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
