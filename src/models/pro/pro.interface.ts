import { Document } from "mongoose";

export interface IPro extends Document {
  firstName: string;
  lastName: string;
  middleName?: string;
  dob?: string;
  socialSecurity?: string;
  proId?: string;
  qrImage?: string;
  userId?: string;
  businessName: string;
  businessType: string;
  businessAddress: string;
  zipcode: string;
  city: string;
  state: string;
  emailId: string;
  mobileNumber: string;
  leadPhoneNumber?: string;
  latitude?: string;
  longitude?: string;
  companyLogo?: string;
  attachments?: object[];
  proProfileImage?: string;
  businessHours?: object[];
  vanlynk?: string;
  leadgen?: string;
  vanlynkStatus?: string;
  leadgenStatus?: string;
  license?: string;
  verified?: string;
  adminStatus?: string;
  yelp_Address?: {
    businessAddress?: string;
    zipcode?: string;
    city?: string;
    state?: string;
  };
  google_Address?: {
    businessAddress?: string;
    zipcode?: string;
    city?: string;
    state?: string;
  };
  socialMediaLinks?: {
    googleId?: string;
    yelpId?: string;
    googleRating?: string;
    yelpRating?: string;
    aggregateRating?: string;
  };
  reviews?: {
    avgRating?: number;
    noOfReviews?: number;
    noOfHired?: number;
  };
  ratingsCount?: {
    lessThanOne?: number;
    lessThanTwo?: number;
    lessThanThree?: number;
    lessThanFour?: number;
    lessThanFive?: number;
  };
  businessInformation?: {
    businessInformation?: string;
    isBusinessSince?: string;
    isInsured?: string;
    isBonded?: string;
    isWarrantyOffered?: string;
    isCreditCardAccepted?: string;
    isEstimatesFree?: string;
    noOfEmployees?: string;
    noOftrucks?: string;
    aboutService?: string;
  };
  licenseDetails?: object[];
  areaOfExpertise?: {
    areaOfExpertise?: string;
    additionalInfo?: string;
  };
  locations?: object[];
  categoryName?: object[];
  Summary?: object[];
  serviceArea?: object[];
  firsttimecomponentcall?: string;
  DefaultCountyDeleteFlag?: string;
  roles?: object[];
  permissions?: object[];
  cards?: object[];
  createdBy?: string;
  createdOn?: string;
  modifiedBy?: string;
  modifiedOn?: string;
  createdDate?: string;
  reportNote?: string;
  reportFile?: string;
  isTPAdmin?: boolean;
  status: string;
}
