import { Schema, model } from "mongoose";
import { IEstimate } from "./estimate.interface";

const estimateSchema = new Schema<IEstimate>(
  {
    isInvoiceCreated: { type: Boolean, default: false },
    parentLoginId: { type: Schema.Types.ObjectId, required: true },
    customer: { type: Schema.Types.ObjectId, ref: "customer", required: true },
    workOrder: { type: Schema.Types.ObjectId, ref: "workorder" },
    pro: { type: Schema.Types.ObjectId, ref: "pro" },
    proId: { type: String },
    customerId: { type: String },
    estimateId: { type: String },
    estimateQrCode: { type: String, default: "" },

    estimate_cost: {
      depositRequiredValue: { type: Number, default: 0 },
    },

    transactions: {
      paidAmount: { type: Number, default: 0 },
      unpaidAmount: { type: Number, default: 0 },
      transactionDate: { type: Date },
      leftRequiredDeposit: { type: Number, default: 0 }, // ✅ حل المشكلة
      refundedAmount: { type: Number, default: 0 },
      creditAmount: { type: Number, default: 0 },
      actualPaidAmount: { type: Number, default: 0 },
      availableForRefundRequests: { type: Number, default: 0 },
      paidDeposits: [{ type: Schema.Types.ObjectId, ref: "transactions" }],
      refundedDeposits: [{ type: Schema.Types.ObjectId, ref: "transactions" }],
    },
  },
  { timestamps: true }
);

estimateSchema.pre<IEstimate>("save", function (next) {
  this.transactions.actualPaidAmount =
    (this.transactions.paidAmount || 0) -
    (this.transactions.refundedAmount || 0);

  if (
    (this.estimate_cost?.depositRequiredValue || 0) <=
    this.transactions.actualPaidAmount
  ) {
    this.transactions.leftRequiredDeposit = 0;
  } else {
    this.transactions.leftRequiredDeposit =
      (this.estimate_cost?.depositRequiredValue || 0) -
      this.transactions.actualPaidAmount;
  }

  this.transactions.paidAmount = +(this.transactions.paidAmount || 0).toFixed(
    2
  );
  this.transactions.unpaidAmount = +(
    this.transactions.unpaidAmount ?? 0
  ).toFixed(2);
  this.transactions.leftRequiredDeposit = +(
    this.transactions.leftRequiredDeposit ?? 0
  ).toFixed(2);
  this.transactions.refundedAmount = +(
    this.transactions.refundedAmount ?? 0
  ).toFixed(2);
  this.transactions.creditAmount = +(
    this.transactions.creditAmount ?? 0
  ).toFixed(2);
  this.transactions.availableForRefundRequests = +(
    this.transactions.availableForRefundRequests ?? 0
  ).toFixed(2);
  this.transactions.actualPaidAmount = +(
    this.transactions.actualPaidAmount ?? 0
  ).toFixed(2);

  next();
});

export const Estimate = model<IEstimate>("Estimate", estimateSchema);
