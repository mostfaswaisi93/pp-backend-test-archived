import { Schema, model } from "mongoose";
import { IState } from "./state.interface";

const stateSchema = new Schema<IState>(
  {
    countryCode: { type: String, required: true },
    stateCode: { type: String, required: true },
    stateName: { type: String, required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      required: true,
    },
  },
  { timestamps: true }
);

export const State = model<IState>("State", stateSchema);
