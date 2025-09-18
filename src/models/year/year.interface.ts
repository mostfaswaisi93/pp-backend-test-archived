import { Document } from "mongoose";
import { Status } from "../../commons/constants/constants";

export interface IYear extends Document {
  _id: string;
  year: number;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;
}
