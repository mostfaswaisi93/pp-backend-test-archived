import dotenv from "dotenv";
import { PurchaseOrder } from "../models/purchase-order/purchase-order.model";

dotenv.config();

export const runPurchaseOrderSeeder = async () => {
  const purchaseOrderData = [
    {
      workOrderNumber: "WO0001",
      workOrderId: "WID001",
      workOrderStatus: "Pending",
      customerName: "John Doe",
      customerId: "CUST001",
      phoneNumber: "+1234567890",
      jobTitle: "Electrician",
      location: "New York",
      staffId: "STAFF001",
      status: "ACTIVE",
      staffNotes: "Needs urgent processing",
      managerNotes: "Approved",
      purchaseOrderDetails: [
        { item: "TV", quantity: 2, price: 300 },
        { item: "Laptop", quantity: 1, price: 1000 },
      ],
      totalCost: 1600,
      proId: "PRO123",
      userId: "USER123",
      proEmailId: "pro@example.com",
      purchaseOrderId: "PO001",
      description: "Order for electronics",
      files: [],
      createdBy: "SYSTEM ADMIN",
      updatedBy: "SYSTEM ADMIN",
    },
    {
      workOrderNumber: "WO0002",
      workOrderId: "WID002",
      workOrderStatus: "In Progress",
      customerName: "Jane Smith",
      customerId: "CUST002",
      phoneNumber: "+9876543210",
      jobTitle: "Technician",
      location: "Los Angeles",
      staffId: "STAFF002",
      status: "ACTIVE",
      staffNotes: "Install on Monday",
      managerNotes: "Reviewed",
      purchaseOrderDetails: [
        { item: "Shirt", quantity: 5, price: 20 },
        { item: "Pants", quantity: 3, price: 30 },
      ],
      totalCost: 210,
      proId: "PRO456",
      userId: "USER456",
      proEmailId: "pro2@example.com",
      purchaseOrderId: "PO002",
      description: "Order for clothing",
      files: [],
      createdBy: "SYSTEM ADMIN",
      updatedBy: "SYSTEM ADMIN",
    },
  ];

  try {
    await PurchaseOrder.insertMany(purchaseOrderData);
    console.log("Purchase order seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting purchase order seed data:", error);
  }
};
