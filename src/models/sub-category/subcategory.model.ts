import { Schema, model } from "mongoose";
import { ISubCategory } from "./subcategory.interface";

const subcategorySchema = new Schema<ISubCategory>(
  {
    loginId: { type: String },
    proId: { type: String },
  },
  { timestamps: true }
);

export const SubCategory = model<ISubCategory>(
  "SubCategory",
  subcategorySchema
);
