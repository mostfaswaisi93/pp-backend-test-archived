import mongoose, { Schema } from "mongoose";

import {
  IInventoryLocationItem,
  IInventoryLocations,
} from "./inventory-location.interface";

export const InventoryLocationItemSchema = new Schema<IInventoryLocationItem>({
  proId: { type: String },
  itemId: { type: String },
  location: { type: String },
  existingQuantity: { type: Number },
  vendor: { type: String },
  purchaseDate: { type: String },
  purchasePrice: { type: String },
  markupValue: { type: String },
  listPrice: { type: String },
  type: { type: String },
  createdDate: {
    type: String,
    default: () => new Date().toISOString().split("T")[0],
  },
});

const InventoryLocationsSchema = new Schema<IInventoryLocations>(
  {
    proId: { type: String },
    inventory_locations: [InventoryLocationItemSchema],
  },
  { timestamps: true }
);

export const InventoryLocationsModel = mongoose.model<IInventoryLocations>(
  "inventory_locations",
  InventoryLocationsSchema
);
