import dotenv from "dotenv";
import { Lead } from "../models/lead/lead.model";

dotenv.config();

export const runLeadSeeder = async () => {
  const leadData = [
    {
      leadCode: "EL0001",
      leadName: "Electronics",
      description: "All kinds of electronic devices",
      leadFees: 100,
      createdBy: "SYSTEM ADMIN",
      status: "ACTIVE",
    },
    {
      leadCode: "CL0001",
      leadName: "Clothing",
      description: "Men and women clothing",
      leadFees: 50,
      createdBy: "SYSTEM ADMIN",
      status: "ACTIVE",
    },
  ];

  try {
    await Lead.insertMany(leadData);
    console.log("Lead seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting lead seed data:", error);
  }
};
