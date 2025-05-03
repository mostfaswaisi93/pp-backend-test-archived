import mongoose, { Document, Schema, model } from "mongoose";
import { ITransaction } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    proUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: function () {
        return this.documentType.toLowerCase(); // Changed 'docType' to 'documentType' for better clarity
      },
    },
    invoiceNumber: { type: String },
    transactionId: { type: String },
    transactionNumber: { type: String },
    creditCard: { type: String },
    cardName: { type: String },
    transactionType: { type: String, enum: ["PAYMENT", "REFUND", "WRITE-OFF"] },
    documentType: { type: String, enum: ["ESTIMATE", "INVOICE"] }, // Changed 'docType' to 'documentType'
    status: { type: String, enum: ["FAILED", "SUCCESS"] },
    amount: { type: Number },
    creditCardProcessingFee: { type: Number },
    creditCardPF: { type: Number },
    totalAmount: { type: Number },
    paymentType: { type: String },
    zelleId: { type: String }, // Changed 'ZelleId' to 'zelleId' for consistency
    venmoId: { type: String }, // Changed 'VenmoId' to 'venmoId' for consistency
    appleId: { type: String }, // Changed 'AppleId' to 'appleId' for consistency
    googleId: { type: String }, // Changed 'GoogleId' to 'googleId' for consistency
    payPalEmail: { type: String }, // Changed 'PayPalEmail' to 'payPalEmail' for consistency
    companyName: { type: String }, // Changed 'CompanyName' to 'companyName' for consistency
    checkNumber: { type: String }, // Changed 'CheckNumber' to 'checkNumber' for consistency
    insuranceName: { type: String }, // Changed 'InsuranceName' to 'insuranceName' for consistency
    bankName: { type: String }, // Changed 'BankName' to 'bankName' for consistency
    transactionTimestamp: { type: String }, // Changed 'transactionDate' to 'transactionTimestamp' for better clarity
    transactionRemarks: { type: String }, // Changed 'transactionNotes' to 'transactionRemarks' for clarity
    writeOffReason: { type: String },
    message: { type: String },
    source: { type: String, enum: ["AUTHORIZE", "PRO", "CREDIT"] }, // Changed 'createdFrom' to 'source' for better clarity
    refundRequested: { type: Boolean }, // Changed 'isRefundRequested' to 'refundRequested' for simplicity
    creditAppliedFrom: { type: mongoose.Schema.Types.ObjectId, ref: "invoice" },
    isVoided: { type: Boolean },
    cancellationReason: { type: String }, // Changed 'voidReason' to 'cancellationReason' for better clarity
    createdBy: { type: String },
    creatorRole: { type: String }, // Changed 'createdByRole' to 'creatorRole' for clarity
    voidedBy: { type: String },
    voidedAt: { type: Date },
    details: {
      availableAmount: { type: Number },
      availableForRefundRequests: { type: Number },
    },
    businessInfo: {
      businessName: { type: String },
      businessAddress: { type: String },
      city: { type: String },
      state: { type: String },
      zipcode: { type: String },
    },
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

transactionSchema.pre<ITransaction>("save", function (next) {
  this.amount = Number(this.amount.toFixed(2));

  if (this.paymentType === "Credit Card") {
    this.creditCardProcessingFee = +this.creditCardProcessingFee.toFixed(2);
    this.creditCardPF = +this.creditCardPF.toFixed(2);
    this.totalAmount = +this.totalAmount.toFixed(2);
  }

  next();
});

const Transaction = model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
