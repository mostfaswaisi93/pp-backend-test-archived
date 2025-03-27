import { Document } from "mongoose";
import { IActionLogType } from "../../models/action-log-type/action-log-type.interface";

export interface IActionLog extends Document {
  _id: string;
  logRefId: number | null;
  logRefType: number | null;
  logMessege: string | null;
  actionLogTypeId: number;
  userId: number | null;
  actionLogType: IActionLogType | null;
}
