import { Document } from "mongoose";

// Updated IPricebook interface with the new field names
export interface IPricebook extends Document {
  _id: string;

  // Renamed from userId to loginId for clarity
  userId: string;

  // Renamed from proId to clarify what it refers to (productId or projectId)
  proId: string;

  serviceId: string;
  category: string;
  subCategory: string;
  serviceTitle: string;

  // Renamed from leadCostApply to isLeadCostApplied
  isLeadCostApplied?: boolean;

  leadCost?: number;

  // Renamed from truckOrderCostApply to isTruckOrderCostApplied
  isTruckOrderCostApplied?: boolean;

  truckOrderCost?: number;

  // Renamed from inventory to inventoryItems for better clarity
  inventoryItems: object[];

  laborRate?: number;
  numberHours?: number;
  subTotal?: number;
  laborCost?: number;
  totalCost?: number;
  standard?: number;
  value?: number;
  member?: number;
  standardPercent?: number;
  valuePercent?: number;
  memberPercent?: number;
  totalMaterialCost?: number;

  // Renamed from image to imageUrls for better clarity
  imageUrls: string[];

  // Renamed filename to documentFilename for clarity
  documentFilename?: string;

  documentName?: string;
  serviceDescription?: string;
  installationDescription?: string;

  // Renamed from status to serviceStatus for clarity
  serviceStatus: string;

  // Renamed qrImage to qrImageUrl for better clarity
  qrImageUrl?: string;

  // Renamed createdOn and updatedOn to createdAt and updatedAt for consistency
  createdAt?: string;
  createdBy?: string;

  updatedAt?: string;
  updatedBy?: string;

  // Renamed createdByEmailId to createdByEmail for better clarity
  createdByEmail?: string;

  // Renamed updatedByEmailId to updatedByEmail for better clarity
  updatedByEmail?: string;

  updatedByImage?: string;
}
