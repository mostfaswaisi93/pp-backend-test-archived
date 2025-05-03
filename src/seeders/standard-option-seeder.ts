import dotenv from "dotenv";
import { StandardQuestionOption } from "../models/standard-option/standard-option.model";

dotenv.config();

export const runStandardQuestionOptionSeeder = async () => {
  const standardQuestionOptionData = [
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
    await StandardQuestionOption.insertMany(standardQuestionOptionData);
    console.log("Standard Question Option seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting Standard Question Option seed data:", error);
  }
};
