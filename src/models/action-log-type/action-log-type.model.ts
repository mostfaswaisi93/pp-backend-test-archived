import { Schema, model } from "mongoose";
import { IActionLogType } from "./action-log-type.interface";

const actionLogTypeSchema = new Schema<IActionLogType>(
  {
    logMessege: { type: String, maxlength: 250, default: null },
    description: { type: String, maxlength: 250, default: null },
  },
  { timestamps: true }
);

export const ActionLogType = model<IActionLogType>(
  "ActionLogType",
  actionLogTypeSchema
);
