import { PriceList } from "../../models/price-list/price-list.model";
import { IPriceList } from "../../models/price-list/price-list.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class PriceListService {
  private static _instance: PriceListService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IPriceList) {
    // if (!data.day || !data.fromTime || !data.toTime) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    let existingPriceList = await PriceList.findOne({
      // day: data.day,
    });
    if (existingPriceList) {
      throw new InvalidInputException("Price list already exists for this day");
    }

    let priceList = new PriceList({
      // day: data.day,
      // status: data.status ?? "OPEN",
    });

    try {
      return await priceList.save();
    } catch (error: any) {
      throw new Error("Error saving price list: " + error.message);
    }
  }

  public async getPriceListById(_id: string) {
    const priceList = await PriceList.findById({ _id });
    if (!priceList) throw new InvalidInputException("Price list not found");
    return priceList;
  }

  public async getPriceLists() {
    const priceLists = await PriceList.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (priceLists.length === 0)
      throw new InvalidInputException("Price lists not found");
    return priceLists;
  }

  public async update(_id: string, data: IPriceList) {
    const priceList = await PriceList.findById(_id);
    if (!priceList) {
      throw new NotFoundException("Price list not found");
    }

    // if (data.day) {
    //   let existingPriceList = await PriceList.findOne({
    //     day: data.day,
    //     _id: { $ne: _id },
    //   });
    //   if (existingPriceList) {
    //     throw new InvalidInputException(
    //       "PriceList already exists for this day"
    //     );
    //   }
    // }

    let updatedPriceList = await PriceList.findByIdAndUpdate(
      _id,
      {
        $set: {
          // day: data.day ?? priceList.day,
          // fromTime: data.fromTime ?? priceList.fromTime,
          // toTime: data.toTime ?? priceList.toTime,
          // status: data.status ?? priceList.status,
        },
      },
      { new: true }
    );

    if (!updatedPriceList) {
      throw new InvalidInputException("Failed to update price list");
    }
    return updatedPriceList;
  }

  public async updateStatus(_id: string, data: IPriceList) {
    let priceList = await PriceList.findOne({ _id });

    if (!priceList) {
      throw new NotFoundException();
    }

    let updateStatus = await PriceList.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || priceList.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Price list not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const priceList = await PriceList.findByIdAndDelete({ _id });
    if (!priceList) throw new InvalidInputException("Price list not found");
  }
}
