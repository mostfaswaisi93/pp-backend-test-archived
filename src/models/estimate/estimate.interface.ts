import mongoose, { Document } from "mongoose";

export interface ITransactions {
  paidAmount: number;
  unpaidAmount?: number;
  transactionDate?: Date;
  leftRequiredDeposit?: number;
  refundedAmount: number;
  creditAmount: number;
  actualPaidAmount: number;
  availableForRefundRequests: number;
  paidDeposits?: mongoose.Types.ObjectId[];
  refundedDeposits?: mongoose.Types.ObjectId[];
}

export interface IEstimateCost {
  depositRequiredValue?: number;
}

export interface IEstimate extends Document {
  isInvoiceCreated: boolean;
  parentLoginId: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  workOrder?: mongoose.Types.ObjectId;
  pro?: mongoose.Types.ObjectId;
  proId?: string;
  customerId?: string;
  estimateId?: string;
  estimateQrCode?: string;
  transactions: ITransactions;
  estimate_cost?: IEstimateCost;
  specialInstructions?: string;
  jobSiteNotice?: string;
  estimateNotice?: string;
  privateNotice?: string;
  createdAt: Date;
  updatedAt: Date;
}
