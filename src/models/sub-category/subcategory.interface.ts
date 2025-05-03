import mongoose, { Document } from "mongoose";

export interface ISubCategory extends Document {
  _id: string;
  // Renamed 'cat_code' to 'categoryCode' for better clarity
  categoryCode: string;
  // Renamed 'subcat_code' to 'subcategoryCode' for better clarity
  subcategoryCode: string;
  // Renamed 'subcategoryName' to 'name' for consistency
  name: string;
  // Renamed 'subcategoryDescription' to 'description' for clarity and conciseness
  description: string;
  // 'categoryId' remains the same but it's a reference to the 'Category' model
  categoryId: mongoose.Types.ObjectId;
  price: string;
  bapPrice: string;
  // Renamed 'loadStandardQuestion' to 'isStandardQuestionLoaded' for better understanding as a boolean flag
  isStandardQuestionLoaded: boolean;
  createdBy: string;
  // Renamed 'createdOn' to 'createdAt' for consistency with timestamps
  createdAt: string;
  // Renamed 'modified_at' to 'modifiedAt' for consistency with timestamps
  modifiedAt: string;
  // Renamed 'modified_on' to 'modifiedOn' for consistency with timestamps
  modifiedOn: string;
  status: string;
}
