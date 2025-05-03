import dotenv from "dotenv";
import { ReportPro } from "../models/report-pro/report-pro.model";

dotenv.config();

export const runReportProSeeder = async () => {
  const reportProData = [
    {
      code: "EL0001",
      name: "Electronics",
      description: "All kinds of electronic devices",
      icon: "electronics-icon.png",
      image: "electronics-image.png",
      price: 100,
      createdBy: "SYSTEM ADMIN",
      status: "ACTIVE",
      isAdminOnly: false,
      isPopularCategory: true,
    },
    {
      code: "CL0001",
      name: "Clothing",
      description: "Men and women clothing",
      icon: "clothing-icon.png",
      image: "clothing-image.png",
      price: 50,
      createdBy: "SYSTEM ADMIN",
      status: "ACTIVE",
      isAdminOnly: false,
      isPopularCategory: true,
    },
  ];

  try {
    await ReportPro.insertMany(reportProData);
    console.log("Report Pro seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting Report Pro seed data:", error);
  }
};
