import { Estimate } from "../../models/estimate/estimate.model";
import { IEstimate } from "../../models/estimate/estimate.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class EstimateService {
  private static _instance: EstimateService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IEstimate) {
    // if (!data.day || !data.fromTime || !data.toTime) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    let existingEstimate = await Estimate.findOne({
      // day: data.day,
    });
    if (existingEstimate) {
      throw new InvalidInputException("Estimate already exists for this day");
    }

    let estimate = new Estimate({
      // day: data.day,
      // status: data.status ?? "OPEN",
    });

    try {
      return await estimate.save();
    } catch (error: any) {
      throw new Error("Error saving estimate: " + error.message);
    }
  }

  public async getEstimateById(_id: string) {
    const estimate = await Estimate.findById({ _id });
    if (!estimate) throw new InvalidInputException("Estimate not found");
    return estimate;
  }

  public async getEstimates() {
    const estimates = await Estimate.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (estimates.length === 0)
      throw new InvalidInputException("Estimates not found");
    return estimates;
  }

  public async update(_id: string, data: IEstimate) {
    const estimate = await Estimate.findById(_id);
    if (!estimate) {
      throw new NotFoundException("Estimate not found");
    }

    // if (data.day) {
    //   let existingEstimate = await Estimate.findOne({
    //     day: data.day,
    //     _id: { $ne: _id },
    //   });
    //   if (existingEstimate) {
    //     throw new InvalidInputException(
    //       "Estimate already exists for this day"
    //     );
    //   }
    // }

    let updatedEstimate = await Estimate.findByIdAndUpdate(
      _id,
      {
        $set: {
          // day: data.day ?? estimate.day,
          // fromTime: data.fromTime ?? estimate.fromTime,
          // toTime: data.toTime ?? estimate.toTime,
          // status: data.status ?? estimate.status,
        },
      },
      { new: true }
    );

    if (!updatedEstimate) {
      throw new InvalidInputException("Failed to update estimate");
    }
    return updatedEstimate;
  }

  public async updateStatus(_id: string, data: IEstimate) {
    let estimate = await Estimate.findOne({ _id });

    if (!estimate) {
      throw new NotFoundException();
    }

    let updateStatus = await Estimate.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || estimate.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Estimate not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const estimate = await Estimate.findByIdAndDelete({ _id });
    if (!estimate) throw new InvalidInputException("Estimate not found");
  }
}
