import dotenv from "dotenv";
import { Promo } from "../models/promo/promo.model";

dotenv.config();

export const runPromoSeeder = async () => {
  const promoData = [
    {
      promoCode: "EL0001",
      promoName: "Electronics",
      description: "All kinds of electronic devices",
      promoFees: 100,
      createdBy: "SYSTEM ADMIN",
      status: "ACTIVE",
    },
    {
      promoCode: "CL0001",
      promoName: "Clothing",
      description: "Men and women clothing",
      promoFees: 50,
      createdBy: "SYSTEM ADMIN",
      status: "ACTIVE",
    },
  ];

  try {
    await Promo.insertMany(promoData);
    console.log("Promo seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting promo seed data:", error);
  }
};
