import { Schema, model } from "mongoose";
import { INotification } from "./notification.interface";

const notificationSchema = new Schema<INotification>(
  {
    date: { type: String },
    time: { type: String },
    name: { type: String },
    emailId: { type: String },
    firebaseId: { type: String }, // Improve naming fireBaseId
    deviceId: { type: String },
    proId: { type: String },
    proLoginId: { type: String },
    proEmailId: { type: String },
    role: { type: String, default: "STAFF" },
    workOrderNumber: { type: String }, // Improve naming workordernumber
    image: { type: String },
    isDeleted: { type: Boolean, default: false }, // Improve naming deleteFlag
    userId: { type: String },
    title: { type: String },
    body: { type: String },
    type: { type: String }, // Improve naming notificationType
    isRead: { type: Boolean, default: false },
    answer: { type: String },
    otherData: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);
