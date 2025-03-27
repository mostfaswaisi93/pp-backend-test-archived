import dotenv from "dotenv";
import { Zipcode } from "../models/zipcode/zipcode.model";

dotenv.config();

export const runZipcodeSeeder = async () => {
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
      status: "ACTIVE",
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
      status: "ACTIVE",
    },
  ];

  try {
    await Zipcode.insertMany(zipcodeData);
    console.log("Zipcode seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting zipcode seed data:", error);
  }
};
