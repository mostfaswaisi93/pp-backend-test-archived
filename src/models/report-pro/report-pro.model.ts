import { Schema, model } from "mongoose";
import { IReportPro } from "./report-pro.interface";

const reportProSchema = new Schema<IReportPro>(
  {
    reportNumber: { type: String },
    workOrderNumber: { type: String },
    workOrederMainId: { type: Schema.Types.ObjectId, ref: "workorder" },
    projectName: { type: String },
    projectDescription: { type: String },
    reviewComments: { type: String },
    isNeverShowedUp: { type: Boolean, default: false },
    isShowedUpTooLate: { type: Boolean, default: false },
    isAbusiveBehavior: { type: Boolean, default: false },
    isDoNotLookProfessional: { type: Boolean, default: false },
    isOtherReason: { type: Boolean, default: false },
    attachments: [{ type: Object }],
    proId: { type: String },
    proMainId: { type: Schema.Types.ObjectId, ref: "pro" },
    proEmailId: { type: String },
    proName: { type: String },
    customerName: { type: String },
    customerId: { type: String },
    customerEmailId: { type: String },
    customerMainId: { type: Schema.Types.ObjectId, ref: "customer" },
    emailId: { type: String },
    date: { type: String },
    proReviewComments: { type: String },
    status: { type: String, default: "Open" },
    createdOn: {
      type: String,
      default: new Date().toISOString().split("T")[0],
    },
  },
  { timestamps: true }
);

export const ReportPro = model<IReportPro>("ReportPro", reportProSchema);
