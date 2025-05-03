import { Schema, model } from "mongoose";
import { IPromo } from "./promo.interface";

const promoSchema = new Schema<IPromo>(
  {
    userId: { type: String },
    proId: { type: String },
    promoCode: { type: String },
    promoName: { type: String },
    vendorName: { type: String },
    startDate: { type: Date }, // Changed from 'String' to 'Date'
    endDate: { type: Date }, // Changed from 'String' to 'Date'
    marketingMediaType: { type: String },
    recurring: { type: Boolean }, // Changed from 'String' to 'Boolean'
    promoFees: { type: Number },
    promoPercentageValue: { type: Number },
    promoPercentage: { type: String },
    promoDollarValue: { type: Number },
    totalPrice: { type: Number },
    totalTickets: { type: Number },
    description: { type: String },
    mode: { type: String },
    promoImages: { type: [String] },
    qrCodes: { type: [String] },
    promoServiceCost: { type: Number },
    notes: { type: String },
    createdBy: { type: String },
    status: { type: String, default: "DRAFT" },
    theme: { type: String },
    isReadyToShare: { type: Boolean, default: false },
    lastEmailSendOn: { type: Date },
  },
  { timestamps: true }
);

export const Promo = model<IPromo>("Promo", promoSchema);
