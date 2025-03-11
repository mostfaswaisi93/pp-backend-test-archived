import mongoose, { Document } from "mongoose";

export interface ITransaction extends Document {
  customerId: mongoose.Types.ObjectId;
  proLoginId: mongoose.Types.ObjectId;
  invoiceId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  transactionId: string;
  transactionNumber: string;
  creditCard: string;
  cardName: string;
  transactionType: "PAYMENT" | "REFUND" | "WRITE-OFF";
  docType: "ESTIMATE" | "INVOICE";
  status: "FAILED" | "SUCCESS";
  amount: number;
  creditCardProcessingFee: number;
  creditCardPF: number;
  totalAmount: number;
  paymentType: string;
  ZelleId?: string;
  VenmoId?: string;
  AppleId?: string;
  GoogleId?: string;
  PayPalEmail?: string;
  CompanyName?: string;
  CheckNumber?: string;
  InsuranceName?: string;
  BankName?: string;
  transactionDate: string;
  transactionNotes?: string;
  writeOffReason?: string;
  message?: string;
  createdFrom: "AUTHORIZE" | "PRO" | "CREDIT";
  isRefundRequested: boolean;
  creditAppliedFrom?: mongoose.Types.ObjectId;
  isVoided: boolean;
  voidReason?: string;
  createdBy: string;
  createdByRole: string;
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
  verifiedBy?: mongoose.Types.ObjectId;
}
