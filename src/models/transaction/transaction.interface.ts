import mongoose, { Document } from "mongoose";

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  proUserId: mongoose.Types.ObjectId;
  invoiceId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  transactionId: string;
  transactionNumber: string;
  creditCard: string;
  cardName: string;
  transactionType: "PAYMENT" | "REFUND" | "WRITE-OFF";
  documentType: "ESTIMATE" | "INVOICE";
  status: "FAILED" | "SUCCESS";
  amount: number;
  creditCardProcessingFee: number;
  creditCardPF: number;
  totalAmount: number;
  paymentType: string;
  zelleId?: string;
  venmoId?: string;
  appleId?: string;
  googleId?: string;
  payPalEmail?: string;
  companyName?: string;
  checkNumber?: string;
  insuranceName?: string;
  bankName?: string;
  transactionTimestamp: string;
  transactionRemarks: string;
  writeOffReason: string;
  message: string;
  source: "AUTHORIZE" | "PRO" | "CREDIT";
  refundRequested: boolean;
  creditAppliedFrom?: string;
  isVoided: boolean;
  cancellationReason?: string;
  createdBy: string;
  creatorRole: string;
  voidedBy?: string;
  voidedAt?: Date;
  details: {
    availableAmount: number;
    availableForRefundRequests: number;
  };
  businessInfo: {
    businessName: string;
    businessAddress: string;
    city: string;
    state: string;
    zipcode: string;
  };
  isVerified: boolean;
  verifiedBy?: string;
}
