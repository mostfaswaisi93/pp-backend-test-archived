import dotenv from "dotenv";
import { Year } from "../models/year/year.model";

dotenv.config();

export const runYearSeeder = async () => {
  const currentYear = new Date().getFullYear();
  const yearData = [];

  for (let year = 1900; year <= currentYear + 1; year++) {
    yearData.push({
      year,
      status: "ACTIVE",
    });
  }

  try {
    await Year.insertMany(yearData);
    console.log("Year seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting year seed data:", error);
  }
};
