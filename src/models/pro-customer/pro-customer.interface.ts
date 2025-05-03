import mongoose, { Document } from "mongoose";

interface ICustomerBillingAddress {
  firstName?: string;
  lastName?: string;
  userType?: string;
  address?: string;
  invoiceEmail?: string;
  city?: string;
  country?: string;
  state?: string;
  zipCode?: string;
  adminNotes?: string;
}

export interface IProCustomer extends Document {
  customerId?: string;
  customerEmailId?: string;
  proEmailId?: string;
  proUserId?: mongoose.Types.ObjectId;
  proId?: string;
  type?: string;
  customerUserId?: mongoose.Types.ObjectId;
  customerRef?: mongoose.Types.ObjectId;
  proRef?: mongoose.Types.ObjectId;
  customerType?: "Residential" | "Business";
  businessName?: string;
  phoneNumber?: string;
  dispatchTextNumber?: string;
  source?: string;
  vendor?: string;
  paymentMethod?: string;
  creditLimit?: number;
  paymentTerms?: string;
  taxExempt?: boolean;
  poRequired?: boolean;
  doNotServe?: boolean;
  doNotServeReason?: string;
  subscribeToReceiveMarketingEmails?: boolean;
  mediaFiles?: Record<string, any>[];
  status?: "Active" | "Inactive" | "Do Not Serve";
  createdBy?: string;
  createdOn?: Date;
  createdByEmail?: string;
  createdById?: mongoose.Types.ObjectId;
  createdByRole?: string;
  staffAssignedLoginIds?: string[];
  updatedBy?: string;
  updatedByImageUrl?: string;
  updatedByEmail?: string;
  customerBillingAddress?: ICustomerBillingAddress;
  isDeleted?: boolean;
}
