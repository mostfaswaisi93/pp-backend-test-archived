import { Document } from "mongoose";

export interface IAccountSetting extends Document {
  _id: string;
  userId?: string;
  General?: Record<string, any>[];
  StaffRoles?: Record<string, any>[];
  StaffAgreements?: Record<string, any>[];
  LogInAgreements?: Record<string, any>[];
  Inventory?: Record<string, any>[];
  markups?: Record<string, any>[];
  priceBookPackageName?: Record<string, any>[];
  pricebookServiceSubCategories?: Record<string, any>[];
  equipmentItemType?: Record<string, any>[];
  equipmentStatus?: Record<string, any>[];
  EstimatePriceBook?: Record<string, any>[];
  invoice?: Record<string, any>[];
  equipment?: Record<string, any>[];
  marketingMediaType?: Record<string, any>[];
  Vendors?: Record<string, any>[];
  preWorkInsepection?: Record<string, any>[];
  postWorkInsepection?: Record<string, any>[];
  messagesandalerts?: Record<string, any>[];
  Timecard?: Record<string, any>[];
  payment_geteWay?: Record<string, any>[];
  payrollFrequency?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
