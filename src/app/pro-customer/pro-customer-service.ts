import ProCustomer from "../../models/pro-customer/pro-customer.model";
import { IProCustomer } from "../../models/pro-customer/pro-customer.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class ProCustomerService {
  private static _instance: ProCustomerService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IProCustomer) {
    // if (!data.day || !data.fromTime || !data.toTime) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    let existingProCustomer = await ProCustomer.findOne({
      // day: data.day,
    });
    if (existingProCustomer) {
      throw new InvalidInputException(
        "Pro customer already exists for this day"
      );
    }

    let proCustomer = new ProCustomer({
      // day: data.day,
      // status: data.status ?? "OPEN",
    });

    try {
      return await proCustomer.save();
    } catch (error: any) {
      throw new Error("Error saving pro customer: " + error.message);
    }
  }

  public async getProCustomerById(_id: string) {
    const proCustomer = await ProCustomer.findById({ _id });
    if (!proCustomer) throw new InvalidInputException("Pro customer not found");
    return proCustomer;
  }

  public async getProCustomers() {
    const proCustomers = await ProCustomer.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (proCustomers.length === 0)
      throw new InvalidInputException("Pro customers not found");
    return proCustomers;
  }

  public async update(_id: string, data: IProCustomer) {
    const proCustomer = await ProCustomer.findById(_id);
    if (!proCustomer) {
      throw new NotFoundException("Pro Customer not found");
    }

    // if (data.day) {
    //   let existingProCustomer = await ProCustomer.findOne({
    //     day: data.day,
    //     _id: { $ne: _id },
    //   });
    //   if (existingProCustomer) {
    //     throw new InvalidInputException(
    //       "Pro customer already exists for this day"
    //     );
    //   }
    // }

    let updatedProCustomer = await ProCustomer.findByIdAndUpdate(
      _id,
      {
        $set: {
          // day: data.day ?? proCustomer.day,
          // fromTime: data.fromTime ?? proCustomer.fromTime,
          // toTime: data.toTime ?? proCustomer.toTime,
          // status: data.status ?? proCustomer.status,
        },
      },
      { new: true }
    );

    if (!updatedProCustomer) {
      throw new InvalidInputException("Failed to update pro customer");
    }
    return updatedProCustomer;
  }

  public async updateStatus(_id: string, data: IProCustomer) {
    let proCustomer = await ProCustomer.findOne({ _id });

    if (!proCustomer) {
      throw new NotFoundException();
    }

    let updateStatus = await ProCustomer.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || proCustomer.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus)
      throw new InvalidInputException("Pro customer not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const proCustomer = await ProCustomer.findByIdAndDelete({ _id });
    if (!proCustomer) throw new InvalidInputException("Pro customer not found");
  }
}
