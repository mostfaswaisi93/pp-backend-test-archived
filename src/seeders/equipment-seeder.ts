import dotenv from "dotenv";
import mongoose from "mongoose";
import { Equipment } from "../models/equipment/equipment.model";

dotenv.config();

export const runEquipmentSeeder = async () => {
  const equipmentData = [
    {
      staffName: "John Doe",
      customerName: "Acme Corp",
      staffId: "STF001",
      woId: new mongoose.Types.ObjectId(),
      address: "123 Main St, Cityville",
      pickupTime: new Date("2025-04-25T10:00:00Z"),
      returnTime: new Date("2025-04-26T10:00:00Z"),
      actualPickupTime: null,
      actualReturnTime: null,
      pickupReminder: true,
      returnReminder: true,
      pickupReminderTime: 30,
      returnReminderTime: 30,
      notes: "Handle with care",
      bookingStatus: 1,
      status: "ACTIVE",
      isCancelled: false,
      cancellationTime: null,
      autoCancelled: false,
      bookedBy: "SYSTEM ADMIN",
      incrementedTime: null,
    },
    {
      staffName: "Jane Smith",
      customerName: "Beta LLC",
      staffId: "STF002",
      woId: new mongoose.Types.ObjectId(),
      address: "456 Side St, Townsville",
      pickupTime: new Date("2025-04-28T09:00:00Z"),
      returnTime: new Date("2025-04-30T09:00:00Z"),
      actualPickupTime: null,
      actualReturnTime: null,
      pickupReminder: false,
      returnReminder: true,
      pickupReminderTime: 0,
      returnReminderTime: 15,
      notes: "Urgent use case",
      bookingStatus: 1,
      status: "ACTIVE",
      isCancelled: false,
      cancellationTime: null,
      autoCancelled: false,
      bookedBy: "SYSTEM ADMIN",
      incrementedTime: null,
    },
  ];

  try {
    await Equipment.insertMany(equipmentData);
    console.log("Equipment seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting equipment seed data:", error);
  }
};
