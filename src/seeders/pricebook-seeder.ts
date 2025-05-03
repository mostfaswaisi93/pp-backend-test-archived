import dotenv from "dotenv";
import { Pricebook } from "../models/pricebook/pricebook.model";

dotenv.config();

export const runPricebookSeeder = async () => {
  const pricebookData = [
    {
      userId: "user123",
      proId: "pro123",
      serviceId: "service001",
      category: "Electrical",
      subCategory: "Wiring",
      serviceTitle: "Basic Wiring",
      isLeadCostApplied: true,
      leadCost: 25,
      isTruckOrderCostApplied: false,
      inventoryItems: [],
      laborRate: 50,
      numberHours: 2,
      subTotal: 100,
      laborCost: 100,
      totalCost: 125,
      standard: 120,
      value: 110,
      member: 100,
      standardPercent: 10,
      valuePercent: 15,
      memberPercent: 20,
      totalMaterialCost: 25,
      imageUrls: [],
      documentFilename: "wiring-guide.pdf",
      documentName: "Wiring Guide",
      serviceDescription: "Basic residential wiring service.",
      installationDescription: "Standard installation included.",
      serviceStatus: "ACTIVE",
      qrImageUrl: "https://example.com/qr.png",
      createdAt: new Date().toISOString(),
      createdBy: "admin",
      updatedAt: new Date().toISOString(),
      updatedBy: "admin",
      createdByEmail: "admin@example.com",
      updatedByEmail: "admin@example.com",
      updatedByImage: "https://example.com/image.jpg",
    },
  ];

  try {
    await Pricebook.insertMany(pricebookData);
    console.log("Pricebook seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting pricebook seed data:", error);
  }
};
