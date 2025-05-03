import mongoose, { Schema, model } from "mongoose";
import { IBilling } from "./billing.interface";

const BillingSchema = new Schema<IBilling>(
  {
    license: { type: Number },
    loginId: { type: String },
    planChangeDate: { type: Date },
    nextBillingDate: { type: Date },
    currentLicenseCount: { type: Number },
    newLicenseCount: { type: Number },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "stripe_purchase_logs",
    },
    additionalLicenses: { type: Number },
    licenseFeePerMonth: { type: Number },
    monthlySubscriptionFees: { type: Number },
    daysRemainingUntilNextBillingDate: { type: Number },
    dueAtTheTimeOfPlanChange: { type: Number },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    createdDate: { type: Date },
    pausedAt: { type: Date },
    remainingDaysAfterPause: { type: Number },
    status: { type: String, required: true },
    active: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export const Billing = model<IBilling>("pro_license_logs", BillingSchema);
