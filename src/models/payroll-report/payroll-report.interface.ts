import { Document, Types } from "mongoose";

export interface IPayrollReport extends Document {
  _id: string;
  startTime: Date;
  endTime: Date;

  // Renamed `prId` to `payrollReportId` for better clarity
  payrollReportId: string;

  // Renamed `serIds` to `commissionReportIds` for better clarity
  commissionReportIds: Types.ObjectId[];

  salary: number;
  totalGrossSales: number;
  totalEarnings: number;
  totalCommission: number;
  bonus: number;

  // Renamed `spiff` to `spiffBonus` to clarify its purpose
  spiffBonus: number;

  // Renamed `reimbursable` to `reimbursementAmount` for better understanding
  reimbursementAmount: number;

  // Updated `status` to match enum values used in the schema
  status: "STAFF DRAFT" | "APPROVED" | "REJECTED";

  // Updated `paymentStatus` to match enum values used in the schema
  paymentStatus: "PENDING" | "PAID" | "FAILED";

  paidOn?: Date;
  reportPath?: string;

  // Renamed `parentLoginId` to `createdBy` to better indicate its role
  createdBy: string;
}
