import mongoose, { Document } from "mongoose";

export interface IProCustomer extends Document {
  customerId: string;
  customerEmailId: string;
  proEmailId: string;
  proLoginId: mongoose.Types.ObjectId;
  proId: string;
  customerLoginId: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  pro: mongoose.Types.ObjectId;
  customerType: "Residential" | "Business";
  businessName?: string;
  phoneNumber: string;
  dispatchTextNumber?: string;
  source?: string;
  vendor?: string;
  paymentMethod?: string;
  creditLimit: number;
  paymentTerms: string;
  taxExempt: boolean;
  poRequired: boolean;
  doNotServe: boolean;
  doNotServeNotes?: string;
  SubscribeToReceiveMarketingEmails: boolean;
  picturesAndVideos: object[];
  status: "Active" | "InActive" | "Do Not Serve";
  createdBy: string;
  createdOn: string;
  createdByEmail: string;
  createdByLoginId: mongoose.Types.ObjectId;
  createdByRole: string;
  staffAssignedLoginIds: string[];
  updatedBy: string;
  updatedByImage: string;
  updatedByEmail: string;
  customerBillingAddress: object;
  isDeleted: boolean;
}
