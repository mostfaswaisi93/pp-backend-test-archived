import { Schema, model } from "mongoose";
import { IPricebook } from "./pricebook.interface";

const pricebookSchema = new Schema<IPricebook>(
  {
    loginId: { type: String },
    proId: { type: String },
    serviceId: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    serviceTitle: { type: String, required: true },
    leadCostApply: { type: Boolean },
    leadCost: { type: Number, default: 0 },
    truckOrderCostApply: { type: Boolean },
    truckOrderCost: { type: Number },
    inventory: [{ type: Object }],
    laborRate: { type: Number, default: 0 },
    numberHours: { type: Number, default: 0 },
    subTotal: { type: Number, default: 0 },
    laborCost: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    standard: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
    member: { type: Number, default: 0 },
    standardPercent: { type: Number, default: 0 },
    valuePercent: { type: Number, default: 0 },
    memberPercent: { type: Number, default: 0 },
    totalMaterialCost: { type: Number, default: 0 },
    image: [{ type: String }],
    filename: { type: String },
    documentName: { type: String },
    serviceDescription: { type: String },
    installationDescription: { type: String },
    status: { type: String, default: "ACTIVE", required: true },
    qrImage: { type: String },
    createdOn: { type: String },
    createdBy: { type: String },
    updatedOn: { type: String },
    updatedBy: { type: String },
    createdByEmailId: { type: String },
    updatedByEmailId: { type: String },
    updatedByImage: { type: String },
  },
  { timestamps: true }
);

export const Pricebook = model<IPricebook>("Pricebook", pricebookSchema);
