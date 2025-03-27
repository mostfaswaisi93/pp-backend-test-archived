import { Schema, model } from "mongoose";
import { IActionLog } from "./action-log.interface";

const actionLogSchema = new Schema<IActionLog>(
  {
    logRefId: { type: Number, default: null },
    logRefType: { type: Number, default: null },
    logMessege: { type: String, maxlength: 250, default: null },
    actionLogTypeId: { type: Number, required: true },
    userId: { type: Number, default: null },
    actionLogType: {
      type: Schema.Types.ObjectId,
      ref: "ActionLogType",
      required: true,
    },
  },
  { timestamps: true }
);

export const ActionLog = model<IActionLog>("ActionLog", actionLogSchema);
