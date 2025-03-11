import { Schema, model } from "mongoose";
import { INotification } from "./notification.interface";

const notificationSchema = new Schema<INotification>(
  {
    date: { type: String },
    time: { type: String },
    name: { type: String },
    emailId: { type: String },
    fireBaseId: { type: String },
    deviceId: { type: String },
    proId: { type: String },
    proLoginId: { type: String },
    proEmailId: { type: String },
    role: { type: String, default: "STAFF" },
    workordernumber: { type: String },
    image: { type: String },
    deleteFlag: { type: Boolean, default: false },
    loginId: { type: String },
    title: { type: String },
    body: { type: String },
    notificationType: { type: String },
    isRead: { type: Boolean, default: false },
    answer: { type: String },
    otherData: { type: Schema.Types.Mixed }, // ALP CODE DO NOT TOUCH
  },
  { timestamps: true }
);

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);
