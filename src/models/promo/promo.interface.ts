import { Document } from "mongoose";

export interface IPromo extends Document {
  _id: string;
  userId: string;
  proId: string;
  promoCode: string;
  promoName: string;
  vendorName: string;
  startDate: Date; // Changed from 'string' to 'Date' for accurate date storage
  endDate: Date; // Changed from 'string' to 'Date' for accurate date storage
  marketingMediaType: string;
  recurring: boolean; // Changed from 'string' to 'boolean' if it indicates whether the promo is recurring or not
  promoFees: number;
  promoPercentageValue: number; // Changed for better clarity
  promoPercentage: string;
  promoDollarValue: number; // Corrected spelling from 'promodollorValue' to 'promoDollarValue'
  totalPrice: number; // Followed camelCase convention
  totalTickets: number; // Corrected plural form from 'totalTicket' to 'totalTickets'
  description: string;
  mode: string;
  promoImages: string[]; // Followed plural form for consistency
  qrCodes: string[]; // Followed plural form for consistency
  promoServiceCost: number; // Followed camelCase convention
  notes: string; // Simplified the name
  createdBy: string;
  status: string;
  theme: string;
  isReadyToShare: boolean;
  lastEmailSendOn: Date;
  createdAt: Date;
  updatedAt: Date;
}
