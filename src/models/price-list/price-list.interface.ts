import { Document, Types } from "mongoose";

export interface IPriceList extends Document {
  price_id?: Types.ObjectId;
  type?: string;
  name?: string;
  package_desc?: string;
  price_desc?: string;
  package_price?: number;
  price_per?: string;
  package_features?: Record<string, any>;
}
