import { Document } from "mongoose";

export enum BusinessHourStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export interface IBusinessHour extends Document {
  _id: string;
  day: string;
  fromTime: Date;
  toTime: Date;
  status: BusinessHourStatus;
  createdAt: Date;
  updatedAt: Date;
}
