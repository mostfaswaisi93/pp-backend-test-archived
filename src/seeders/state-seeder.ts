import dotenv from "dotenv";
import { State } from "../models/state/state.model";

dotenv.config();

export const runStateSeeder = async () => {
  const stateData = [
    {
      countryCode: "US",
      stateCode: "CA",
      stateName: "California",
      status: "ACTIVE",
    },
    {
      countryCode: "US",
      stateCode: "NY",
      stateName: "New York",
      status: "ACTIVE",
    },
    {
      countryCode: "CA",
      stateCode: "ON",
      stateName: "Ontario",
      status: "ACTIVE",
    },
  ];

  try {
    await State.insertMany(stateData);
    console.log("State seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting state seed data:", error);
  }
};
