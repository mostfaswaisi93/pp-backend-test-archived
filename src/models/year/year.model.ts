import { Schema, model } from "mongoose";
import { IYear } from "./year.interface";

const yearSchema = new Schema<IYear>(
  {
    year: {
      type: Number,
      required: true,
      unique: true,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      required: true,
    },
  },
  { timestamps: true }
);

yearSchema.pre("save", function (next) {
  this.year = parseInt(this.year as unknown as string, 10);
  next();
});

export const Year = model<IYear>("Year", yearSchema);
