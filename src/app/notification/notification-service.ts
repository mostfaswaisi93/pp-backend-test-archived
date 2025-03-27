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
    // if (!data.day || !data.fromTime || !data.toTime) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    let existingNotification = await Notification.findOne({
      // day: data.day,
    });
    if (existingNotification) {
      throw new InvalidInputException(
        "Notification already exists for this day"
      );
    }

    let notification = new Notification({
      // day: data.day,
      // status: data.status ?? "OPEN",
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

    // if (data.day) {
    //   let existingNotification = await Notification.findOne({
    //     day: data.day,
    //     _id: { $ne: _id },
    //   });
    //   if (existingNotification) {
    //     throw new InvalidInputException(
    //       "Notification already exists for this day"
    //     );
    //   }
    // }

    let updatedNotification = await Notification.findByIdAndUpdate(
      _id,
      {
        $set: {
          // day: data.day ?? notification.day,
          // fromTime: data.fromTime ?? notification.fromTime,
          // toTime: data.toTime ?? notification.toTime,
          // status: data.status ?? notification.status,
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
          // status: data.status || notification.status,
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
