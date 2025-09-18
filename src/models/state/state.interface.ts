import { Document } from "mongoose";
import { Status } from "../../commons/constants/constants";

export interface IState extends Document {
  _id: string;
  countryCode: string;
  stateCode: string;
  stateName: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}
