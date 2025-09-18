import { Schema, model } from "mongoose";
import { IZipcode } from "./zipcode.interface";
import { Status } from "../../commons/constants/constants";

const zipcodeSchema = new Schema<IZipcode>(
  {
    zipcode: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    stateCode: {
      type: String,
      required: true,
      trim: true,
    },
    county: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    totalHousesCount: {
      type: Number,
      required: true,
      min: 0,
    },
    medianHouseholdIncome: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPopulation: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
      required: true,
    },
  },
  { timestamps: true }
);

if (!zipcodeSchema.indexes().some((idx) => idx[0].zipcode)) {
  zipcodeSchema.index({ zipcode: 1 }, { unique: true });
}

export const Zipcode = model<IZipcode>("Zipcode", zipcodeSchema);
