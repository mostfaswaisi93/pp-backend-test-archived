import TruckOrder from "../../models/truck-order/truck-order.model";
import { ITruckOrder } from "../../models/truck-order/truck-order.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class TruckOrderService {
  private static _instance: TruckOrderService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: ITruckOrder) {
    // if (!data.day || !data.fromTime || !data.toTime) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    let existingTruckOrder = await TruckOrder.findOne({
      // day: data.day,
    });
    if (existingTruckOrder) {
      throw new InvalidInputException("TruckOrder already exists for this day");
    }

    let truckOrder = new TruckOrder({
      // day: data.day,
      // status: data.status ?? "OPEN",
    });

    try {
      return await truckOrder.save();
    } catch (error: any) {
      throw new Error("Error saving truck order: " + error.message);
    }
  }

  public async getTruckOrderById(_id: string) {
    const truckOrder = await TruckOrder.findById({ _id });
    if (!truckOrder) throw new InvalidInputException("Truck order not found");
    return truckOrder;
  }

  public async getTruckOrders() {
    const truckOrders = await TruckOrder.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (truckOrders.length === 0)
      throw new InvalidInputException("Truck orders not found");
    return truckOrders;
  }

  public async update(_id: string, data: ITruckOrder) {
    const truckOrder = await TruckOrder.findById(_id);
    if (!truckOrder) {
      throw new NotFoundException("Truck order not found");
    }

    // if (data.day) {
    //   let existingTruckOrder = await TruckOrder.findOne({
    //     day: data.day,
    //     _id: { $ne: _id },
    //   });
    //   if (existingTruckOrder) {
    //     throw new InvalidInputException(
    //       "Truck order already exists for this day"
    //     );
    //   }
    // }

    let updatedTruckOrder = await TruckOrder.findByIdAndUpdate(
      _id,
      {
        $set: {
          // day: data.day ?? truckOrder.day,
          // fromTime: data.fromTime ?? truckOrder.fromTime,
          // toTime: data.toTime ?? truckOrder.toTime,
          // status: data.status ?? truckOrder.status,
        },
      },
      { new: true }
    );

    if (!updatedTruckOrder) {
      throw new InvalidInputException("Failed to update truck order");
    }
    return updatedTruckOrder;
  }

  public async updateStatus(_id: string, data: ITruckOrder) {
    let truckOrder = await TruckOrder.findOne({ _id });

    if (!truckOrder) {
      throw new NotFoundException();
    }

    let updateStatus = await TruckOrder.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || truckOrder.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Truck order not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const truckOrder = await TruckOrder.findByIdAndDelete({ _id });
    if (!truckOrder) throw new InvalidInputException("Truck order not found");
  }
}
