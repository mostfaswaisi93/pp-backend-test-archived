import { Document, ObjectId } from "mongoose";

export interface ICategory extends Document {
  _id: ObjectId;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  price?: number;
  createdBy?: string;
  status: string;
  isAdminOnly: boolean;
  isPopularCategory: boolean;
}
