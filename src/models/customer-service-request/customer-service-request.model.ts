import { Schema, model } from "mongoose";
import {
  ICustomerServiceRequest,
  Status,
} from "./customer-service-request.interface";

const customerServiceRequestSchema = new Schema<ICustomerServiceRequest>(
  {
    ticketNumber: { type: String, required: true },
    customerId: { type: String, required: true },
    workOrderNumber: { type: String, required: true },
    emailId: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // تحقق من صحة البريد الإلكتروني
    },
    date: { type: Date, required: true },
    projectName: { type: String, required: true },
    projectDescription: { type: String, required: true },
    status: { type: String, enum: Object.values(Status), default: Status.Open }, // استخدام enum للحالة
  },
  { timestamps: true }
);

export const CustomerServiceRequest = model<ICustomerServiceRequest>(
  "CustomerServiceRequest",
  customerServiceRequestSchema
);
