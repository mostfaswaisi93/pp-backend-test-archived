import mongoose, { Schema, model } from "mongoose";
import { ISubCategory } from "./subcategory.interface";

const subcategorySchema = new Schema<ISubCategory>(
  {
    id: { type: String },
    // Renamed 'cat_code' to 'categoryCode' for better clarity
    categoryCode: { type: String },
    // Renamed 'subcat_code' to 'subcategoryCode' for better clarity
    subcategoryCode: { type: String },
    // Renamed 'subcategoryName' to just 'name' to make it more concise
    name: { type: String },
    // Renamed 'subcategoryDescription' to 'description' to be more concise and clear
    description: { type: String },
    // Renamed 'categoryId' to 'categoryId' (unchanged), but referenced the Category model explicitly
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    price: { type: String },
    bapPrice: { type: String },
    // Renamed 'loadStandardQuestion' to 'isStandardQuestionLoaded' to make it clearer that this is a boolean flag
    isStandardQuestionLoaded: { type: Boolean },
    createdBy: { type: String },
    // Renamed 'createdOn' to 'createdAt' for consistency with 'timestamps' field
    createdAt: { type: String },
    // Renamed 'modified_at' to 'modifiedAt' for consistency with 'timestamps' field
    modifiedAt: { type: String },
    // Renamed 'modified_on' to 'modifiedOn' for consistency with 'timestamps' field
    modifiedOn: { type: String },
    // 'status' field remains the same with a default value of 'ACTIVE'
    status: { type: String, default: "ACTIVE", required: true },
  },
  { timestamps: true } // This automatically adds createdAt and updatedAt fields
);

// Model definition remains the same, just improved naming for clarity
export const SubCategory = model<ISubCategory>(
  "SubCategory",
  subcategorySchema
);
