import { Schema, model } from "mongoose";
import { ILead } from "./lead.interface";

const leadSchema = new Schema<ILead>(
  {
    userId: { type: String },
    proId: { type: String },
    leadCode: { type: String },
    leadName: { type: String },
    vendorName: { type: String },
    startDate: { type: Date }, // Changed from 'String' to 'Date'
    endDate: { type: Date }, // Changed from 'String' to 'Date'
    marketingMediaType: { type: String },
    recurring: { type: Boolean }, // Changed from 'String' to 'Boolean'
    leadFees: { type: Number },
    leadPercentageValue: { type: Number },
    leadPercentage: { type: String },
    leadDollarValue: { type: Number },
    totalPrice: { type: Number },
    totalTickets: { type: Number },
    description: { type: String },
    mode: { type: String },
    leadImages: { type: [String] },
    qrCodes: { type: [String] },
    leadServiceCost: { type: Number },
    notes: { type: String },
    createdBy: { type: String },
    status: { type: String, default: "DRAFT" },
    theme: { type: String },
    isReadyToShare: { type: Boolean, default: false },
    lastEmailSendOn: { type: Date },
  },
  { timestamps: true }
);

export const Lead = model<ILead>("Lead", leadSchema);
