import { Vendor } from "../../models/vendor/vendor.model";
import { IVendor } from "../../models/vendor/vendor.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class VendorService {
  private static _instance: VendorService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IVendor) {
    // if (!data.day || !data.fromTime || !data.toTime) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    let existingVendor = await Vendor.findOne({
      // day: data.day,
    });
    if (existingVendor) {
      throw new InvalidInputException("Vendor already exists for this day");
    }

    let vendor = new Vendor({
      // day: data.day,
      // status: data.status ?? "OPEN",
    });

    try {
      return await vendor.save();
    } catch (error: any) {
      throw new Error("Error saving vendor: " + error.message);
    }
  }

  public async getVendorById(_id: string) {
    const vendor = await Vendor.findById({ _id });
    if (!vendor) throw new InvalidInputException("Vendor not found");
    return vendor;
  }

  public async getVendors() {
    const vendors = await Vendor.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (vendors.length === 0)
      throw new InvalidInputException("Vendors not found");
    return vendors;
  }

  public async update(_id: string, data: IVendor) {
    const vendor = await Vendor.findById(_id);
    if (!vendor) {
      throw new NotFoundException("Vendor not found");
    }

    // if (data.day) {
    //   let existingVendor = await Vendor.findOne({
    //     day: data.day,
    //     _id: { $ne: _id },
    //   });
    //   if (existingVendor) {
    //     throw new InvalidInputException(
    //       "Vendor already exists for this day"
    //     );
    //   }
    // }

    let updatedVendor = await Vendor.findByIdAndUpdate(
      _id,
      {
        $set: {
          // day: data.day ?? vendor.day,
          // fromTime: data.fromTime ?? vendor.fromTime,
          // toTime: data.toTime ?? vendor.toTime,
          // status: data.status ?? vendor.status,
        },
      },
      { new: true }
    );

    if (!updatedVendor) {
      throw new InvalidInputException("Failed to update vendor");
    }
    return updatedVendor;
  }

  public async updateStatus(_id: string, data: IVendor) {
    let vendor = await Vendor.findOne({ _id });

    if (!vendor) {
      throw new NotFoundException();
    }

    let updateStatus = await Vendor.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || vendor.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Vendor not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const vendor = await Vendor.findByIdAndDelete({ _id });
    if (!vendor) throw new InvalidInputException("Vendor not found");
  }
}
