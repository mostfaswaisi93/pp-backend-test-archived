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
    const purchaseOrder = new PurchaseOrder({
      workOrderNumber: data.workOrderNumber,
      workOrderId: data.workOrderId,
      workOrderStatus: data.workOrderStatus,
      customerName: data.customerName,
      customerId: data.customerId,
      phoneNumber: data.phoneNumber,
      jobTitle: data.jobTitle,
      location: data.location,
      staffId: data.staffId,
      status: data.status,
      staffNotes: data.staffNotes,
      managerNotes: data.managerNotes,
      purchaseOrderDetails: data.purchaseOrderDetails,
      totalCost: data.totalCost,
      proId: data.proId,
      userId: data.userId,
      proEmailId: data.proEmailId,
      purchaseOrderId: data.purchaseOrderId,
      description: data.description,
      files: data.files,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    });

    try {
      return await purchaseOrder.save();
    } catch (error: any) {
      throw new Error("Error saving purchase order: " + error.message);
    }
  }

  public async getPurchaseOrderById(_id: string) {
    const purchaseOrder = await PurchaseOrder.findById(_id);
    if (!purchaseOrder)
      throw new InvalidInputException("Purchase order not found");
    return purchaseOrder;
  }

  public async getPurchaseOrders() {
    const purchaseOrders = await PurchaseOrder.find({
      status: "ACTIVE",
    }).sort({ state: 1 });

    if (purchaseOrders.length === 0)
      throw new InvalidInputException("Purchase orders not found");
    return purchaseOrders;
  }

  public async update(_id: string, data: IPurchaseOrder) {
    const purchaseOrder = await PurchaseOrder.findById(_id);
    if (!purchaseOrder) {
      throw new NotFoundException("Purchase order not found");
    }

    const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
      _id,
      {
        $set: {
          workOrderNumber: data.workOrderNumber,
          workOrderId: data.workOrderId,
          workOrderStatus: data.workOrderStatus,
          customerName: data.customerName,
          customerId: data.customerId,
          phoneNumber: data.phoneNumber,
          jobTitle: data.jobTitle,
          location: data.location,
          staffId: data.staffId,
          status: data.status,
          staffNotes: data.staffNotes,
          managerNotes: data.managerNotes,
          purchaseOrderDetails: data.purchaseOrderDetails,
          totalCost: data.totalCost,
          proId: data.proId,
          userId: data.userId,
          proEmailId: data.proEmailId,
          purchaseOrderId: data.purchaseOrderId,
          description: data.description,
          files: data.files,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy,
        },
      },
      { new: true }
    );

    if (!updatedPurchaseOrder) {
      throw new InvalidInputException("Failed to update purchase order");
    }

    return updatedPurchaseOrder;
  }

  public async updateStatus(_id: string, data: { status: string }) {
    const purchaseOrder = await PurchaseOrder.findById(_id);
    if (!purchaseOrder) {
      throw new NotFoundException("Purchase order not found");
    }

    purchaseOrder.status = data.status;

    try {
      return await purchaseOrder.save();
    } catch (error: any) {
      throw new Error("Error updating status: " + error.message);
    }
  }

  public async delete(_id: string) {
    const purchaseOrder = await PurchaseOrder.findByIdAndDelete(_id);
    if (!purchaseOrder)
      throw new InvalidInputException("Purchase order not found");
  }
}
