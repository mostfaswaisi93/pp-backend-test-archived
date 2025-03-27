import { Year } from "../../models/year/year.model";
import { IYear } from "../../models/year/year.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class YearService {
  private static _instance: YearService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IYear) {
    if (data.year) {
      let yearExist = await Year.findOne({ year: data.year });
      if (yearExist) {
        throw new InvalidInputException("Year already exists");
      }
    }

    let year = new Year({
      year: data.year,
      status: data.status ?? "ACTIVE",
    });

    try {
      let result = await year.save();
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async getYearById(_id: string) {
    const year = await Year.findById({ _id });
    if (!year) throw new InvalidInputException("Year not found");
    return year;
  }

  public async getYears() {
    const years = await Year.find({ status: "ACTIVE" }).sort({
      year: -1,
    });
    if (years.length === 0) throw new InvalidInputException("Years not found");
    return years;
  }

  public async update(_id: string, data: IYear) {
    const year = await Year.findOne({ _id });
    if (!year) {
      throw new NotFoundException();
    }

    if (data.year && data.year !== year.year) {
      let yearExist = await Year.findOne({ year: data.year });
      if (yearExist && yearExist._id.toString() !== _id) {
        throw new InvalidInputException("Year already exists");
      }
    }

    let updatedYear = await Year.findByIdAndUpdate(
      _id,
      {
        $set: {
          year: data.year || year.year,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedYear) throw new InvalidInputException("Year not found");
    return updatedYear;
  }

  public async updateStatus(_id: string, data: IYear) {
    let year = await Year.findOne({ _id });

    if (!year) {
      throw new NotFoundException();
    }

    let updateStatus = await Year.findByIdAndUpdate(
      _id,
      {
        $set: {
          status: data.status || year.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Year not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const year = await Year.findByIdAndDelete({ _id });
    if (!year) throw new InvalidInputException("Year not found");
  }
}
