import { Document } from "mongoose";

export interface IInventoryDetails {
  proId: string;
  loginId: string;
  itemId: string;
  itemName: string;
  purchaseDate: string;
  qrImage: string;
  location: string;
  description: string;
  manufacturer: string;
  markupValue: string;
  model: string;
  serialNo: string;
  size: string;
  sku: string;
  color: string;
  webLinkDetails: string;
  unit: string;
  categoryCode: string;
  categoryName: string;
  subCategory: string;
  subSubCategory?: string;
  vendor: string;
  purchasePrice: string;
  existingQty: number;
  qty: number;
  totalQuantity: number;
  listPrice: number;
  qrCode: string;
  inventoryImage: string[];
  status: string;
  createdBy: string;
  createdOn: string;
  updatedOn: string;
  updatedBy: string;
  type: string;
}

export interface IInventory extends Document {
  proId: string;
  isInventory: boolean;
  isPurchased: boolean;
  inventory: IInventoryDetails;
}
