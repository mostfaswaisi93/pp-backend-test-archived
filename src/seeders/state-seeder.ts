import dotenv from "dotenv";
import { State } from "../models/state/state.model";
import { Status } from "../commons/constants/constants";

dotenv.config();

export const runStateSeeder = async () => {
  try {
    // Clear existing states
    // await State.deleteMany({});

    const stateData = [
      {
        countryCode: "US",
        stateCode: "CA",
        stateName: "California",
        status: Status.ACTIVE,
      },
      {
        countryCode: "US",
        stateCode: "NY",
        stateName: "New York",
        status: Status.ACTIVE,
      },
      {
        countryCode: "CA",
        stateCode: "ON",
        stateName: "Ontario",
        status: Status.ACTIVE,
      },
    ];

    const newStates: typeof stateData = [];

    for (const state of stateData) {
      const exists = await State.exists({
        countryCode: state.countryCode,
        stateCode: state.stateCode,
      });

      if (!exists) {
        newStates.push(state);
      }
    }

    if (newStates.length > 0) {
      await State.insertMany(newStates);
      console.log(
        `✅ Added missing states: ${newStates
          .map((s) => `${s.countryCode}-${s.stateCode}`)
          .join(", ")}`
      );
    } else {
      console.log("ℹ️ All states already exist. No new state added.");
    }
  } catch (error) {
    console.error("❌ Error inserting state seed data:", error);
  }
};
