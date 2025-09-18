import dotenv from "dotenv";
import { BusinessHour } from "../models/business-hour/business-hour.model";
import { BusinessHourStatus } from "../models/business-hour/business-hour.interface";

dotenv.config();

export const runBusinessHourSeeder = async () => {
  try {
    // Clear existing business hours
    // await BusinessHour.deleteMany({});

    const businessHourData = [
      {
        day: "Monday",
        fromTime: new Date("2025-03-19T09:00:00Z"),
        toTime: new Date("2025-03-19T17:00:00Z"),
        status: BusinessHourStatus.OPEN,
      },
      {
        day: "Tuesday",
        fromTime: new Date("2025-03-19T09:00:00Z"),
        toTime: new Date("2025-03-19T17:00:00Z"),
        status: BusinessHourStatus.OPEN,
      },
      // Add other days as needed
    ];

    const businessHourToInsert = [];

    for (const bh of businessHourData) {
      const exists = await BusinessHour.exists({ day: bh.day });
      if (!exists) {
        businessHourToInsert.push(bh);
      }
    }

    if (businessHourToInsert.length > 0) {
      await BusinessHour.insertMany(businessHourToInsert);
      console.log(
        `✅ Added missing business hours for days: ${businessHourToInsert
          .map((d) => d.day)
          .join(", ")}`
      );
    } else {
      console.log("ℹ️ All business hours already exist. No new records added.");
    }
  } catch (error) {
    console.error("❌ Error inserting Business Hour seed data:", error);
  }
};
