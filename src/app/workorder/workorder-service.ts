import { Workorder } from "../../models/workorder/workorder.model";
import { IWorkorder } from "../../models/workorder/workorder.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class WorkorderService {
  private static _instance: WorkorderService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IWorkorder) {
    // if (!data.day || !data.fromTime || !data.toTime) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    let existingWorkorder = await Workorder.findOne({
      // day: data.day,
    });
    if (existingWorkorder) {
      throw new InvalidInputException("Workorder already exists for this day");
    }

    let workorder = new Workorder({
      // day: data.day,
      // status: data.status ?? "OPEN",
    });

    try {
      return await workorder.save();
    } catch (error: any) {
      throw new Error("Error saving workorder: " + error.message);
    }
  }

  public async getWorkorderById(_id: string) {
    const workorder = await Workorder.findById({ _id });
    if (!workorder) throw new InvalidInputException("Workorder not found");
    return workorder;
  }

  public async getWorkorders() {
    const workorders = await Workorder.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (workorders.length === 0)
      throw new InvalidInputException("Workorders not found");
    return workorders;
  }

  public async update(_id: string, data: IWorkorder) {
    const workorder = await Workorder.findById(_id);
    if (!workorder) {
      throw new NotFoundException("Workorder not found");
    }

    // if (data.day) {
    //   let existingWorkorder = await Workorder.findOne({
    //     day: data.day,
    //     _id: { $ne: _id },
    //   });
    //   if (existingWorkorder) {
    //     throw new InvalidInputException(
    //       "Workorder already exists for this day"
    //     );
    //   }
    // }

    let updatedWorkorder = await Workorder.findByIdAndUpdate(
      _id,
      {
        $set: {
          // day: data.day ?? workorder.day,
          // fromTime: data.fromTime ?? workorder.fromTime,
          // toTime: data.toTime ?? workorder.toTime,
          // status: data.status ?? workorder.status,
        },
      },
      { new: true }
    );

    if (!updatedWorkorder) {
      throw new InvalidInputException("Failed to update workorder");
    }
    return updatedWorkorder;
  }

  public async updateStatus(_id: string, data: IWorkorder) {
    let workorder = await Workorder.findOne({ _id });

    if (!workorder) {
      throw new NotFoundException();
    }

    let updateStatus = await Workorder.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || workorder.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Workorder not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const workorder = await Workorder.findByIdAndDelete({ _id });
    if (!workorder) throw new InvalidInputException("Workorder not found");
  }
}
