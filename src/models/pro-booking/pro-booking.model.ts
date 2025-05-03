import { Schema, model } from "mongoose";
import { IProBooking } from "./pro-booking.interface";

const proBookingSchema = new Schema<IProBooking>(
  {
    proid: { type: String },
    bookingId: { type: String },
    proname: { type: String },
    proemail: { type: String },
    zipcode: { type: String },
    state: { type: String },
    city: { type: String },
    date: { type: String },
    time: { type: String },
    promobile: { type: String },
    mobile: { type: String },
    workscope: { type: String },
    email: { type: String },
    name: { type: String },
    status: { type: String, default: "ACTIVE" },
  },
  { timestamps: true }
);

export const ProBooking = model<IProBooking>("ProBooking", proBookingSchema);
