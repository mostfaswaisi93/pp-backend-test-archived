import dotenv from "dotenv";
import { Inventory } from "../models/inventory/inventory.model";

dotenv.config();

export const runInventorySeeder = async () => {
  const inventoryData = [
    {
      proId: "EL0001",
      isInventory: true,
      isPurchased: false,
      inventory: {
        itemName: "Electronics",
        description: "All kinds of electronic devices",
        qrImage: "electronics-icon.png",
        inventoryImage: ["electronics-image.png"],
        listPrice: 100,
        createdBy: "SYSTEM ADMIN",
        status: "ACTIVE",
      },
    },
    {
      proId: "CL0001",
      isInventory: true,
      isPurchased: false,
      inventory: {
        itemName: "Clothing",
        description: "Men and women clothing",
        qrImage: "clothing-icon.png",
        inventoryImage: ["clothing-image.png"],
        listPrice: 50,
        createdBy: "SYSTEM ADMIN",
        status: "ACTIVE",
      },
    },
  ];

  try {
    await Inventory.insertMany(inventoryData);
    console.log("Inventory seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting inventory seed data:", error);
  }
};
