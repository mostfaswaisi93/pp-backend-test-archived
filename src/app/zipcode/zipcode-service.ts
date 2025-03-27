import { Zipcode } from "../../models/zipcode/zipcode.model";
import { IZipcode } from "../../models/zipcode/zipcode.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class ZipcodeService {
  private static _instance: ZipcodeService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IZipcode) {
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
        throw new InvalidInputException(`Missing required field: ${field}`);
      }
    }

    let zipcodeExist = await Zipcode.findOne({
      zipcode: data.zipcode,
      stateCode: data.stateCode,
    });

    if (zipcodeExist) {
      throw new InvalidInputException("Zipcode already exists for this state");
    }

    let zipcode = new Zipcode({
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
      status: data.status ?? "ACTIVE",
    });

    try {
      return await zipcode.save();
    } catch (error) {
      throw error;
    }
  }

  public async getZipcodeById(_id: string) {
    const zipcode = await Zipcode.findById({ _id });
    if (!zipcode) throw new InvalidInputException("Zipcode not found");
    return zipcode;
  }

  public async getZipcodes() {
    const zipcodes = await Zipcode.find({ status: "ACTIVE" }).sort({
      zipcode: 1,
    });
    if (zipcodes.length === 0)
      throw new InvalidInputException("Zipcodes not found");
    return zipcodes;
  }

  public async update(_id: string, data: IZipcode) {
    const zipcode = await Zipcode.findById(_id);
    if (!zipcode) {
      throw new NotFoundException("Zipcode not found");
    }

    let updatedZipcode = await Zipcode.findByIdAndUpdate(
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

    if (!updatedZipcode)
      throw new InvalidInputException("Failed to update zipcode");
    return updatedZipcode;
  }

  public async updateStatus(_id: string, data: IZipcode) {
    let zipcode = await Zipcode.findOne({ _id });

    if (!zipcode) {
      throw new NotFoundException();
    }

    let updateStatus = await Zipcode.findByIdAndUpdate(
      _id,
      {
        $set: {
          status: data.status || zipcode.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Zipcode not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const zipcode = await Zipcode.findByIdAndDelete({ _id });
    if (!zipcode) throw new InvalidInputException("Zipcode not found");
  }
}
