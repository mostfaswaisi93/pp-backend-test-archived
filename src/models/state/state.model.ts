import { Schema, model } from "mongoose";
import { IState } from "./state.interface";
import { Status } from "../../commons/constants/constants";

const stateSchema = new Schema<IState>(
  {
    countryCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 5,
    },
    stateCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 10,
    },
    stateName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
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

if (!stateSchema.indexes().some((idx) => idx[0].stateCode)) {
  stateSchema.index({ countryCode: 1, stateCode: 1 }, { unique: true });
}

export const State = model<IState>("State", stateSchema);
