import dotenv from "dotenv";
import { Status } from "../commons/constants/constants";
import { Zipcode } from "../models/zipcode/zipcode.model";

dotenv.config();

export const runZipcodeSeeder = async () => {
  try {
    // Clear existing zipcodes if needed
    // await Zipcode.deleteMany({});

    const zipcodeData = [
      {
        zipcode: "10001",
        latitude: 40.7128,
        longitude: -74.006,
        city: "New York",
        state: "New York",
        stateCode: "NY",
        county: "New York County",
        type: "Standard",
        totalHousesCount: 20000,
        medianHouseholdIncome: 75000,
        totalPopulation: 50000,
        status: Status.ACTIVE,
      },
      {
        zipcode: "90001",
        latitude: 34.0522,
        longitude: -118.2437,
        city: "Los Angeles",
        state: "California",
        stateCode: "CA",
        county: "Los Angeles County",
        type: "Standard",
        totalHousesCount: 15000,
        medianHouseholdIncome: 65000,
        totalPopulation: 40000,
        status: Status.ACTIVE,
      },
    ];

    const zipcodesToInsert = [];
    for (const data of zipcodeData) {
      const exists = await Zipcode.exists({ zipcode: data.zipcode });
      if (!exists) zipcodesToInsert.push(data);
    }

    if (zipcodesToInsert.length > 0) {
      await Zipcode.insertMany(zipcodesToInsert);
      console.log(
        `✅ Added missing zipcodes: ${zipcodesToInsert
          .map((z) => z.zipcode)
          .join(", ")}`
      );
    } else {
      console.log("ℹ️ All zipcodes already exist. No new zipcode added.");
    }
  } catch (error) {
    console.error("❌ Error inserting zipcode seed data:", error);
  }
};
