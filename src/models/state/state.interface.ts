import { Document } from "mongoose";

export interface IState extends Document {
  _id: string;
  countryCode: string;
  stateCode: string;
  stateName: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
