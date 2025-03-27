import { Document } from "mongoose";

export interface IZipcode extends Document {
  _id: string;
  zipcode: string;
  latitude: number; // Changed from string to number for accuracy
  longitude: number; // Changed from string to number for accuracy
  city: string;
  state: string;
  stateCode: string;
  county: string;
  type: string;
  totalHousesCount: number; // Renamed from totalHousesNumber to totalHousesCount for better clarity
  medianHouseholdIncome: number; // Renamed from medianHouseholdsIncome to medianHouseholdIncome for better readability
  totalPopulation: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
