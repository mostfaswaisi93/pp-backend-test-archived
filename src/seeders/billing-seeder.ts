import dotenv from "dotenv";
import { Billing } from "../models/billing/billing.model";

dotenv.config();

export const runBillingSeeder = async () => {
  const billingData = [
    {
      license: 5,
      loginId: "user123",
      planChangeDate: new Date(),
      nextBillingDate: new Date("2025-05-01"),
      currentLicenseCount: 3,
      newLicenseCount: 5,
      additionalLicenses: 2,
      licenseFeePerMonth: 10,
      monthlySubscriptionFees: 30,
      daysRemainingUntilNextBillingDate: 10,
      dueAtTheTimeOfPlanChange: 20,
      createdBy: "SYSTEM ADMIN",
      createdOn: new Date(),
      modifiedBy: "SYSTEM ADMIN",
      modifiedOn: new Date(),
      createdDate: new Date(),
      pausedAt: null,
      remainingDaysAfterPause: 0,
      status: "ACTIVE",
      active: true,
    },
  ];

  try {
    await Billing.insertMany(billingData);
    console.log("Billing seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting billing seed data:", error);
  }
};
