import { Schema, model } from "mongoose";
import { IBusinessHour } from "./business-hour.interface";

const businessHourSchema = new Schema<IBusinessHour>(
  {
    // The day of the week (e.g., Monday, Tuesday)
    day: { type: String, required: true },

    // Start time of business hours stored as Date for better manipulation
    fromTime: { type: Date, required: true },

    // End time of business hours stored as Date to maintain consistency
    toTime: { type: Date, required: true },

    // Status to indicate whether business is open or closed
    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
      required: true,
    },
  },
  { timestamps: true }
);

export const BusinessHour = model<IBusinessHour>(
  "BusinessHour",
  businessHourSchema
);
