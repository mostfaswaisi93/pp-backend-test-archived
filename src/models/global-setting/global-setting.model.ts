import mongoose, { Schema, Model } from "mongoose";
import { IGlobalSetting } from "./global-setting.interface";

const GlobalSettingSchema: Schema<IGlobalSetting> = new Schema(
  {
    loginId: { type: String },
    uom: [
      {
        unitMeasurement: String,
        symbol: String,
        category: String,
        status: String,
      },
    ],
    EmployementStatus: [
      {
        employmentStatus: String,
        status: String,
      },
    ],
    paymentMethods: [
      {
        paymentMethods: String,
        status: String,
      },
    ],
    timeCardActivities: [
      {
        name: String,
        status: String,
      },
    ],
    currentStatus: [
      {
        name: String,
        color: String,
        status: String,
      },
    ],
    workOrder: [
      {
        WoStatusTag: String,
        status: String,
      },
    ],
    globalTermsAndConditions: [
      {
        termName: String,
        text: String,
      },
    ],
    estimateStatusTags: [
      {
        estimateStatusTag: String,
        colorCode: String,
        status: String,
      },
    ],
    invoiceStatusTags: [
      {
        invoiceStatusTag: String,
        colorCode: String,
        status: String,
      },
    ],
    serviceTypeTags: [
      {
        serviceTypeTag: String,
        status: String,
      },
    ],
    purchaseOrders: [
      {
        purchaseOrder: String,
        status: String,
      },
    ],
    appVersions: {
      title: String,
      description: String,
      androidUrl: String,
      iosUrl: String,
      AndroidVersion: String,
      IOSVersion: String,
    },
    Geofence_radius: { type: String },
    status: { type: String, default: "ACTIVE" },
  },
  {
    timestamps: true,
  }
);

const GlobalSettingModel: Model<IGlobalSetting> =
  mongoose.model<IGlobalSetting>("globalSettings", GlobalSettingSchema);
export default GlobalSettingModel;
