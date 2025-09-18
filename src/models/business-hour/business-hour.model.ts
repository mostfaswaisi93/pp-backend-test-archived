import { Schema, model } from "mongoose";
import { IBusinessHour, BusinessHourStatus } from "./business-hour.interface";

const businessHourSchema = new Schema<IBusinessHour>(
  {
    day: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    fromTime: {
      type: Date,
      required: true,
    },
    toTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BusinessHourStatus),
      default: BusinessHourStatus.OPEN,
      required: true,
    },
  },
  { timestamps: true }
);

if (!businessHourSchema.indexes().some((idx) => idx[0].day)) {
  businessHourSchema.index({ day: 1 }, { unique: true });
}

export const BusinessHour = model<IBusinessHour>(
  "BusinessHour",
  businessHourSchema
);
