import dotenv from "dotenv";
import { Workorder } from "../models/workorder/workorder.model";

dotenv.config();

export const runWorkorderSeeder = async () => {
  const workorderData = [
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
      isPopularWorkorder: true,
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
      isPopularWorkorder: true,
    },
  ];

  try {
    await Workorder.insertMany(workorderData);
    console.log("Workorder seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting Workorder seed data:", error);
  }
};
