import { Document } from "mongoose";

export enum Status {
  Open = "Open",
  InProgress = "In Progress",
  Closed = "Closed",
}

export interface ICustomerServiceRequest extends Document {
  ticketNumber: string;
  customerId: string;
  workOrderNumber: string;
  emailId: string;
  date: Date;
  projectName: string;
  projectDescription: string;
  status: Status;
}
