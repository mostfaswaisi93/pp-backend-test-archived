import { Logger } from "../../commons/libs/logger";
import { BusinessHour } from "../../models/business-hour/business-hour.model";
import {
  IBusinessHour,
  BusinessHourStatus,
} from "../../models/business-hour/business-hour.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

const logger = Logger.Instance;

export class BusinessHourService {
  private static _instance: BusinessHourService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  public async create(data: IBusinessHour) {
    try {
      if (!data.day || !data.fromTime || !data.toTime) {
        throw new InvalidInputException("Missing required fields");
      }

      const existing = await BusinessHour.findOne({ day: data.day });
      if (existing) {
        logger.warn("Attempt to create existing business hour", {
          day: data.day,
        });
        throw new InvalidInputException(
          "Business hour already exists for this day"
        );
      }

      const businessHour = new BusinessHour({
        day: data.day,
        fromTime: data.fromTime,
        toTime: data.toTime,
        status: data.status ?? BusinessHourStatus.OPEN,
      });

      const result = await businessHour.save();
      logger.info("Business hour created successfully", {
        businessHour: result,
      });
      return result;
    } catch (error: any) {
      logger.error("Failed to create business hour", { error, data });
      throw error;
    }
  }

  public async getBusinessHourById(_id: string) {
    try {
      const businessHour = await BusinessHour.findById({ _id });
      if (!businessHour) {
        logger.warn("Business hour not found by ID", { _id });
        throw new InvalidInputException("Business hour not found");
      }
      logger.info("Business hour retrieved by ID", { _id, businessHour });
      return businessHour;
    } catch (error: any) {
      logger.error("Failed to get business hour by ID", { error, _id });
      throw error;
    }
  }

  public async getBusinessHours(status?: string, fields?: string) {
    try {
      const filter = status ? { status } : {};
      const projection = fields ? fields.split(",").join(" ") : "";

      const businessHours = await BusinessHour.find(filter, projection).sort({
        day: 1,
      });

      if (businessHours.length === 0) {
        logger.warn("No business hours found", { status, fields });
        throw new InvalidInputException("Business hours not found");
      }

      logger.info("Business hours retrieved", { count: businessHours.length });
      return businessHours;
    } catch (error: any) {
      logger.error("Failed to get business hours", { error, status, fields });
      throw error;
    }
  }

  public async update(_id: string, data: IBusinessHour) {
    try {
      const businessHour = await BusinessHour.findOne({ _id });
      if (!businessHour) {
        logger.warn("Business hour not found for update", { _id });
        throw new NotFoundException();
      }

      if (data.day && data.day !== businessHour.day) {
        const existing = await BusinessHour.findOne({
          day: data.day,
          _id: { $ne: _id },
        });
        if (existing) {
          logger.warn("Attempt to update business hour to an existing day", {
            _id,
            newDay: data.day,
          });
          throw new InvalidInputException(
            "Business hour already exists for this day"
          );
        }
      }

      const updatedBusinessHour = await BusinessHour.findByIdAndUpdate(
        _id,
        {
          $set: {
            day: data.day ?? businessHour.day,
            fromTime: data.fromTime ?? businessHour.fromTime,
            toTime: data.toTime ?? businessHour.toTime,
            status: data.status ?? businessHour.status,
          },
        },
        { new: true, runValidators: true }
      );

      if (!updatedBusinessHour) {
        logger.warn("Business hour not found after update attempt", { _id });
        throw new InvalidInputException("Business hour not found");
      }

      logger.info("Business hour updated successfully", {
        _id,
        updatedBusinessHour,
      });
      return updatedBusinessHour;
    } catch (error: any) {
      logger.error("Failed to update business hour", { error, _id, data });
      throw error;
    }
  }

  public async updateStatus(_id: string, data: IBusinessHour) {
    try {
      const businessHour = await BusinessHour.findOne({ _id });
      if (!businessHour) {
        logger.warn("Business hour not found for status update", { _id });
        throw new NotFoundException();
      }

      const updatedStatus = await BusinessHour.findByIdAndUpdate(
        _id,
        { $set: { status: data.status ?? businessHour.status } },
        { new: true }
      );

      if (!updatedStatus) {
        logger.warn("Business hour not found after status update attempt", {
          _id,
        });
        throw new InvalidInputException("Business hour not found");
      }

      logger.info("Business hour status updated successfully", {
        _id,
        updatedStatus,
      });
      return updatedStatus;
    } catch (error: any) {
      logger.error("Failed to update business hour status", {
        error,
        _id,
        data,
      });
      throw error;
    }
  }

  public async delete(_id: string) {
    try {
      const businessHour = await BusinessHour.findByIdAndDelete({ _id });
      if (!businessHour) {
        logger.warn("Business hour not found for deletion", { _id });
        throw new InvalidInputException("Business hour not found");
      }
      logger.info("Business hour deleted successfully", { _id, businessHour });
      return businessHour;
    } catch (error: any) {
      logger.error("Failed to delete business hour", { error, _id });
      throw error;
    }
  }
}
