import { Schema, model } from "mongoose";
import { IZipcode } from "./zipcode.interface";

const zipcodeSchema = new Schema<IZipcode>(
  {
    zipcode: { type: String, required: true },
    latitude: { type: Number, required: true }, // Changed type from String to Number
    longitude: { type: Number, required: true }, // Changed type from String to Number
    city: { type: String, required: true },
    state: { type: String, required: true },
    stateCode: { type: String, required: true },
    county: { type: String, required: true },
    type: { type: String, required: true },
    totalHousesCount: { type: Number, required: true }, // Updated field name
    medianHouseholdIncome: { type: Number, required: true }, // Updated field name
    totalPopulation: { type: Number, required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export const Zipcode = model<IZipcode>("Zipcode", zipcodeSchema);
