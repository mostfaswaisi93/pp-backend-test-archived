import dotenv from "dotenv";
import GlobalSettingModel from "../models/global-setting/global-setting.model";

dotenv.config();

export const runGlobalSettingSeeder = async () => {
  const globalSettingData = [
    {
      loginId: "SYSTEM",
      uom: [
        {
          unitMeasurement: "Kilogram",
          symbol: "kg",
          category: "Weight",
          status: "ACTIVE",
        },
        {
          unitMeasurement: "Meter",
          symbol: "m",
          category: "Length",
          status: "ACTIVE",
        },
      ],
      EmployementStatus: [
        { employmentStatus: "Full-Time", status: "ACTIVE" },
        { employmentStatus: "Part-Time", status: "ACTIVE" },
      ],
      paymentMethods: [
        { paymentMethods: "Credit Card", status: "ACTIVE" },
        { paymentMethods: "Cash", status: "ACTIVE" },
      ],
      timeCardActivities: [
        { name: "Work", status: "ACTIVE" },
        { name: "Break", status: "INACTIVE" },
      ],
      currentStatus: [
        { name: "Pending", color: "#FFA500", status: "ACTIVE" },
        { name: "Completed", color: "#008000", status: "ACTIVE" },
      ],
      workOrder: [
        { WoStatusTag: "In Progress", status: "ACTIVE" },
        { WoStatusTag: "Closed", status: "INACTIVE" },
      ],
      globalTermsAndConditions: [
        {
          termName: "Default",
          text: "These are the general terms and conditions.",
        },
      ],
      estimateStatusTags: [
        { estimateStatusTag: "Draft", colorCode: "#CCCCCC", status: "ACTIVE" },
      ],
      invoiceStatusTags: [
        { invoiceStatusTag: "Paid", colorCode: "#00FF00", status: "ACTIVE" },
      ],
      serviceTypeTags: [{ serviceTypeTag: "Repair", status: "ACTIVE" }],
      purchaseOrders: [{ purchaseOrder: "PO001", status: "ACTIVE" }],
      appVersions: {
        title: "v1.0.0",
        description: "Initial release",
        androidUrl: "https://play.google.com/app",
        iosUrl: "https://apps.apple.com/app",
        AndroidVersion: "1.0.0",
        IOSVersion: "1.0.0",
      },
      Geofence_radius: "50",
      status: "ACTIVE",
    },
  ];

  try {
    await GlobalSettingModel.insertMany(globalSettingData);
    console.log("Global Setting seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting Global Setting seed data:", error);
  }
};
