import mongoose, { Document } from "mongoose";

export interface IEquipmentCheckout extends Document {
  equipmentId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  didInspect: boolean;
  haveDamage: boolean;
  inspectDescription: string;
  damageDescription: string;
  haveMissingParts: boolean;
  notes: string;
  uploadedMedia: string[];
  signature: string;
  type: string;
}
