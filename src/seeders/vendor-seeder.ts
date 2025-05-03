import dotenv from "dotenv";
import { Vendor } from "../models/vendor/vendor.model";

dotenv.config();

export const runVendorSeeder = async () => {
  const vendorData = [
    {
      proId: "P123",
      userId: "U456",
      vendorId: "V789",
      vendorName: "Vendor One",
      taxIdOrEIN: "123-45-6789",
      representativeName: "John Doe",
      eligible1099: true,
      vendorCategory: "Supplier",
      representativeEmail: "johndoe@example.com",
      accountNumber: "ACC123456",
      phoneNumber: "555-1234",
      extension: "101",
      streetAddress: "123 Vendor St",
      unit: "Apt 4B",
      state: "California",
      city: "Los Angeles",
      zipcode: "90001",
      specialNotes: "Preferred vendor for electronics",
      searchByValues: "electronics, vendor, supplier",
      searchQuery: "electronics vendor Los Angeles",
      createdBy: "admin",
      updatedByImage: "",
      updatedByName: "admin",
      updatedByEmail: "admin@example.com",
      status: "ACTIVE",
    },
    {
      proId: "P124",
      userId: "U457",
      vendorId: "V790",
      vendorName: "Vendor Two",
      taxIdOrEIN: "987-65-4321",
      representativeName: "Jane Smith",
      eligible1099: false,
      vendorCategory: "Service Provider",
      representativeEmail: "janesmith@example.com",
      accountNumber: "ACC123457",
      phoneNumber: "555-5678",
      extension: "102",
      streetAddress: "456 Service Rd",
      unit: "Suite 200",
      state: "New York",
      city: "New York",
      zipcode: "10001",
      specialNotes: "Service provider for consulting",
      searchByValues: "consulting, vendor, service",
      searchQuery: "consulting service New York",
      createdBy: "admin",
      updatedByImage: "",
      updatedByName: "admin",
      updatedByEmail: "admin@example.com",
      status: "ACTIVE",
    },
  ];

  try {
    await Vendor.insertMany(vendorData);
    console.log("Vendor seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting Vendor seed data:", error);
  }
};
