import { Promo } from "../../models/promo/promo.model";
import { IPromo } from "../../models/promo/promo.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class PromoService {
  private static _instance: PromoService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IPromo) {
    // if (!data.day || !data.fromTime || !data.toTime) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    let existingPromo = await Promo.findOne({
      // day: data.day,
    });
    if (existingPromo) {
      throw new InvalidInputException("Promo already exists for this day");
    }

    let promo = new Promo({
      // day: data.day,
      // status: data.status ?? "OPEN",
    });

    try {
      return await promo.save();
    } catch (error: any) {
      throw new Error("Error saving Promo: " + error.message);
    }
  }

  public async getPromoById(_id: string) {
    const promo = await Promo.findById({ _id });
    if (!promo) throw new InvalidInputException("Promo not found");
    return promo;
  }

  public async getPromos() {
    const promos = await Promo.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (promos.length === 0)
      throw new InvalidInputException("Promos not found");
    return promos;
  }

  public async update(_id: string, data: IPromo) {
    const promo = await Promo.findById(_id);
    if (!promo) {
      throw new NotFoundException("Promo not found");
    }

    // if (data.day) {
    //   let existingPromo = await Promo.findOne({
    //     day: data.day,
    //     _id: { $ne: _id },
    //   });
    //   if (existingPromo) {
    //     throw new InvalidInputException(
    //       "Promo already exists for this day"
    //     );
    //   }
    // }

    let updatedPromo = await Promo.findByIdAndUpdate(
      _id,
      {
        $set: {
          // day: data.day ?? promo.day,
          // fromTime: data.fromTime ?? promo.fromTime,
          // toTime: data.toTime ?? promo.toTime,
          // status: data.status ?? promo.status,
        },
      },
      { new: true }
    );

    if (!updatedPromo) {
      throw new InvalidInputException("Failed to update promo");
    }
    return updatedPromo;
  }

  public async updateStatus(_id: string, data: IPromo) {
    let promo = await Promo.findOne({ _id });

    if (!promo) {
      throw new NotFoundException();
    }

    let updateStatus = await Promo.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || promo.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Promo not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const promo = await Promo.findByIdAndDelete({ _id });
    if (!promo) throw new InvalidInputException("Promo not found");
  }
}
