import { Schema, model } from "mongoose";
import { IRating } from "./rating.interface";

const ratingSchema = new Schema<IRating>(
  {
    proId: { type: Schema.Types.ObjectId, ref: "pro" },
    customerId: { type: Schema.Types.ObjectId, ref: "customer" },
    invoiceMainId: { type: Schema.Types.ObjectId, ref: "invoice" },
    WOMainId: { type: Schema.Types.ObjectId, ref: "workorder" },
    staffMainId: { type: Schema.Types.ObjectId, ref: "staff" },
    quality: { type: Number },
    value: { type: Number },
    staffRate: { type: Number },
    customerService: { type: Number },
    workOrderNumber: { type: String },
    average: { type: Number },
    comments: { type: String },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    createdDate: { type: Date },
  },
  { timestamps: true }
);

export const Rating = model<IRating>("Rating", ratingSchema);
