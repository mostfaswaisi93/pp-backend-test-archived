import { Document } from "mongoose";

export interface IPromo extends Document {
  loginId: string;
  proId: string;
  promotionCode: string;
  promotionName: string;
  vendorName: string;
  startDate: string;
  endDate: string;
  marketingMediaType: string;
  recurring: string;
  promotionFees: number;
  promotionpercentValue: number;
  promotionpercent: string;
  promotiondollorValue: number;
  totalprice: number;
  totalTicket: number;
  description: string;
  mode: string;
  promotionImage: string[];
  qrcode: string[];
  promotionservicecost: number;
  promotionNotes: string;
  createdBy: string;
  createdOn: string;
  status: string;
  theme: string;
  isReadyToShare: boolean;
  lastEmailSendOn?: Date;
  createdAt: Date;
  updatedAt: Date;
}
