import { Schema, model } from "mongoose";
import { IAccountHistory } from "./account-history.interface";

const accountHistorySchema = new Schema<IAccountHistory>(
  {
    proId: { type: Schema.Types.ObjectId, ref: "Pro" },
    proLoginId: { type: Schema.Types.ObjectId },
    status: { type: String },
    notes: { type: String },
    file: { type: String },
  },
  { timestamps: true }
);

export const AccountHistory = model<IAccountHistory>(
  "AccountHistory",
  accountHistorySchema
);
