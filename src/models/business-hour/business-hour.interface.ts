import { Document } from "mongoose";

export interface IBusinessHour extends Document {
  _id: string;
  day: string;
  fromTime: Date;
  toTime: Date;
  status: "OPEN" | "CLOSED";
  createdAt?: Date;
  updatedAt?: Date;
}
