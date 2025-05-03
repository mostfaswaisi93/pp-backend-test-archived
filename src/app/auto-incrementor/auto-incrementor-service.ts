import { AutoIncrementor } from "../../models/auto-incrementor/auto-incrementor.model";
import { IAutoIncrementor } from "../../models/auto-incrementor/auto-incrementor.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class AutoIncrementorService {
  private static _instance: AutoIncrementorService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IAutoIncrementor) {
    // if (data.name) {
    //   let nameExist = await AutoIncrementor.findOne({ name: data.name });
    //   if (nameExist) {
    //     throw new InvalidInputException("Auto Incrementor name already exists");
    //   }
    // }

    let autoIncrementor = new AutoIncrementor({});

    try {
      let result = await autoIncrementor.save();
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async getAutoIncrementorById(_id: string) {
    const autoIncrementor = await AutoIncrementor.findById({ _id });
    if (!autoIncrementor)
      throw new InvalidInputException("Auto Incrementor not found");
    return autoIncrementor;
  }

  public async getLastAutoIncrementorId() {
    const lastAutoIncrementor = await AutoIncrementor.findOne().sort({
      _id: -1,
    });
    if (!lastAutoIncrementor)
      throw new InvalidInputException("There are no auto Incrementors.");
    return lastAutoIncrementor;
  }

  public async getAutoIncrementors() {
    const autoIncrementors = await AutoIncrementor.find({
      status: "ACTIVE",
    }).sort({
      name: 1,
    });
    if (autoIncrementors.length === 0)
      throw new InvalidInputException("AutoIncrementors not found");
    return autoIncrementors;
  }

  public async getAutoIncrementorsWithSSP() {
    const autoIncrementors = await AutoIncrementor.find({
      status: "ACTIVE",
    }).sort({
      name: 1,
    });
    if (autoIncrementors.length === 0)
      throw new InvalidInputException("Auto Incrementors not found");
    return autoIncrementors;
  }

  public async getAutoIncrementorName(body: any) {
    if (!Array.isArray(body)) {
      return {
        error: true,
        message: "Invalid request body. An array is expected.",
      };
    }

    const tradeLicenseArray: string[] = body.map(
      (item: { tradeLicense: string }) => item.tradeLicense
    );

    const autoIncrementors = await AutoIncrementor.find({
      status: "ACTIVE",
      code: { $in: tradeLicenseArray },
    });

    if (autoIncrementors.length === 0)
      throw new InvalidInputException("Auto Incrementors not found");
    return { error: false, autoIncrementors: autoIncrementors ?? [] };
  }

  public async update(_id: string, data: IAutoIncrementor) {
    const autoIncrementor = await AutoIncrementor.findOne({ _id });
    if (!autoIncrementor) {
      throw new NotFoundException();
    }

    let updatedAutoIncrementor = await AutoIncrementor.findByIdAndUpdate(
      _id,
      {
        $set: {},
      },
      {
        new: true,
      }
    );

    if (!updatedAutoIncrementor)
      throw new InvalidInputException("Auto Incrementor not found");
    return updatedAutoIncrementor;
  }

  public async updateStatus(_id: string, data: IAutoIncrementor) {
    let autoIncrementor = await AutoIncrementor.findOne({ _id });

    if (!autoIncrementor) {
      throw new NotFoundException();
    }

    let updateStatus = await AutoIncrementor.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || autoIncrementor.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus)
      throw new InvalidInputException("Auto Incrementor not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const autoIncrementor = await AutoIncrementor.findByIdAndDelete({ _id });
    if (!autoIncrementor)
      throw new InvalidInputException("Auto Incrementor not found");
  }
}
