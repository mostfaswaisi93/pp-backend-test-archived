import mongoose, { Schema, Document } from "mongoose";
import { IProCustomer } from "./pro-customer.interface";

const proCustomerSchema: Schema = new Schema(
  {
    customerId: { type: String },
    customerEmailId: { type: String },
    proEmailId: { type: String },
    proUserId: { type: Schema.Types.ObjectId, ref: "User" },
    proId: { type: String },
    type: { type: String },
    customerUserId: { type: Schema.Types.ObjectId, ref: "User" },
    customerRef: { type: Schema.Types.ObjectId, ref: "Customer" },
    proRef: { type: Schema.Types.ObjectId, ref: "Pro" },
    customerType: { type: String, enum: ["Residential", "Business"] },
    businessName: { type: String },
    phoneNumber: { type: String },
    dispatchTextNumber: { type: String },
    source: { type: String },
    vendor: { type: String },
    paymentMethod: { type: String },
    creditLimit: { type: Number, default: 0 },
    paymentTerms: { type: String, default: "Upon Receipt" },
    taxExempt: { type: Boolean, default: false },
    poRequired: { type: Boolean, default: false },
    doNotServe: { type: Boolean, default: false },
    doNotServeReason: { type: String },
    subscribeToReceiveMarketingEmails: { type: Boolean, default: true },
    mediaFiles: [{ type: Object }],
    status: {
      type: String,
      enum: ["Active", "Inactive", "Do Not Serve"],
      default: "Active",
    },
    createdBy: { type: String },
    createdOn: { type: Date }, // changed type
    createdByEmail: { type: String },
    createdById: { type: Schema.Types.ObjectId },
    createdByRole: { type: String },
    staffAssignedLoginIds: { type: [String] },
    updatedBy: { type: String },
    updatedByImageUrl: { type: String },
    updatedByEmail: { type: String },
    customerBillingAddress: {
      firstName: { type: String },
      lastName: { type: String },
      userType: { type: String },
      address: { type: String },
      invoiceEmail: { type: String },
      city: { type: String },
      country: { type: String },
      state: { type: String },
      zipCode: { type: String },
      adminNotes: { type: String },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ProCustomer = mongoose.model<IProCustomer>(
  "ProCustomer",
  proCustomerSchema
);

export default ProCustomer;
