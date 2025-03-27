import dotenv from "dotenv";
import { Category } from "../models/category/category.model";

dotenv.config();

export const runCategorySeeder = async () => {
  const categoryData = [
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
    await Category.insertMany(categoryData);
    console.log("Category seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting category seed data:", error);
  }
};
