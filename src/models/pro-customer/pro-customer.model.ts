import mongoose, { Schema, Document } from "mongoose";
import { IProCustomer } from "./pro-customer.interface";

const ProCustomerSchema: Schema = new Schema(
  {
    customerId: { type: String },
    customerEmailId: { type: String },
    proEmailId: { type: String },
    proLoginId: { type: mongoose.Schema.Types.ObjectId, ref: "Login" },
    proId: { type: String },
    customerLoginId: { type: mongoose.Schema.Types.ObjectId, ref: "Login" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    pro: { type: mongoose.Schema.Types.ObjectId, ref: "Pro" },
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
    doNotServeNotes: { type: String },
    SubscribeToReceiveMarketingEmails: { type: Boolean, default: true },
    picturesAndVideos: [{ type: Object }],
    status: {
      type: String,
      enum: ["Active", "InActive", "Do Not Serve"],
      default: "Active",
    },
    createdBy: { type: String },
    createdOn: { type: String },
    createdByEmail: { type: String },
    createdByLoginId: { type: mongoose.Schema.Types.ObjectId },
    createdByRole: { type: String },
    staffAssignedLoginIds: { type: Array },
    updatedBy: { type: String },
    updatedByImage: { type: String },
    updatedByEmail: { type: String },
    customerBillingAddress: { type: Object },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ProCustomer = mongoose.model<IProCustomer>(
  "ProCustomer",
  ProCustomerSchema
);

export default ProCustomer;
