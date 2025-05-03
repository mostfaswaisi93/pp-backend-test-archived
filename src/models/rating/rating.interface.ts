import mongoose, { Document } from "mongoose";

export interface IRating extends Document {
  proId?: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  invoiceMainId?: mongoose.Types.ObjectId;
  WOMainId?: mongoose.Types.ObjectId;
  staffMainId?: mongoose.Types.ObjectId;
  quality?: number;
  value?: number;
  staffRate?: number;
  customerService?: number;
  workOrderNumber?: string;
  average?: number;
  comments?: string;
  createdBy?: string;
  createdOn?: Date;
  modifiedBy?: string;
  modifiedOn?: Date;
  createdDate?: Date;
  createdAt?: Date; // مضافة تلقائيًا من timestamps
  updatedAt?: Date; // مضافة تلقائيًا من timestamps
}