import dotenv from "dotenv";
import { StandardQuestion } from "../models/standard-question/standard-question.model";

dotenv.config();

export const runStandardQuestionSeeder = async () => {
  const standardQuestionData = [
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
    await StandardQuestion.insertMany(standardQuestionData);
    console.log("Standard Question seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting Standard Question seed data:", error);
  }
};
