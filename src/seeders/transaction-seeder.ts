import dotenv from "dotenv";
import Transaction from "../models/transaction/transaction.model";
import mongoose from "mongoose";

dotenv.config();

export const runTransactionSeeder = async () => {
  const transactionData = [
    {
      customerId: new mongoose.Types.ObjectId(),
      proUserId: new mongoose.Types.ObjectId(),
      invoiceId: new mongoose.Types.ObjectId(),
      invoiceNumber: "INV-1001",
      transactionId: "TXN-001",
      transactionNumber: "TN-1001",
      creditCard: "4111111111111111",
      cardName: "John Doe",
      transactionType: "PAYMENT",
      documentType: "INVOICE",
      status: "SUCCESS",
      amount: 100.0,
      creditCardProcessingFee: 2.5,
      creditCardPF: 1.0,
      totalAmount: 103.5,
      paymentType: "Credit Card",
      zelleId: "ZELLE123",
      venmoId: "VENMO123",
      appleId: "APPLE123",
      googleId: "GOOGLE123",
      payPalEmail: "paypal@example.com",
      companyName: "ABC Corp",
      checkNumber: "CHK123",
      insuranceName: "XYZ Insurance",
      bankName: "Big Bank",
      transactionTimestamp: new Date().toISOString(),
      transactionRemarks: "First transaction",
      writeOffReason: "None",
      message: "Transaction completed",
      source: "AUTHORIZE",
      refundRequested: false,
      creditAppliedFrom: new mongoose.Types.ObjectId(),
      isVoided: false,
      cancellationReason: "",
      createdBy: "admin",
      creatorRole: "admin",
      voidedBy: "",
      voidedAt: null,
      details: {
        availableAmount: 100.0,
        availableForRefundRequests: 50.0,
      },
      businessInfo: {
        businessName: "ABC Corp",
        businessAddress: "123 Street, City",
        city: "City Name",
        state: "State",
        zipcode: "12345",
      },
      isVerified: true,
      verifiedBy: new mongoose.Types.ObjectId(),
    },
    // You can add more transaction objects here as needed
  ];

  try {
    await Transaction.insertMany(transactionData);
    console.log("Transaction seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting Transaction seed data:", error);
  }
};
