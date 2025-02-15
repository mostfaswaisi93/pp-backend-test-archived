import { Schema, model } from "mongoose";
import { IPricebook } from "./pricebook.interface";

const pricebookSchema = new Schema<IPricebook>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

export const Pricebook = model<IPricebook>("Pricebook", pricebookSchema);
