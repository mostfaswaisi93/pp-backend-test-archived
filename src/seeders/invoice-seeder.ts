import dotenv from "dotenv";
import { Types } from "mongoose";
import { Invoice } from "../models/invoice/invoice.model";

dotenv.config();

export const runInvoiceSeeder = async () => {
  const invoiceData = [
    {
      invoiceNumber: "INV001",
      customer: new Types.ObjectId(),
      pro: new Types.ObjectId(),
      estimate: new Types.ObjectId(),
      estimateNumber: "EST001",
      workOrder: new Types.ObjectId(),
      workOrderNumber: "WO001",
      primaryTech: {
        id: new Types.ObjectId(),
        staffId: "T001",
        name: "Tech One",
        email: "tech1@example.com",
        avatar: "avatar1.png",
        staffLocation: "Location A",
        role: "Technician",
        employementStatus: "Active",
        group: "Group A",
        status: "Active",
        commisionRange: { min: 50, max: 100 },
      },
      secondaryTech: {
        id: new Types.ObjectId(),
        staffId: "T002",
        name: "Tech Two",
        email: "tech2@example.com",
        avatar: "avatar2.png",
        role: "Technician",
        employementStatus: "Active",
        group: "Group B",
        status: "Active",
        commisionRange: { min: 30, max: 80 },
      },
      channelManager: {
        id: new Types.ObjectId(),
        staffId: "CM001",
        name: "Channel Manager One",
        email: "cm1@example.com",
        employementStatus: "Active",
        avatar: "cm_avatar.png",
        role: "Manager",
        group: "Group A",
        status: "Active",
        commisionRange: { min: 70, max: 150 },
      },
      parentLoginId: new Types.ObjectId(),
      managerLoginId: new Types.ObjectId(),
      billing_details: {
        customerName: "John Doe",
        customerType: "Retail",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "123456789",
        customerSince: new Date(),
        streetAddress: "123 Main St",
        zip: "12345",
        city: "City A",
        state: "State A",
        paymentMethod: "Credit Card",
        invoiceEmail: "invoice@example.com",
        adminNotes: "Preferred customer",
        poNumber: "PO12345",
        customerCreditLimit: "1000",
        terms: "30 Days",
      },
      createdBy: "SYSTEM ADMIN",
      createdByLoginId: new Types.ObjectId(),
      createdFrom: "estimate",
      jobTitle: "Technician",
      jobDescription: "Tech job for service",
      status: "draft",
      images: ["image1.png"],
      videos: ["video1.mp4"],
      invoiceNotes: "First invoice",
      jobSiteNotes: "Job site details",
      techNotes: "Technician notes",
      labourWarranty: 12,
      partsWarranty: 12,
      unpaidBalanceReminder: 30,
      products: [
        {
          productType: "labor",
          id: new Types.ObjectId(),
          itemId: "ITEM001",
          ref: "staff",
          name: "Tech Service",
          description: "Service by technician",
          qty: 1,
          units: "hours",
          role: "Service",
          unitPrice: 100,
          costPrice: 50,
          subTotal: 100,
          image: "service_image.png",
          productLocation: "Location A",
        },
      ],
      transactions: {
        paidAmount: 50,
        unpaidAmount: 50,
        writeOffAmount: 0,
        refundedAmount: 0,
        creditAmount: 0,
        usedCreditAmount: 0,
        actualPaidAmount: 50,
        availableForRefundRequests: 0,
        transactionDate: new Date(),
      },
      dueDate: new Date(),
      agreedToTerms: true,
    },
  ];

  try {
    await Invoice.insertMany(invoiceData);
    console.log("Invoice seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting Invoice seed data:", error);
  }
};
