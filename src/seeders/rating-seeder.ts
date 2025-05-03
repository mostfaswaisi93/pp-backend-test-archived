import dotenv from "dotenv";
import { Rating } from "../models/rating/rating.model";

dotenv.config();

export const runRatingSeeder = async () => {
  const ratingData = [
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
    await Rating.insertMany(ratingData);
    console.log("Rating seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting Rating seed data:", error);
  }
};
