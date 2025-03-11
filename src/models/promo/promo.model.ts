import { Schema, model } from "mongoose";
import { IPromo } from "./promo.interface";

const promoSchema = new Schema<IPromo>(
  {
    loginId: { type: String },
    proId: { type: String },
    promotionCode: { type: String },
    promotionName: { type: String },
    vendorName: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    marketingMediaType: { type: String },
    recurring: { type: String },
    promotionFees: { type: Number },
    promotionpercentValue: { type: Number },
    promotionpercent: { type: String },
    promotiondollorValue: { type: Number },
    totalprice: { type: Number },
    totalTicket: { type: Number },
    description: { type: String },
    mode: { type: String },
    promotionImage: { type: [String] },
    qrcode: { type: [String] },
    promotionservicecost: { type: Number },
    promotionNotes: { type: String },
    createdBy: { type: String },
    createdOn: { type: String },
    status: { type: String, default: "DRAFT" },
    theme: { type: String },
    isReadyToShare: { type: Boolean, default: false },
    lastEmailSendOn: { type: Date },
  },
  { timestamps: true }
);

export const Promo = model<IPromo>("Promo", promoSchema);
