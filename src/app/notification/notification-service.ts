import { Notification } from "../../models/notification/notification.model";
import { INotification } from "../../models/notification/notification.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class NotificationService {
  private static _instance: NotificationService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: INotification) {
    if (!data.title || !data.body) {
      throw new InvalidInputException("Missing required fields: title or body");
    }

    let existingNotification = await Notification.findOne({});
    if (existingNotification) {
      throw new InvalidInputException(
        "Notification already exists with similar details"
      );
    }

    let notification = new Notification({
      title: data.title,
      body: data.body,
      date: data.date,
      time: data.time,
      emailId: data.emailId,
      firebaseId: data.firebaseId,
      deviceId: data.deviceId,
      proId: data.proId,
      proLoginId: data.proLoginId,
      proEmailId: data.proEmailId,
      role: data.role ?? "STAFF",
      workOrderNumber: data.workOrderNumber,
      image: data.image,
      isDeleted: data.isDeleted ?? false,
      userId: data.userId,
      type: data.type,
      isRead: data.isRead ?? false,
      answer: data.answer,
      otherData: data.otherData,
    });

    try {
      return await notification.save();
    } catch (error: any) {
      throw new Error("Error saving notification: " + error.message);
    }
  }

  public async getNotificationById(_id: string) {
    const notification = await Notification.findById({ _id });
    if (!notification)
      throw new InvalidInputException("Notification not found");
    return notification;
  }

  public async getNotifications() {
    const notifications = await Notification.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (notifications.length === 0)
      throw new InvalidInputException("Notifications not found");
    return notifications;
  }

  public async update(_id: string, data: INotification) {
    const notification = await Notification.findById(_id);
    if (!notification) {
      throw new NotFoundException("Notification not found");
    }

    let updatedNotification = await Notification.findByIdAndUpdate(
      _id,
      {
        $set: {
          title: data.title ?? notification.title,
          body: data.body ?? notification.body,
          date: data.date ?? notification.date,
          time: data.time ?? notification.time,
          emailId: data.emailId ?? notification.emailId,
          firebaseId: data.firebaseId ?? notification.firebaseId,
          deviceId: data.deviceId ?? notification.deviceId,
          proId: data.proId ?? notification.proId,
          proLoginId: data.proLoginId ?? notification.proLoginId,
          proEmailId: data.proEmailId ?? notification.proEmailId,
          role: data.role ?? notification.role,
          workOrderNumber: data.workOrderNumber ?? notification.workOrderNumber,
          image: data.image ?? notification.image,
          isDeleted: data.isDeleted ?? notification.isDeleted,
          userId: data.userId ?? notification.userId,
          type: data.type ?? notification.type,
          isRead: data.isRead ?? notification.isRead,
          answer: data.answer ?? notification.answer,
          otherData: data.otherData ?? notification.otherData,
        },
      },
      { new: true }
    );

    if (!updatedNotification) {
      throw new InvalidInputException("Failed to update notification");
    }
    return updatedNotification;
  }

  public async updateStatus(_id: string, data: INotification) {
    let notification = await Notification.findOne({ _id });

    if (!notification) {
      throw new NotFoundException();
    }

    let updateStatus = await Notification.findByIdAndUpdate(
      _id,
      {
        $set: {
          // update status here
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus)
      throw new InvalidInputException("Notification not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const notification = await Notification.findByIdAndDelete({ _id });
    if (!notification)
      throw new InvalidInputException("Notification not found");
  }
}
