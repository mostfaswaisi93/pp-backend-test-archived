import { Document } from "mongoose";

export interface IInventoryLocationItem {
  proId: string;
  itemId: string;
  location: string;
  existingQuantity: number;
  vendor: string;
  purchaseDate: string;
  purchasePrice: string;
  markupValue: string;
  listPrice: string;
  type: string;
  createdDate?: string;
}

export interface IInventoryLocations extends Document {
  proId: string;
  inventory_locations: IInventoryLocationItem[];
}
