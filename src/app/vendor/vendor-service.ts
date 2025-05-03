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
    if (
      !data.vendorName ||
      !data.vendorId ||
      data.eligible1099 === undefined ||
      !data.status
    ) {
      throw new InvalidInputException(
        "Missing required fields: vendorName, vendorId, eligible1099, or status"
      );
    }

    const existingVendor = await Vendor.findOne({
      $or: [{ vendorName: data.vendorName }, { vendorId: data.vendorId }],
    });

    if (existingVendor) {
      throw new InvalidInputException(
        "Vendor with this name or ID already exists"
      );
    }

    const vendor = new Vendor({
      proId: data.proId,
      userId: data.userId,
      vendorId: data.vendorId,
      vendorName: data.vendorName,
      taxIdOrEIN: data.taxIdOrEIN,
      representativeName: data.representativeName,
      eligible1099: data.eligible1099,
      vendorCategory: data.vendorCategory,
      representativeEmail: data.representativeEmail,
      accountNumber: data.accountNumber,
      phoneNumber: data.phoneNumber,
      extension: data.extension,
      streetAddress: data.streetAddress,
      unit: data.unit,
      state: data.state,
      city: data.city,
      zipcode: data.zipcode,
      specialNotes: data.specialNotes,
      searchByValues: data.searchByValues,
      searchQuery: data.searchQuery,
      createdOn: new Date(),
      createdBy: data.createdBy,
      updatedByImage: data.updatedByImage,
      updatedByName: data.updatedByName,
      updatedByEmail: data.updatedByEmail,
      status: data.status,
    });

    try {
      return await vendor.save();
    } catch (error: any) {
      throw new Error("Error saving vendor: " + error.message);
    }
  }

  public async getVendorById(_id: string) {
    const vendor = await Vendor.findById(_id).lean();
    if (!vendor) throw new NotFoundException("Vendor not found");
    return vendor;
  }

  public async getVendors() {
    const vendors = await Vendor.find({ status: "ACTIVE" })
      .sort({ state: 1 })
      .lean();

    if (vendors.length === 0) {
      throw new NotFoundException("No active vendors found");
    }

    return vendors;
  }

  public async update(_id: string, data: Partial<IVendor>) {
    const vendor = await Vendor.findById(_id);
    if (!vendor) {
      throw new NotFoundException("Vendor not found");
    }

    Object.assign(vendor, {
      proId: data.proId ?? vendor.proId,
      userId: data.userId ?? vendor.userId,
      vendorId: data.vendorId ?? vendor.vendorId,
      vendorName: data.vendorName ?? vendor.vendorName,
      taxIdOrEIN: data.taxIdOrEIN ?? vendor.taxIdOrEIN,
      representativeName: data.representativeName ?? vendor.representativeName,
      eligible1099: data.eligible1099 ?? vendor.eligible1099,
      vendorCategory: data.vendorCategory ?? vendor.vendorCategory,
      representativeEmail:
        data.representativeEmail ?? vendor.representativeEmail,
      accountNumber: data.accountNumber ?? vendor.accountNumber,
      phoneNumber: data.phoneNumber ?? vendor.phoneNumber,
      extension: data.extension ?? vendor.extension,
      streetAddress: data.streetAddress ?? vendor.streetAddress,
      unit: data.unit ?? vendor.unit,
      state: data.state ?? vendor.state,
      city: data.city ?? vendor.city,
      zipcode: data.zipcode ?? vendor.zipcode,
      specialNotes: data.specialNotes ?? vendor.specialNotes,
      searchByValues: data.searchByValues ?? vendor.searchByValues,
      searchQuery: data.searchQuery ?? vendor.searchQuery,
      updatedByImage: data.updatedByImage ?? vendor.updatedByImage,
      updatedByName: data.updatedByName ?? vendor.updatedByName,
      updatedByEmail: data.updatedByEmail ?? vendor.updatedByEmail,
      status: data.status ?? vendor.status,
    });

    try {
      return await vendor.save();
    } catch (error: any) {
      throw new Error("Error updating vendor: " + error.message);
    }
  }

  public async updateStatus(_id: string, status: "ACTIVE" | "INACTIVE") {
    const vendor = await Vendor.findById(_id);
    if (!vendor) {
      throw new NotFoundException("Vendor not found");
    }

    vendor.status = status;

    try {
      return await vendor.save();
    } catch (error: any) {
      throw new Error("Error updating vendor status: " + error.message);
    }
  }

  public async delete(_id: string) {
    const vendor = await Vendor.findByIdAndDelete(_id);
    if (!vendor) throw new NotFoundException("Vendor not found");
  }
}
