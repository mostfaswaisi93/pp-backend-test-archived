import { Schema, model } from "mongoose";
import { IYear } from "./year.interface";
import { Status } from "../../commons/constants/constants";

const yearSchema = new Schema<IYear>(
  {
    year: {
      type: Number,
      required: true,
      unique: true,
      index: true,
      min: 1900,
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

yearSchema.pre("save", function (next) {
  if (this.isModified("year")) {
    this.year = Number(this.year);
  }
  next();
});

export const Year = model<IYear>("Year", yearSchema);
