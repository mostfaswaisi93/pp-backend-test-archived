import { Schema, model } from "mongoose";
import { ICategory } from "./category.interface";

const categorySchema = new Schema<ICategory>(
  {
    code: { type: String, required: true, unique: true }, // changed name
    name: { type: String, required: true }, // changed name
    description: { type: String },
    icon: { type: String }, // changed name
    image: { type: String },
    price: { type: Number, default: 0, min: 0 }, // changed type
    createdBy: { type: String },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      required: true,
    }, // changed and add some features
    isAdminOnly: { type: Boolean, default: false }, // changed name
    isPopularCategory: { type: Boolean, default: true }, // changed name
  },
  { timestamps: true }
);

export const Category = model<ICategory>("Category", categorySchema);
