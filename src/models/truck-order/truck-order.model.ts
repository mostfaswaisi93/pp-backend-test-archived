// truckOrder.model.ts

import mongoose, { Schema, Document, model } from "mongoose";
import { ITruckOrder, ITruckStockingListDetail } from "./truck-order.interface";

const truckStockingListDetailSchema = new Schema<ITruckStockingListDetail>(
  {
    itemId: { type: String, required: true },
    itemName: { type: String, required: true },
    partId: { type: String, required: true },
    categoryCode: { type: String, required: true },
    subCategory: { type: String, required: true },
    manufacturer: { type: String, required: true },
    vendor: { type: String, required: true },
    qty: { type: String, required: true },
    subTotal: { type: String, required: true },
    purchasePrice: { type: String, required: true },
    qtyOnTruck: { type: String, default: "0" },
    orderStatus: { type: String, default: "" },
    receiveStatus: { type: String, default: "" },
    returnStatus: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

function arrayLimit(val: ITruckStockingListDetail[]) {
  return val.length <= 100;
}

const truckOrderSchema = new Schema<ITruckOrder>(
  {
    proId: { type: String, required: true },
    loginId: { type: String, required: true },
    proEmailId: { type: String, required: true },
    trucklocationId: { type: String, required: true },
    truckOrderId: { type: String, required: true },
    locationId: { type: String, required: true },
    staffId: { type: String, required: true },
    managerId: { type: String, required: true },
    description: { type: String, default: "" },
    status: { type: String, default: "DRAFT" },
    truckStockingListDetails: {
      type: [truckStockingListDetailSchema],
      validate: [arrayLimit, "{PATH} exceeds the limit of 100"],
    },
    staffNotes: { type: String, default: "" },
    managerNotes: { type: String, default: "" },
    totalCost: { type: Number, default: 0 },
    createdBy: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
    files: { type: Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

const TruckOrder = model<ITruckOrder>("TruckOrder", truckOrderSchema);

export default TruckOrder;
