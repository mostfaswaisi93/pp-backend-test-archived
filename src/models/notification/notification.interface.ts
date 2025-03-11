import { Document } from "mongoose";

export interface INotification extends Document {
  date: string;
  time: string;
  name: string;
  emailId: string;
  fireBaseId: string;
  deviceId: string;
  proId: string;
  proLoginId: string;
  proEmailId: string;
  role: string; // Default: 'STAFF'
  workordernumber: string;
  image: string;
  deleteFlag: boolean; // Default: false
  loginId: string;
  title: string;
  body: string;
  notificationType: string; // 'normal', 'question'
  isRead: boolean; // Default: false
  answer: string;
  otherData: object; // ALP CODE DO NOT TOUCH
}
