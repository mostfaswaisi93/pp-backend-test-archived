import { Types } from "mongoose";

export interface IEquipment {
  equipmentId: Types.ObjectId;
  staffName?: string;
  customerName?: string;
  staffId?: string;
  woId?: Types.ObjectId;
  address?: string;
  pickupTime?: Date;
  returnTime?: Date;
  actualPickupTime?: Date;
  actualReturnTime?: Date;
  pickupReminder?: boolean;
  returnReminder?: boolean;
  pickupReminderTime?: number;
  returnReminderTime?: number;
  notes?: string;
  bookingStatus?: number;
  status?: string;
  isCancelled?: boolean;
  cancellationTime?: Date;
  autoCancelled?: boolean;
  bookedBy?: string;
  incrementedTime?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
