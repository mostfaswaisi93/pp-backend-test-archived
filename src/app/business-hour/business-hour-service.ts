import { BusinessHour } from "../../models/business-hour/business-hour.model";
import { IBusinessHour } from "../../models/business-hour/business-hour.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class BusinessHourService {
  private static _instance: BusinessHourService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IBusinessHour) {
    if (!data.day || !data.fromTime || !data.toTime) {
      throw new InvalidInputException("Missing required fields");
    }

    let existingBusinessHour = await BusinessHour.findOne({ day: data.day });
    if (existingBusinessHour) {
      throw new InvalidInputException(
        "Business hour already exists for this day"
      );
    }

    let businessHour = new BusinessHour({
      day: data.day,
      fromTime: data.fromTime,
      toTime: data.toTime,
      status: data.status ?? "OPEN",
    });

    try {
      return await businessHour.save();
    } catch (error: any) {
      throw new Error("Error saving business hour: " + error.message);
    }
  }

  public async getBusinessHourById(_id: string) {
    const businessHour = await BusinessHour.findById({ _id });
    if (!businessHour)
      throw new InvalidInputException("Business hour not found");
    return businessHour;
  }

  public async getBusinessHours() {
    const businessHours = await BusinessHour.find({ status: "ACTIVE" }).sort({
      state: 1,
    });
    if (businessHours.length === 0)
      throw new InvalidInputException("Business hours not found");
    return businessHours;
  }

  public async update(_id: string, data: IBusinessHour) {
    const businessHour = await BusinessHour.findById(_id);
    if (!businessHour) {
      throw new NotFoundException("Business hour not found");
    }

    if (data.day) {
      let existingBusinessHour = await BusinessHour.findOne({
        day: data.day,
        _id: { $ne: _id },
      });
      if (existingBusinessHour) {
        throw new InvalidInputException(
          "Business hour already exists for this day"
        );
      }
    }

    let updatedBusinessHour = await BusinessHour.findByIdAndUpdate(
      _id,
      {
        $set: {
          day: data.day ?? businessHour.day,
          fromTime: data.fromTime ?? businessHour.fromTime,
          toTime: data.toTime ?? businessHour.toTime,
          status: data.status ?? businessHour.status,
        },
      },
      { new: true }
    );

    if (!updatedBusinessHour) {
      throw new InvalidInputException("Failed to update business hour");
    }
    return updatedBusinessHour;
  }

  public async updateStatus(_id: string, data: IBusinessHour) {
    let businessHour = await BusinessHour.findOne({ _id });

    if (!businessHour) {
      throw new NotFoundException();
    }

    let updateStatus = await BusinessHour.findByIdAndUpdate(
      _id,
      {
        $set: {
          status: data.status || businessHour.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus)
      throw new InvalidInputException("Business hour not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const businessHour = await BusinessHour.findByIdAndDelete({ _id });
    if (!businessHour)
      throw new InvalidInputException("Business hour not found");
  }
}
