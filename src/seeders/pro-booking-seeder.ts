import dotenv from "dotenv";
import { ProBooking } from "../models/pro-booking/pro-booking.model";

dotenv.config();

export const runProBookingSeeder = async () => {
  const proBookingData = [
    {
      proid: "12345",
      bookingId: "B001",
      proname: "John Doe",
      proemail: "john@example.com",
      zipcode: "12345",
      state: "California",
      city: "Los Angeles",
      date: "2025-04-25",
      time: "10:00 AM",
      promobile: "1234567890",
      mobile: "0987654321",
      workscope: "Electrical",
      email: "customer@example.com",
      name: "Jane Smith",
      status: "ACTIVE",
    },
    {
      proid: "67890",
      bookingId: "B002",
      proname: "Alice Cooper",
      proemail: "alice@example.com",
      zipcode: "54321",
      state: "Texas",
      city: "Dallas",
      date: "2025-04-26",
      time: "2:00 PM",
      promobile: "2345678901",
      mobile: "8765432109",
      workscope: "Plumbing",
      email: "anothercustomer@example.com",
      name: "Bob Johnson",
      status: "ACTIVE",
    },
  ];

  try {
    await ProBooking.insertMany(proBookingData);
    console.log("Pro booking seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting pro booking seed data:", error);
  }
};
