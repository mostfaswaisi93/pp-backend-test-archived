import dotenv from "dotenv";
import { Notification } from "../models/notification/notification.model";

dotenv.config();

export const runNotificationSeeder = async () => {
  const notificationData = [
    {
      date: "2025-03-19",
      time: "09:00:00",
      name: "User 1",
      emailId: "user1@example.com",
      fireBaseId: "firebase-id-1",
      deviceId: "device-id-1",
      proId: "pro-id-1",
      proLoginId: "pro-login-id-1",
      proEmailId: "pro-email-id-1",
      role: "STAFF",
      workordernumber: "WO12345",
      image: "image-url",
      isDeleted: false,
      userId: "user-id-1",
      title: "Notification Title 1",
      body: "Notification body content goes here.",
      type: "Reminder",
      isRead: false,
      answer: "",
      otherData: {},
    },
    {
      date: "2025-03-19",
      time: "09:00:00",
      name: "User 2",
      emailId: "user2@example.com",
      fireBaseId: "firebase-id-2",
      deviceId: "device-id-2",
      proId: "pro-id-2",
      proLoginId: "pro-login-id-2",
      proEmailId: "pro-email-id-2",
      role: "ADMIN",
      workordernumber: "WO67890",
      image: "image-url-2",
      isDeleted: false,
      userId: "user-id-2",
      title: "Notification Title 2",
      body: "Notification body content for User 2.",
      type: "Alert",
      isRead: false,
      answer: "",
      otherData: {},
    },
  ];

  try {
    await Notification.insertMany(notificationData);
    console.log("Notification seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting notification seed data:", error);
  }
};
