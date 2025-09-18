import { Document } from "mongoose";
import { Status } from "../../commons/constants/constants";

export interface IZipcode extends Document {
  _id: string;
  zipcode: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  stateCode: string;
  county: string;
  type: string;
  totalHousesCount: number;
  medianHouseholdIncome: number;
  totalPopulation: number;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}
