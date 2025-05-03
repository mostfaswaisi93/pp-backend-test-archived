import dotenv from "dotenv";
import { SubCategory } from "../models/sub-category/subcategory.model";

dotenv.config();

export const runSubCategorySeeder = async () => {
  const subCategoryData = [
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
    await SubCategory.insertMany(subCategoryData);
    console.log("SubCategory seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting subCategory seed data:", error);
  }
};
