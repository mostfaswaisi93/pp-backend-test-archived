import dotenv from "dotenv";
import { InventoryLocationsModel } from "../models/inventory-location/inventory-location.model";

dotenv.config();

export const runInventoryLocationSeeder = async () => {
  const inventoryLocationData = [
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
      isPopularInvoice: true,
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
      isPopularInvoice: true,
    },
  ];

  try {
    await InventoryLocationsModel.insertMany(inventoryLocationData);
    console.log("Inventory Location seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting inventory Location seed data:", error);
  }
};
