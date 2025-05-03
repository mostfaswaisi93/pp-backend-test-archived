import dotenv from "dotenv";
import TruckOrder from "../models/truck-order/truck-order.model";

dotenv.config();

export const runTruckOrderSeeder = async () => {
  const truckOrderData = [
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
      isPopularTruckOrder: true,
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
      isPopularTruckOrder: true,
    },
  ];

  try {
    await TruckOrder.insertMany(truckOrderData);
    console.log("Truck Order seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting Truck Order seed data:", error);
  }
};
