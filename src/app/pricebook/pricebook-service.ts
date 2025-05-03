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
    if (
      !data.serviceId ||
      !data.category ||
      !data.subCategory ||
      !data.serviceTitle
    ) {
      throw new InvalidInputException("Missing required fields");
    }

    let existingPricebook = await Pricebook.findOne({
      serviceId: data.serviceId,
      category: data.category,
      subCategory: data.subCategory,
    });
    if (existingPricebook) {
      throw new InvalidInputException(
        "Pricebook already exists for this service"
      );
    }

    let pricebook = new Pricebook({
      userId: data.userId,
      proId: data.proId,
      serviceId: data.serviceId,
      category: data.category,
      subCategory: data.subCategory,
      serviceTitle: data.serviceTitle,
      isLeadCostApplied: data.isLeadCostApplied,
      leadCost: data.leadCost,
      isTruckOrderCostApplied: data.isTruckOrderCostApplied,
      truckOrderCost: data.truckOrderCost,
      inventoryItems: data.inventoryItems,
      laborRate: data.laborRate,
      numberHours: data.numberHours,
      subTotal: data.subTotal,
      laborCost: data.laborCost,
      totalCost: data.totalCost,
      standard: data.standard,
      value: data.value,
      member: data.member,
      standardPercent: data.standardPercent,
      valuePercent: data.valuePercent,
      memberPercent: data.memberPercent,
      totalMaterialCost: data.totalMaterialCost,
      imageUrls: data.imageUrls,
      documentFilename: data.documentFilename,
      documentName: data.documentName,
      serviceDescription: data.serviceDescription,
      installationDescription: data.installationDescription,
      serviceStatus: data.serviceStatus,
      qrImageUrl: data.qrImageUrl,
      createdAt: data.createdAt,
      createdBy: data.createdBy,
      updatedAt: data.updatedAt,
      updatedBy: data.updatedBy,
      createdByEmail: data.createdByEmail,
      updatedByEmail: data.updatedByEmail,
      updatedByImage: data.updatedByImage,
    });

    try {
      return await pricebook.save();
    } catch (error: any) {
      throw new Error("Error saving pricebook: " + error.message);
    }
  }

  public async getPricebookById(_id: string) {
    if (!/_id/.test(_id)) throw new InvalidInputException("Invalid ID format");
    const pricebook = await Pricebook.findById(_id);
    if (!pricebook) throw new InvalidInputException("Pricebook not found");
    return pricebook;
  }

  public async getPricebooks() {
    const pricebooks = await Pricebook.find({ status: "ACTIVE" }).sort({
      state: 1,
    });
    if (pricebooks.length === 0)
      throw new InvalidInputException("Pricebooks not found");
    return pricebooks;
  }

  public async update(_id: string, data: IPricebook) {
    const pricebook = await Pricebook.findById(_id);
    if (!pricebook) {
      throw new NotFoundException("Pricebook not found");
    }

    let updatedPricebook = await Pricebook.findByIdAndUpdate(
      _id,
      {
        $set: {
          userId: data.userId,
          proId: data.proId,
          serviceId: data.serviceId,
          category: data.category,
          subCategory: data.subCategory,
          serviceTitle: data.serviceTitle,
          isLeadCostApplied: data.isLeadCostApplied,
          leadCost: data.leadCost,
          isTruckOrderCostApplied: data.isTruckOrderCostApplied,
          truckOrderCost: data.truckOrderCost,
          inventoryItems: data.inventoryItems,
          laborRate: data.laborRate,
          numberHours: data.numberHours,
          subTotal: data.subTotal,
          laborCost: data.laborCost,
          totalCost: data.totalCost,
          standard: data.standard,
          value: data.value,
          member: data.member,
          standardPercent: data.standardPercent,
          valuePercent: data.valuePercent,
          memberPercent: data.memberPercent,
          totalMaterialCost: data.totalMaterialCost,
          imageUrls: data.imageUrls,
          documentFilename: data.documentFilename,
          documentName: data.documentName,
          serviceDescription: data.serviceDescription,
          installationDescription: data.installationDescription,
          serviceStatus: data.serviceStatus,
          qrImageUrl: data.qrImageUrl,
          updatedAt: data.updatedAt,
          updatedBy: data.updatedBy,
          updatedByEmail: data.updatedByEmail,
          updatedByImage: data.updatedByImage,
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
    const pricebook = await Pricebook.findById(_id);
    if (!pricebook) {
      throw new NotFoundException("Pricebook not found");
    }

    if (
      !data.serviceStatus ||
      !["ACTIVE", "INACTIVE"].includes(data.serviceStatus)
    ) {
      throw new InvalidInputException("Invalid service status");
    }

    let updatedPricebook = await Pricebook.findByIdAndUpdate(
      _id,
      { $set: { serviceStatus: data.serviceStatus } },
      { new: true }
    );

    if (!updatedPricebook) {
      throw new InvalidInputException("Failed to update pricebook status");
    }

    return updatedPricebook;
  }

  public async delete(_id: string) {
    const pricebook = await Pricebook.findByIdAndDelete(_id);
    if (!pricebook) throw new InvalidInputException("Pricebook not found");
  }
}
