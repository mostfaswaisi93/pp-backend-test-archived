import { Schema, model } from "mongoose";
import { IVendor } from "./vendor.interface";

const vendorSchema = new Schema<IVendor>(
  {
    proId: { type: String },
    loginId: { type: String },
    vendorId: { type: String },
    vendorName: { type: String },
    taxIdOrEIN: { type: String },
    accountRepName: { type: String },
    eligible1099: { type: Boolean },
    vendorCategory: { type: String },
    repEmailAddress: { type: String },
    accountNumber: { type: String },
    phoneNumber: { type: String },
    extensionNumber: { type: String },
    streetAddress: { type: String },
    unit: { type: String },
    state: { type: String },
    city: { type: String },
    zipCode: { type: String },
    specialNotes: { type: String },
    searchByValues: { type: String },
    searchBox: { type: String },
    createdOn: { type: String },
    createdBy: { type: String },
    updatedByImage: { type: String },
    updatedByName: { type: String },
    updatedByEmail: { type: String },
    status: { type: String, default: "ACTIVE" },
  },
  { timestamps: true }
);

export const Vendor = model<IVendor>("Vendor", vendorSchema);
