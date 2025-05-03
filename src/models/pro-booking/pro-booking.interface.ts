import { Document } from "mongoose";

export interface IProBooking extends Document {
  proid?: string;
  bookingId?: string;
  proname?: string;
  proemail?: string;
  zipcode?: string;
  state?: string;
  city?: string;
  date?: string;
  time?: string;
  promobile?: string;
  mobile?: string;
  workscope?: string;
  email?: string;
  name?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
