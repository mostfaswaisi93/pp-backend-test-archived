import dotenv from "dotenv";
import { Year } from "../models/year/year.model";

dotenv.config();

export const runYearSeeder = async () => {
  try {
    // Clear existing years
    // await Year.deleteMany({});

    const currentYear = new Date().getFullYear() + 1;
    const yearData = [];

    for (let year = 1900; year <= currentYear; year++) {
      const exists = await Year.exists({ year });
      if (!exists) {
        yearData.push({ year, status: "ACTIVE" });
      }
    }

    if (yearData.length > 0) {
      await Year.insertMany(yearData);
      console.log(
        `✅ Added missing years: ${yearData.map((d) => d.year).join(", ")}`
      );
    } else {
      console.log("ℹ️ All years already exist. No new year added.");
    }
  } catch (error) {
    console.error("❌ Error inserting year seed data:", error);
  }
};
