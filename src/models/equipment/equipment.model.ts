import mongoose, { Schema, model } from "mongoose";
import { IEquipment } from "./equipment.interface";

const equipmentSchema = new Schema<IEquipment>(
  {
    // equipmentId: { type: mongoose.Types.ObjectId, ref: "work_equipment" },
    staffName: { type: String },
    customerName: { type: String },
    staffId: { type: String },
    woId: { type: mongoose.Types.ObjectId, ref: "workorder" },
    address: { type: String },
    pickupTime: { type: Date },
    returnTime: { type: Date },
    actualPickupTime: { type: Date },
    actualReturnTime: { type: Date },
    pickupReminder: { type: Boolean },
    returnReminder: { type: Boolean },
    pickupReminderTime: { type: Number },
    returnReminderTime: { type: Number },
    notes: { type: String },
    bookingStatus: { type: Number },
    // status: { type: String, default: _myEQStatus.active },
    status: { type: String },
    isCancelled: { type: Boolean, default: false },
    cancellationTime: { type: Date },
    autoCancelled: { type: Boolean, default: false },
    bookedBy: { type: String },
    incrementedTime: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const Equipment = model<IEquipment>("Equipment", equipmentSchema);
