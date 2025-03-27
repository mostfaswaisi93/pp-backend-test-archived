import { Permission } from "../../models/permission/permission.model";
import { IPermission } from "../../models/permission/permission.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class PermissionService {
  private static _instance: PermissionService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IPermission) {
    // if (!data.day || !data.fromTime || !data.toTime) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    let existingPermission = await Permission.findOne({
      // day: data.day,
    });
    if (existingPermission) {
      throw new InvalidInputException("Permission already exists for this day");
    }

    let permission = new Permission({
      // day: data.day,
      // status: data.status ?? "OPEN",
    });

    try {
      return await permission.save();
    } catch (error: any) {
      throw new Error("Error saving permission: " + error.message);
    }
  }

  public async getPermissionById(_id: string) {
    const permission = await Permission.findById({ _id });
    if (!permission) throw new InvalidInputException("Permission not found");
    return permission;
  }

  public async getPermissions() {
    const permissions = await Permission.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (permissions.length === 0)
      throw new InvalidInputException("Permissions not found");
    return permissions;
  }

  public async update(_id: string, data: IPermission) {
    const permission = await Permission.findById(_id);
    if (!permission) {
      throw new NotFoundException("Permission not found");
    }

    // if (data.day) {
    //   let existingPermission = await Permission.findOne({
    //     day: data.day,
    //     _id: { $ne: _id },
    //   });
    //   if (existingPermission) {
    //     throw new InvalidInputException(
    //       "Permission already exists for this day"
    //     );
    //   }
    // }

    let updatedPermission = await Permission.findByIdAndUpdate(
      _id,
      {
        $set: {
          // day: data.day ?? permission.day,
          // fromTime: data.fromTime ?? permission.fromTime,
          // toTime: data.toTime ?? permission.toTime,
          // status: data.status ?? permission.status,
        },
      },
      { new: true }
    );

    if (!updatedPermission) {
      throw new InvalidInputException("Failed to update permission");
    }
    return updatedPermission;
  }

  public async updateStatus(_id: string, data: IPermission) {
    let permission = await Permission.findOne({ _id });

    if (!permission) {
      throw new NotFoundException();
    }

    let updateStatus = await Permission.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || permission.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Permission not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const permission = await Permission.findByIdAndDelete({ _id });
    if (!permission) throw new InvalidInputException("Permission not found");
  }
}
