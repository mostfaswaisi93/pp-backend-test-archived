import dotenv from "dotenv";
import { Estimate } from "../models/estimate/estimate.model";

dotenv.config();

export const runEstimateSeeder = async () => {
  const estimateData = [
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
      isPopularEstimate: true,
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
      isPopularEstimate: true,
    },
  ];

  try {
    await Estimate.insertMany(estimateData);
    console.log("Estimate seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting Estimate seed data:", error);
  }
};
