import { Document } from "mongoose";

export interface IYear extends Document {
  _id: string;
  year: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
