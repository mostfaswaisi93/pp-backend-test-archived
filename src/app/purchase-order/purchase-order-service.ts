import { PurchaseOrder } from "../../models/purchase-order/purchase-order.model";
import { IPurchaseOrder } from "../../models/purchase-order/purchase-order.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class PurchaseOrderService {
  private static _instance: PurchaseOrderService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IPurchaseOrder) {
    // if (!data.day || !data.fromTime || !data.toTime) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    let existingPurchaseOrder = await PurchaseOrder.findOne({
      // day: data.day,
    });
    if (existingPurchaseOrder) {
      throw new InvalidInputException(
        "PurchaseOrder already exists for this day"
      );
    }

    let purchaseOrder = new PurchaseOrder({
      // day: data.day,
      // status: data.status ?? "OPEN",
    });

    try {
      return await purchaseOrder.save();
    } catch (error: any) {
      throw new Error("Error saving purchase order: " + error.message);
    }
  }

  public async getPurchaseOrderById(_id: string) {
    const purchaseOrder = await PurchaseOrder.findById({ _id });
    if (!purchaseOrder)
      throw new InvalidInputException("Purchase order not found");
    return purchaseOrder;
  }

  public async getPurchaseOrders() {
    const purchaseOrders = await PurchaseOrder.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (purchaseOrders.length === 0)
      throw new InvalidInputException("Purchase orders not found");
    return purchaseOrders;
  }

  public async update(_id: string, data: IPurchaseOrder) {
    const purchaseOrder = await PurchaseOrder.findById(_id);
    if (!purchaseOrder) {
      throw new NotFoundException("Purchase order not found");
    }

    // if (data.day) {
    //   let existingPurchaseOrder = await PurchaseOrder.findOne({
    //     day: data.day,
    //     _id: { $ne: _id },
    //   });
    //   if (existingPurchaseOrder) {
    //     throw new InvalidInputException(
    //       "Purchase order already exists for this day"
    //     );
    //   }
    // }

    let updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
      _id,
      {
        $set: {
          // day: data.day ?? purchaseOrder.day,
          // fromTime: data.fromTime ?? purchaseOrder.fromTime,
          // toTime: data.toTime ?? purchaseOrder.toTime,
          // status: data.status ?? purchaseOrder.status,
        },
      },
      { new: true }
    );

    if (!updatedPurchaseOrder) {
      throw new InvalidInputException("Failed to update Purchase order");
    }
    return updatedPurchaseOrder;
  }

  public async updateStatus(_id: string, data: IPurchaseOrder) {
    let purchaseOrder = await PurchaseOrder.findOne({ _id });

    if (!purchaseOrder) {
      throw new NotFoundException();
    }

    let updateStatus = await PurchaseOrder.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || purchaseOrder.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus)
      throw new InvalidInputException("Purchase order not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const purchaseOrder = await PurchaseOrder.findByIdAndDelete({ _id });
    if (!purchaseOrder)
      throw new InvalidInputException("Purchase order not found");
  }
}
