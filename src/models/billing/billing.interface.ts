import { Types } from "mongoose";

export interface IBilling {
  license?: number;
  loginId?: string;
  planChangeDate?: Date;
  nextBillingDate?: Date;
  currentLicenseCount?: number;
  newLicenseCount?: number;
  transactionId?: Types.ObjectId;
  additionalLicenses?: number;
  licenseFeePerMonth?: number;
  monthlySubscriptionFees?: number;
  daysRemainingUntilNextBillingDate?: number;
  dueAtTheTimeOfPlanChange?: number;
  createdBy?: string;
  createdOn?: Date;
  modifiedBy?: string;
  modifiedOn?: Date;
  createdDate?: Date;
  pausedAt?: Date;
  remainingDaysAfterPause?: number;
  status: string;
  active: boolean;
}
