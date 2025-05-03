import { Schema, model } from "mongoose";
import { IPurchaseOrder } from "./purchase-order.interface";

const purchaseOrderSchema = new Schema<IPurchaseOrder>(
  {
    workOrderNumber: { type: String },
    workOrderId: { type: String },
    workOrderStatus: { type: String }, // Consider renaming to "workOrderStatus" for clarity
    customerName: { type: String },
    customerId: { type: String },
    phoneNumber: { type: String },
    jobTitle: { type: String },
    location: { type: String },
    staffId: { type: String },
    status: { type: String }, // - but could be vague; consider "purchaseOrderStatus"
    staffNotes: { type: String },
    managerNotes: { type: String },
    purchaseOrderDetails: [{ type: Schema.Types.Mixed }],
    totalCost: { type: Number },
    proId: { type: String },
    userId: { type: String }, // Consider renaming to "userId" if it's the user login ID
    proEmailId: { type: String },
    purchaseOrderId: { type: String }, // May be redundant if used as _id; otherwise OK
    description: { type: String },
    files: [{ type: Schema.Types.Mixed }],
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

export const PurchaseOrder = model<IPurchaseOrder>(
  "PurchaseOrder",
  purchaseOrderSchema
);
