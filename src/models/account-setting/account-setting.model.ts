import { Schema, model } from "mongoose";
import { IAccountSetting } from "./account-setting.interface";

const accountSettingSchema = new Schema<IAccountSetting>(
  {
    userId: { type: String },
    General: [{ type: Object }],
    StaffRoles: [{ type: Object }],
    StaffAgreements: [{ type: Object }],
    LogInAgreements: [{ type: Object }],
    Inventory: [{ type: Object }],
    markups: [{ type: Object }],
    priceBookPackageName: [{ type: Object }],
    pricebookServiceSubCategories: [{ type: Object }],
    equipmentItemType: [{ type: Object }],
    equipmentStatus: [{ type: Object }],
    EstimatePriceBook: [{ type: Object }],
    invoice: [{ type: Object }],
    equipment: [{ type: Object }],
    marketingMediaType: [{ type: Object }],
    Vendors: [{ type: Object }],
    preWorkInsepection: [{ type: Object }],
    postWorkInsepection: [{ type: Object }],
    messagesandalerts: [{ type: Object }],
    Timecard: [{ type: Object }],
    payment_geteWay: [{ type: Object }],
    payrollFrequency: { type: String },
    status: { type: String, default: "ACTIVE" },
  },
  { timestamps: true }
);

export const AccountSetting = model<IAccountSetting>(
  "AccountSetting",
  accountSettingSchema
);
