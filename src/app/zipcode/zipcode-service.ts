import { Logger } from "../../commons/libs/logger";
import { Status } from "../../commons/constants/constants";
import { Zipcode } from "../../models/zipcode/zipcode.model";
import { IZipcode } from "../../models/zipcode/zipcode.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

const logger = Logger.Instance;

export class ZipcodeService {
  private static _instance: ZipcodeService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  public async create(data: Partial<IZipcode>) {
    try {
      const requiredFields: (keyof IZipcode)[] = [
        "zipcode",
        "latitude",
        "longitude",
        "city",
        "state",
        "stateCode",
        "county",
        "type",
        "totalHousesCount",
        "medianHouseholdIncome",
        "totalPopulation",
      ];

      for (const field of requiredFields) {
        if (!(field in data)) {
          logger.warn("Missing required field", { field, data });
          throw new InvalidInputException(`Missing required field: ${field}`);
        }
      }

      const exists = await Zipcode.findOne({
        zipcode: data.zipcode,
        stateCode: data.stateCode,
      });

      if (exists) {
        logger.warn("Attempt to create existing zipcode", { data });
        throw new InvalidInputException(
          "Zipcode already exists for this state"
        );
      }

      const zipcode = new Zipcode({
        zipcode: data.zipcode,
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        state: data.state,
        stateCode: data.stateCode,
        county: data.county,
        type: data.type,
        totalHousesCount: data.totalHousesCount,
        medianHouseholdIncome: data.medianHouseholdIncome,
        totalPopulation: data.totalPopulation,
        status: data.status ?? Status.ACTIVE,
      });

      const result = await zipcode.save();
      logger.info("Zipcode created successfully", { zipcode: result });
      return result;
    } catch (error: any) {
      logger.error("Failed to create zipcode", { error, data });
      throw error;
    }
  }

  public async getZipcodeById(_id: string) {
    try {
      const zipcode = await Zipcode.findById(_id);
      if (!zipcode) {
        logger.warn("Zipcode not found by ID", { _id });
        throw new NotFoundException("Zipcode not found");
      }
      logger.info("Zipcode retrieved by ID", { _id, zipcode });
      return zipcode;
    } catch (error: any) {
      logger.error("Failed to get zipcode by ID", { error, _id });
      throw error;
    }
  }

  public async getZipcodes(status?: string, fields?: string) {
    try {
      const filter = status ? { status } : {};
      const projection = fields ? fields.split(",").join(" ") : "";

      const zipcodes = await Zipcode.find(filter, projection).sort({
        zipcode: 1,
      });

      if (!zipcodes.length) {
        logger.warn("No zipcodes found", { status, fields });
        throw new NotFoundException("Zipcodes not found");
      }

      logger.info("Zipcodes retrieved successfully", {
        count: zipcodes.length,
      });
      return zipcodes;
    } catch (error: any) {
      logger.error("Failed to get zipcodes", { error, status, fields });
      throw error;
    }
  }

  public async update(_id: string, data: Partial<IZipcode>) {
    try {
      const zipcode = await Zipcode.findById(_id);
      if (!zipcode) {
        logger.warn("Zipcode not found for update", { _id });
        throw new NotFoundException("Zipcode not found");
      }

      if (data.zipcode && data.stateCode) {
        const existing = await Zipcode.findOne({
          zipcode: data.zipcode,
          stateCode: data.stateCode,
          _id: { $ne: _id },
        });
        if (existing) {
          logger.warn("Attempt to update zipcode to an existing combination", {
            _id,
            data,
          });
          throw new InvalidInputException(
            "Zipcode already exists for this state"
          );
        }
      }

      const updated = await Zipcode.findByIdAndUpdate(
        _id,
        {
          $set: {
            zipcode: data.zipcode ?? zipcode.zipcode,
            latitude: data.latitude ?? zipcode.latitude,
            longitude: data.longitude ?? zipcode.longitude,
            city: data.city ?? zipcode.city,
            state: data.state ?? zipcode.state,
            stateCode: data.stateCode ?? zipcode.stateCode,
            county: data.county ?? zipcode.county,
            type: data.type ?? zipcode.type,
            totalHousesCount: data.totalHousesCount ?? zipcode.totalHousesCount,
            medianHouseholdIncome:
              data.medianHouseholdIncome ?? zipcode.medianHouseholdIncome,
            totalPopulation: data.totalPopulation ?? zipcode.totalPopulation,
            status: data.status ?? zipcode.status,
          },
        },
        { new: true }
      );

      if (!updated) {
        logger.warn("Failed to update zipcode", { _id, data });
        throw new InvalidInputException("Failed to update zipcode");
      }

      logger.info("Zipcode updated successfully", { _id, updated });
      return updated;
    } catch (error: any) {
      logger.error("Failed to update zipcode", { error, _id, data });
      throw error;
    }
  }

  public async updateStatus(_id: string, data: Partial<IZipcode>) {
    try {
      const zipcode = await Zipcode.findById(_id);
      if (!zipcode) {
        logger.warn("Zipcode not found for status update", { _id });
        throw new NotFoundException("Zipcode not found");
      }

      const updatedStatus = await Zipcode.findByIdAndUpdate(
        _id,
        { $set: { status: data.status ?? zipcode.status } },
        { new: true }
      );

      if (!updatedStatus) {
        logger.warn("Zipcode not found after status update attempt", { _id });
        throw new InvalidInputException("Zipcode not found");
      }

      logger.info("Zipcode status updated successfully", {
        _id,
        updatedStatus,
      });
      return updatedStatus;
    } catch (error: any) {
      logger.error("Failed to update zipcode status", { error, _id, data });
      throw error;
    }
  }

  public async delete(_id: string) {
    try {
      const zipcode = await Zipcode.findByIdAndDelete(_id);
      if (!zipcode) {
        logger.warn("Zipcode not found for deletion", { _id });
        throw new NotFoundException("Zipcode not found");
      }
      logger.info("Zipcode deleted successfully", { _id, zipcode });
      return zipcode;
    } catch (error: any) {
      logger.error("Failed to delete zipcode", { error, _id });
      throw error;
    }
  }
}
