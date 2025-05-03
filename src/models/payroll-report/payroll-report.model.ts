import { Schema, model } from "mongoose";
import { IPayrollReport } from "./payroll-report.interface";

const payrollReportSchema = new Schema<IPayrollReport>(
  {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    // Renamed `prId` to `payrollReportId` for better clarity
    payrollReportId: { type: String, required: true },

    // Renamed `serIds` to `commissionReportIds` for better clarity
    // Also fixed the reference name from "commisions_report" to "commissions_report"
    commissionReportIds: [
      { type: Schema.Types.ObjectId, ref: "commissions_report" },
    ],

    salary: { type: Number, default: 0 },
    totalGrossSales: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalCommission: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },

    // Renamed `spiff` to `spiffBonus` to clarify its purpose
    spiffBonus: { type: Number, default: 0 },

    // Renamed `reimbursable` to `reimbursementAmount` for better understanding
    reimbursementAmount: { type: Number, default: 0 },

    // Converted `status` to an enum for better consistency and to avoid typos
    status: {
      type: String,
      enum: ["STAFF DRAFT", "APPROVED", "REJECTED"],
      default: "STAFF DRAFT",
    },

    // Converted `paymentStatus` to an enum for better structure and uppercase for consistency
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    paidOn: { type: Date },
    reportPath: { type: String },

    // Renamed `parentLoginId` to `createdBy` to better indicate its role
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

// Exporting the PayrollReport model
export const PayrollReport = model<IPayrollReport>(
  "PayrollReport",
  payrollReportSchema
);
