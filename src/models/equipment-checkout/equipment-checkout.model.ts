import mongoose, { Schema, model } from "mongoose";
import { IEquipmentCheckout } from "./equipment-checkout.interface";

const equipmentCheckoutSchema = new Schema<IEquipmentCheckout>(
  {
    // equipmentId: { type: mongoose.Types.ObjectId, ref: "work_equipment" },
    // bookingId: { type: mongoose.Types.ObjectId, ref: "book_equipment" },
    didInspect: { type: Boolean, required: true },
    haveDamage: { type: Boolean, required: true },
    inspectDescription: { type: String },
    damageDescription: { type: String },
    haveMissingParts: { type: Boolean, required: true },
    notes: { type: String },
    uploadedMedia: { type: [String] },
    signature: { type: String },
    type: { type: String },
  },
  { timestamps: true }
);

export const EquipmentCheckout = model<IEquipmentCheckout>(
  "EquipmentCheckout",
  equipmentCheckoutSchema
);
