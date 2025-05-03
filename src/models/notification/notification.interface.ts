import { Document } from "mongoose";

export interface INotification extends Document {
  date: string;
  time: string;
  name: string;
  emailId: string;
  firebaseId: string;
  deviceId: string;
  proId: string;
  proLoginId: string;
  proEmailId: string;
  role: string;
  workOrderNumber: string;
  image: string;
  isDeleted: boolean;
  userId: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  answer: string;
  otherData?: Record<string, unknown>;
}
