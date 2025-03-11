import { Schema, model } from "mongoose";
import { IPurchaseOrder } from "./purchase-order.interface";

const purchaseOrderSchema = new Schema<IPurchaseOrder>(
  {
    workOrderNumber: { type: String },
    workOrderId: { type: String },
    woStatus: { type: String },
    customerName: { type: String },
    customerId: { type: String },
    phoneNumber: { type: String },
    jobTitle: { type: String },
    location: { type: String },
    staffId: { type: String },
    status: { type: String },
    staffNotes: { type: String },
    managerNotes: { type: String },
    purchaseOrderDetails: [{ type: Schema.Types.Mixed }], // using 'Mixed' for dynamic data
    totalCost: { type: Number },
    proId: { type: String },
    loginId: { type: String },
    proEmailId: { type: String },
    purchaseOrderId: { type: String },
    description: { type: String },
    files: [{ type: Schema.Types.Mixed }], // using 'Mixed' for dynamic data
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

export const PurchaseOrder = model<IPurchaseOrder>(
  "PurchaseOrder",
  purchaseOrderSchema
);
