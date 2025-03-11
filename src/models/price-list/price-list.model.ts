import { Schema, model } from "mongoose";
import { IPriceList } from "./price-list.interface";

const priceListSchema = new Schema<IPriceList>(
  {
    price_id: { type: Schema.Types.ObjectId },
    type: { type: String },
    name: { type: String },
    package_desc: { type: String },
    price_desc: { type: String },
    package_price: { type: Number },
    price_per: { type: String },
    package_features: { type: Object },
  },
  { timestamps: true }
);

export const PriceList = model<IPriceList>("PriceList", priceListSchema);
