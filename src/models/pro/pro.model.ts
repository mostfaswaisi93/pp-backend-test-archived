import mongoose, { Schema } from "mongoose";
import { IPro } from "./pro.interface";

const proSchema = new Schema<IPro>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    dob: { type: Date }, // Changed to Date instead of String for better date handling
    socialSecurityNumber: { type: String }, // Changed to a more specific name
    proId: { type: String },
    qrCodeImage: { type: String }, // Changed to make it clearer
    userId: { type: String },
    businessName: { type: String, required: true },
    businessType: { type: String, required: true },
    businessAddress: { type: String, required: true },
    zipcode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    email: { type: String, required: true }, // Changed to "email" for clarity
    mobile: { type: String, required: true }, // Changed to "mobile" for simplicity
    leadPhoneNumber: { type: String, default: "" },
    latitude: { type: String },
    longitude: { type: String },
    companyLogo: { type: String },
    attachments: [{ type: Object }],
    proProfileImage: { type: String },
    businessHours: [{ type: Object }],
    vanlynk: { type: String },
    leadgen: { type: String },
    vanlynkStatus: { type: String },
    leadgenStatus: { type: String },
    license: { type: String, default: "0" },
    verified: { type: String },
    adminStatus: { type: String, default: "Active" },
    status: { type: String, required: true, default: "ACTIVE" },
    yelp_Address: {
      businessAddress: String,
      zipcode: String,
      city: String,
      state: String,
    },
    google_Address: {
      businessAddress: String,
      zipcode: String,
      city: String,
      state: String,
    },
    socialMediaLinks: {
      googleId: String,
      yelpId: String,
      googleRating: String,
      yelpRating: String,
      aggregateRating: String,
    },
    reviews: { avgRating: Number, noOfReviews: Number, noOfHired: Number },
    ratingsCount: {
      lessThanOne: Number,
      lessThanTwo: Number,
      lessThanThree: Number,
      lessThanFour: Number,
      lessThanFive: Number,
    },
    businessInformation: {
      businessDescription: String, // Changed to avoid repetition
      isBusinessSince: String,
      isInsured: String,
      isBonded: String,
      isWarrantyOffered: String,
      isCreditCardAccepted: String,
      isEstimatesFree: String,
      noOfEmployees: String,
      noOfTrucks: String, // Changed to use correct plural form
      aboutService: String,
    },
    licenseInfo: [{ type: Object }], // Changed to more meaningful name
    areaOfExpertise: { areaOfExpertise: String, additionalInfo: String },
    locations: [{ type: Object }],
    categoryName: [{ type: Object }],
    Summary: [{ type: Object }],
    serviceArea: [{ type: Object }],
    isFirstComponentCall: { type: String }, // Changed to more meaningful name
    countyDeleteFlag: { type: String }, // Changed to simplify and improve clarity
    roles: [{ type: Object }],
    permissions: [{ type: Object }],
    cards: [{ type: Object }],
    createdBy: { type: String },
    createdOn: { type: String },
    modifiedBy: { type: String },
    modifiedOn: { type: String },
    createdDate: { type: String },
    reportNote: { type: String },
    reportFile: { type: String },
    isTPAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Pro = mongoose.model<IPro>("Pro", proSchema);
export default Pro;
