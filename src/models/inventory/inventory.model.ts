import { Schema, model } from "mongoose";
import { IInventory } from "./inventory.interface";

export const InventoryDetailsSchema = new Schema({
  proId: { type: String },
  loginId: { type: String },
  itemId: { type: String },
  itemName: { type: String },
  purchaseDate: { type: String },
  qrImage: { type: String },
  location: { type: String },
  description: { type: String },
  manufacturer: { type: String },
  markupValue: { type: String },
  model: { type: String },
  serialNo: { type: String },
  size: { type: String },
  sku: { type: String },
  color: { type: String },
  webLinkDetails: { type: String },
  unit: { type: String },
  categoryCode: { type: String },
  categoryName: { type: String },
  subCategory: { type: String },
  subSubCategory: { type: String, default: "" },
  vendor: { type: String },
  purchasePrice: { type: String },
  existingQty: { type: Number, default: 0 },
  qty: { type: Number, default: 0 },
  totalQuantity: { type: Number, default: 0 },
  listPrice: { type: Number, default: 0 },
  qrCode: { type: String },
  inventoryImage: { type: [String] },
  status: { type: String },
  createdBy: { type: String },
  createdOn: { type: String },
  updatedOn: { type: String },
  updatedBy: { type: String },
  type: { type: String },
});

const inventorySchema = new Schema<IInventory>(
  {
    proId: { type: String },
    isInventory: { type: Boolean },
    isPurchased: { type: Boolean },
    inventory: { type: InventoryDetailsSchema },
  },
  { timestamps: true }
);

export const Inventory = model<IInventory>("Inventory", inventorySchema);
