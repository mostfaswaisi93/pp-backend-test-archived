import { Document } from "mongoose";

export interface IActionLogType extends Document {
  _id: string;
  logMessege: string | null;
  description: string | null;
}
