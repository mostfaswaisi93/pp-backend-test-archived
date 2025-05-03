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
    if (
      !data.promoCode ||
      !data.promoName ||
      !data.startDate ||
      !data.endDate
    ) {
      throw new InvalidInputException("Missing required fields");
    }

    const existingPromo = await Promo.findOne({ promoCode: data.promoCode });
    if (existingPromo) {
      throw new InvalidInputException("Promo with this code already exists");
    }

    try {
      const promo = new Promo({
        userId: data.userId,
        proId: data.proId,
        promoCode: data.promoCode,
        promoName: data.promoName,
        vendorName: data.vendorName,
        startDate: data.startDate,
        endDate: data.endDate,
        marketingMediaType: data.marketingMediaType,
        recurring: data.recurring,
        promoFees: data.promoFees,
        promoPercentageValue: data.promoPercentageValue,
        promoPercentage: data.promoPercentage,
        promoDollarValue: data.promoDollarValue,
        totalPrice: data.totalPrice,
        totalTickets: data.totalTickets,
        description: data.description,
        mode: data.mode,
        promoImages: data.promoImages,
        qrCodes: data.qrCodes,
        promoServiceCost: data.promoServiceCost,
        notes: data.notes,
        createdBy: data.createdBy,
        status: data.status ?? "DRAFT",
        theme: data.theme,
        isReadyToShare: data.isReadyToShare,
        lastEmailSendOn: data.lastEmailSendOn,
      });
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
    const promos = await Promo.find({ status: "ACTIVE" }).sort({
      startDate: 1,
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

    if (data.promoCode) {
      const existingPromo = await Promo.findOne({
        promoCode: data.promoCode,
        _id: { $ne: _id },
      });
      if (existingPromo) {
        throw new InvalidInputException(
          "Another promo with this code already exists"
        );
      }
    }

    try {
      const updatedPromo = await Promo.findByIdAndUpdate(
        _id,
        {
          $set: {
            userId: data.userId,
            proId: data.proId,
            promoCode: data.promoCode,
            promoName: data.promoName,
            vendorName: data.vendorName,
            startDate: data.startDate,
            endDate: data.endDate,
            marketingMediaType: data.marketingMediaType,
            recurring: data.recurring,
            promoFees: data.promoFees,
            promoPercentageValue: data.promoPercentageValue,
            promoPercentage: data.promoPercentage,
            promoDollarValue: data.promoDollarValue,
            totalPrice: data.totalPrice,
            totalTickets: data.totalTickets,
            description: data.description,
            mode: data.mode,
            promoImages: data.promoImages,
            qrCodes: data.qrCodes,
            promoServiceCost: data.promoServiceCost,
            notes: data.notes,
            createdBy: data.createdBy,
            status: data.status,
            theme: data.theme,
            isReadyToShare: data.isReadyToShare,
            lastEmailSendOn: data.lastEmailSendOn,
          },
        },
        { new: true }
      );

      if (!updatedPromo) {
        throw new InvalidInputException("Failed to update promo");
      }
      return updatedPromo;
    } catch (error: any) {
      throw new Error("Error updating Promo: " + error.message);
    }
  }

  public async updateStatus(_id: string, status: string) {
    const promo = await Promo.findById(_id);
    if (!promo) {
      throw new NotFoundException("Promo not found");
    }

    try {
      const updateStatus = await Promo.findByIdAndUpdate(
        _id,
        { $set: { status } },
        { new: true }
      );

      if (!updateStatus)
        throw new InvalidInputException("Failed to update status");
      return updateStatus;
    } catch (error: any) {
      throw new Error("Error updating promo status: " + error.message);
    }
  }

  public async delete(_id: string) {
    const promo = await Promo.findByIdAndDelete(_id);
    if (!promo) throw new InvalidInputException("Promo not found");
  }
}
