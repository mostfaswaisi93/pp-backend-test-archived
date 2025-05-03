import { Billing } from "../../models/billing/billing.model";
import { IBilling } from "../../models/billing/billing.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class BillingService {
  private static _instance: BillingService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IBilling) {
    // if (
    //   !data.BillingCode ||
    //   !data.BillingName ||
    //   !data.startDate ||
    //   !data.endDate
    // ) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    // const existingBilling = await Billing.findOne({
    //   BillingCode: data.BillingCode,
    // });
    // if (existingBilling) {
    //   throw new InvalidInputException("Billing with this code already exists");
    // }

    try {
      const billing = new Billing({});
      return await billing.save();
    } catch (error: any) {
      throw new Error("Error saving billing: " + error.message);
    }
  }

  public async getBillingById(_id: string) {
    const billing = await Billing.findById({ _id });
    if (!billing) throw new InvalidInputException("Billing not found");
    return billing;
  }

  public async getBillings() {
    const billings = await Billing.find({ status: "ACTIVE" }).sort({
      startDate: 1,
    });
    if (billings.length === 0)
      throw new InvalidInputException("Billings not found");
    return billings;
  }

  public async update(_id: string, data: IBilling) {
    const billing = await Billing.findById(_id);
    if (!billing) {
      throw new NotFoundException("Billing not found");
    }

    // if (data.BillingCode) {
    //   const existingBilling = await Billing.findOne({
    //     BillingCode: data.BillingCode,
    //     _id: { $ne: _id },
    //   });
    //   if (existingBilling) {
    //     throw new InvalidInputException(
    //       "Another billing with this code already exists"
    //     );
    //   }
    // }

    try {
      const updatedBilling = await Billing.findByIdAndUpdate(
        _id,
        {
          $set: {},
        },
        { new: true }
      );

      if (!updatedBilling) {
        throw new InvalidInputException("Failed to update billing");
      }
      return updatedBilling;
    } catch (error: any) {
      throw new Error("Error updating billing: " + error.message);
    }
  }

  public async updateStatus(_id: string, status: string) {
    const billing = await Billing.findById(_id);
    if (!billing) {
      throw new NotFoundException("Billing not found");
    }

    try {
      const updateStatus = await Billing.findByIdAndUpdate(
        _id,
        { $set: { status } },
        { new: true }
      );

      if (!updateStatus)
        throw new InvalidInputException("Failed to update status");
      return updateStatus;
    } catch (error: any) {
      throw new Error("Error updating billing status: " + error.message);
    }
  }

  public async delete(_id: string) {
    const billing = await Billing.findByIdAndDelete(_id);
    if (!billing) throw new InvalidInputException("Billing not found");
  }
}
