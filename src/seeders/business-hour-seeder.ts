import dotenv from "dotenv";
import { BusinessHour } from "../models/business-hour/business-hour.model";

dotenv.config();

export const runBusinessHourSeeder = async () => {
  const businessHourData = [
    {
      day: "Monday",
      fromTime: new Date("2025-03-19T09:00:00Z"),
      toTime: new Date("2025-03-19T17:00:00Z"),
      status: "OPEN",
    },
    {
      day: "Tuesday",
      fromTime: new Date("2025-03-19T09:00:00Z"),
      toTime: new Date("2025-03-19T17:00:00Z"),
      status: "OPEN",
    },
  ];

  try {
    await BusinessHour.insertMany(businessHourData);
    console.log("Business Hour seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting Business Hour seed data:", error);
  }
};
