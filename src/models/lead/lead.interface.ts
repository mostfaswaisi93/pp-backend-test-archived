import { Document } from "mongoose";

export interface ILead extends Document {
  _id: string;
  userId: string;
  proId: string;
  leadCode: string;
  leadName: string;
  vendorName: string;
  startDate: Date; // Changed from 'string' to 'Date' for accurate date storage
  endDate: Date; // Changed from 'string' to 'Date' for accurate date storage
  marketingMediaType: string;
  recurring: boolean; // Changed from 'string' to 'boolean' if it indicates whether the lead is recurring or not
  leadFees: number;
  leadPercentageValue: number; // Changed for better clarity
  leadPercentage: string;
  leadDollarValue: number; // Corrected spelling from 'leaddollorValue' to 'leadDollarValue'
  totalPrice: number; // Followed camelCase convention
  totalTickets: number; // Corrected plural form from 'totalTicket' to 'totalTickets'
  description: string;
  mode: string;
  leadImages: string[]; // Followed plural form for consistency
  qrCodes: string[]; // Followed plural form for consistency
  leadServiceCost: number; // Followed camelCase convention
  notes: string; // Simplified the name
  createdBy: string;
  status: string;
  theme: string;
  isReadyToShare: boolean;
  lastEmailSendOn: Date;
  createdAt: Date;
  updatedAt: Date;
}
