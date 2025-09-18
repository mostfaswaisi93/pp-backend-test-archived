import { Logger } from "../../commons/libs/logger";
import { Year } from "../../models/year/year.model";
import { IYear } from "../../models/year/year.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

const logger = Logger.Instance;

export class YearService {
  private static _instance: YearService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IYear) {
    try {
      if (data.year) {
        const currentYear = new Date().getFullYear();
        const maxAllowedYear = currentYear + 1;

        if (data.year > maxAllowedYear) {
          throw new InvalidInputException(
            `Year cannot be greater than ${maxAllowedYear}`
          );
        }

        let yearExist = await Year.findOne({ year: data.year });
        if (yearExist) {
          logger.warn("Attempt to create existing year", { year: data.year });
          throw new InvalidInputException("Year already exists");
        }
      }

      let year = new Year({
        year: data.year,
        status: data.status ?? "ACTIVE",
      });

      let result = await year.save();
      logger.info("Year created successfully", { year: result });
      return result;
    } catch (error: any) {
      logger.error("Failed to create year", { error, data });
      throw error;
    }
  }

  public async getYearById(_id: string) {
    try {
      const year = await Year.findById({ _id });
      if (!year) {
        logger.warn("Year not found by ID", { _id });
        throw new InvalidInputException("Year not found");
      }
      logger.info("Year retrieved by ID", { _id, year });
      return year;
    } catch (error: any) {
      logger.error("Failed to get year by ID", { error, _id });
      throw error;
    }
  }

  public async getYears(status?: string, fields?: string) {
    try {
      const filter = status ? { status } : {};
      const projection = fields ? fields.split(",").join(" ") : "";

      const years = await Year.find(filter, projection).sort({ year: -1 });

      if (years.length === 0) {
        logger.warn("No years found", { status, fields });
        throw new InvalidInputException("Years not found");
      }

      logger.info("Years retrieved", { count: years.length });
      return years;
    } catch (error: any) {
      logger.error("Failed to get years", { error, status, fields });
      throw error;
    }
  }

  public async update(_id: string, data: IYear) {
    try {
      const year = await Year.findOne({ _id });
      if (!year) {
        logger.warn("Year not found for update", { _id });
        throw new NotFoundException();
      }

      if (data.year && data.year !== year.year) {
        const currentYear = new Date().getFullYear();
        const maxAllowedYear = currentYear + 1;

        if (data.year > maxAllowedYear) {
          throw new InvalidInputException(
            `Year cannot be greater than ${maxAllowedYear}`
          );
        }

        let yearExist = await Year.findOne({ year: data.year });
        if (yearExist && yearExist._id.toString() !== _id) {
          logger.warn("Attempt to update year to an existing year", {
            _id,
            newYear: data.year,
          });
          throw new InvalidInputException("Year already exists");
        }
      }

      let updatedYear = await Year.findByIdAndUpdate(
        _id,
        { $set: { year: data.year || year.year } },
        { new: true, runValidators: true }
      );

      if (!updatedYear) {
        logger.warn("Year not found after update attempt", { _id });
        throw new InvalidInputException("Year not found");
      }

      logger.info("Year updated successfully", { _id, updatedYear });
      return updatedYear;
    } catch (error: any) {
      logger.error("Failed to update year", { error, _id, data });
      throw error;
    }
  }

  public async updateStatus(_id: string, data: IYear) {
    try {
      let year = await Year.findOne({ _id });
      if (!year) {
        logger.warn("Year not found for status update", { _id });
        throw new NotFoundException();
      }

      let updatedStatus = await Year.findByIdAndUpdate(
        _id,
        { $set: { status: data.status || year.status } },
        { new: true }
      );

      if (!updatedStatus) {
        logger.warn("Year not found after status update attempt", { _id });
        throw new InvalidInputException("Year not found");
      }

      logger.info("Year status updated successfully", { _id, updatedStatus });
      return updatedStatus;
    } catch (error: any) {
      logger.error("Failed to update year status", { error, _id, data });
      throw error;
    }
  }

  public async delete(_id: string) {
    try {
      const year = await Year.findByIdAndDelete({ _id });
      if (!year) {
        logger.warn("Year not found for deletion", { _id });
        throw new InvalidInputException("Year not found");
      }
      logger.info("Year deleted successfully", { _id, year });
      return year;
    } catch (error: any) {
      logger.error("Failed to delete year", { error, _id });
      throw error;
    }
  }
}
