import { Staff } from "../../models/staff/staff.model";
import { IStaff } from "../../models/staff/staff.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class StaffService {
  private static _instance: StaffService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IStaff) {
    // if (!data.day || !data.fromTime || !data.toTime) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    let existingStaff = await Staff.findOne({
      // day: data.day,
    });
    if (existingStaff) {
      throw new InvalidInputException("Staff already exists for this day");
    }

    let staff = new Staff({
      // day: data.day,
      // status: data.status ?? "OPEN",
    });

    try {
      return await staff.save();
    } catch (error: any) {
      throw new Error("Error saving staff: " + error.message);
    }
  }

  public async getStaffById(_id: string) {
    const staff = await Staff.findById({ _id });
    if (!staff) throw new InvalidInputException("Staff not found");
    return staff;
  }

  public async getStaffs() {
    const staffs = await Staff.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (staffs.length === 0)
      throw new InvalidInputException("Staffs not found");
    return staffs;
  }

  public async update(_id: string, data: IStaff) {
    const staff = await Staff.findById(_id);
    if (!staff) {
      throw new NotFoundException("Staff not found");
    }

    // if (data.day) {
    //   let existingStaff = await Staff.findOne({
    //     day: data.day,
    //     _id: { $ne: _id },
    //   });
    //   if (existingStaff) {
    //     throw new InvalidInputException(
    //       "Staff already exists for this day"
    //     );
    //   }
    // }

    let updatedStaff = await Staff.findByIdAndUpdate(
      _id,
      {
        $set: {
          // day: data.day ?? staff.day,
          // fromTime: data.fromTime ?? staff.fromTime,
          // toTime: data.toTime ?? staff.toTime,
          // status: data.status ?? staff.status,
        },
      },
      { new: true }
    );

    if (!updatedStaff) {
      throw new InvalidInputException("Failed to update staff");
    }
    return updatedStaff;
  }

  public async updateStatus(_id: string, data: IStaff) {
    let staff = await Staff.findOne({ _id });

    if (!staff) {
      throw new NotFoundException();
    }

    let updateStatus = await Staff.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || staff.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Staff not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const staff = await Staff.findByIdAndDelete({ _id });
    if (!staff) throw new InvalidInputException("Staff not found");
  }
}
