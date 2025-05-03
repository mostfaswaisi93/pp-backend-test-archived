import { Document } from "mongoose";

export interface IPurchaseOrder extends Document {
  _id: string;
  workOrderNumber?: string;
  workOrderId?: string;
  workOrderStatus?: string;
  customerName?: string;
  customerId?: string;
  phoneNumber?: string;
  jobTitle?: string;
  location?: string;
  staffId?: string;
  status?: string;
  staffNotes?: string;
  managerNotes?: string;
  purchaseOrderDetails?: any[];
  totalCost?: number;
  proId?: string;
  userId?: string;
  proEmailId?: string;
  purchaseOrderId?: string;
  description?: string;
  files?: any[];
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
