import mongoose, { Document, Schema, model } from "mongoose";
import { ITransaction } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customer" },
    proLoginId: { type: mongoose.Schema.Types.ObjectId, ref: "login" },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: function () {
        return this.docType.toLowerCase();
      },
    },
    invoiceNumber: { type: String },
    transactionId: { type: String },
    transactionNumber: { type: String },
    creditCard: { type: String },
    cardName: { type: String },
    transactionType: { type: String, enum: ["PAYMENT", "REFUND", "WRITE-OFF"] },
    docType: { type: String, enum: ["ESTIMATE", "INVOICE"] },
    status: { type: String, enum: ["FAILED", "SUCCESS"] },
    amount: { type: Number },
    creditCardProcessingFee: { type: Number },
    creditCardPF: { type: Number },
    totalAmount: { type: Number },
    paymentType: { type: String },
    ZelleId: { type: String },
    VenmoId: { type: String },
    AppleId: { type: String },
    GoogleId: { type: String },
    PayPalEmail: { type: String },
    CompanyName: { type: String },
    CheckNumber: { type: String },
    InsuranceName: { type: String },
    BankName: { type: String },
    transactionDate: { type: String },
    transactionNotes: { type: String },
    writeOffReason: { type: String },
    message: { type: String },
    createdFrom: { type: String, enum: ["AUTHORIZE", "PRO", "CREDIT"] },
    isRefundRequested: { type: Boolean },
    creditAppliedFrom: { type: mongoose.Schema.Types.ObjectId, ref: "invoice" },
    isVoided: { type: Boolean },
    voidReason: { type: String },
    createdBy: { type: String },
    createdByRole: { type: String },
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
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "login" },
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
