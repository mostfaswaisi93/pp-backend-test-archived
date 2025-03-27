import { Pricebook } from "../../models/pricebook/pricebook.model";
import { IPricebook } from "../../models/pricebook/pricebook.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class PricebookService {
  private static _instance: PricebookService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IPricebook) {
    // if (!data.day || !data.fromTime || !data.toTime) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    let existingPricebook = await Pricebook.findOne({
      // day: data.day,
    });
    if (existingPricebook) {
      throw new InvalidInputException("Pricebook already exists for this day");
    }

    let pricebook = new Pricebook({
      // day: data.day,
      // status: data.status ?? "OPEN",
    });

    try {
      return await pricebook.save();
    } catch (error: any) {
      throw new Error("Error saving pricebook: " + error.message);
    }
  }

  public async getPricebookById(_id: string) {
    const pricebook = await Pricebook.findById({ _id });
    if (!pricebook) throw new InvalidInputException("Pricebook not found");
    return pricebook;
  }

  public async getPricebooks() {
    const Pricebooks = await Pricebook.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (Pricebooks.length === 0)
      throw new InvalidInputException("Pricebooks not found");
    return Pricebooks;
  }

  public async update(_id: string, data: IPricebook) {
    const pricebook = await Pricebook.findById(_id);
    if (!pricebook) {
      throw new NotFoundException("Pricebook not found");
    }

    // if (data.day) {
    //   let existingPricebook = await Pricebook.findOne({
    //     day: data.day,
    //     _id: { $ne: _id },
    //   });
    //   if (existingPricebook) {
    //     throw new InvalidInputException(
    //       "Pricebook already exists for this day"
    //     );
    //   }
    // }

    let updatedPricebook = await Pricebook.findByIdAndUpdate(
      _id,
      {
        $set: {
          // day: data.day ?? pricebook.day,
          // fromTime: data.fromTime ?? pricebook.fromTime,
          // toTime: data.toTime ?? pricebook.toTime,
          // status: data.status ?? pricebook.status,
        },
      },
      { new: true }
    );

    if (!updatedPricebook) {
      throw new InvalidInputException("Failed to update pricebook");
    }
    return updatedPricebook;
  }

  public async updateStatus(_id: string, data: IPricebook) {
    let pricebook = await Pricebook.findOne({ _id });

    if (!pricebook) {
      throw new NotFoundException();
    }

    let updateStatus = await Pricebook.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || pricebook.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Pricebook not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const pricebook = await Pricebook.findByIdAndDelete({ _id });
    if (!pricebook) throw new InvalidInputException("Pricebook not found");
  }
}
