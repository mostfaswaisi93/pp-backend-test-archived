import mongoose, { Schema, Document, Model } from "mongoose";
import { IStaff } from "./dispatch-board.interface";

interface IStaffDocument extends IStaff, Document {}

const dispatchBoardSchema: Schema = new Schema({
  loginId: { type: String, required: true },
  group: { type: String, required: true },
  staffStats: {
    didNotClockIn: { type: Number, default: 0 },
    clockIn: { type: Number, default: 0 },
    sick: { type: Number, default: 0 },
    off: { type: Number, default: 0 },
    onBreak: { type: Number, default: 0 },
    clockOut: { type: Number, default: 0 },
  },
  estimates: {
    total: { type: Number, default: 0 },
    draft: { type: Number, default: 0 },
    rejected: { type: Number, default: 0 },
    approveds: { type: Number, default: 0 },
    modify: { type: Number, default: 0 },
  },
  jobs: {
    ongoing: { type: Number, default: 0 },
    complete: { type: Number, default: 0 },
    recall: { type: Number, default: 0 },
    pending: { type: Number, default: 0 },
    paused: { type: Number, default: 0 },
  },
  totalSales: { type: Number, default: 0 },
  avgTicketSize: { type: Number, default: 0 },
});

const DispatchBoard: Model<IStaffDocument> = mongoose.model<IStaffDocument>(
  "DispatchBoard",
  dispatchBoardSchema
);
export default DispatchBoard;
