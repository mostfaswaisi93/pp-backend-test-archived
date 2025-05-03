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
    if (
      !data.email ||
      !data.firstName ||
      !data.lastName ||
      !data.streetAddress ||
      !data.zipcode ||
      !data.city ||
      !data.state ||
      !data.county
    ) {
      throw new InvalidInputException("Missing required fields");
    }

    let existingWorkorder = await Workorder.findOne({
      email: data.email,
    });

    if (existingWorkorder) {
      throw new InvalidInputException(
        "Workorder already exists for this email"
      );
    }

    let workorder = new Workorder({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      phoneCategory: data.phoneCategory,
      streetAddress: data.streetAddress,
      zipcode: data.zipcode,
      city: data.city,
      state: data.state,
      county: data.county,
      status: data.status ?? "OPEN",
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
    });

    try {
      return await workorder.save();
    } catch (error: any) {
      throw new Error("Error saving workorder: " + error.message);
    }
  }

  public async getWorkorderById(_id: string) {
    const workorder = await Workorder.findById({ _id });
    if (!workorder) throw new NotFoundException("Workorder not found");
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

    let updatedWorkorder = await Workorder.findByIdAndUpdate(
      _id,
      {
        $set: {
          email: data.email ?? workorder.email,
          firstName: data.firstName ?? workorder.firstName,
          lastName: data.lastName ?? workorder.lastName,
          phone: data.phone ?? workorder.phone,
          phoneCategory: data.phoneCategory ?? workorder.phoneCategory,
          streetAddress: data.streetAddress ?? workorder.streetAddress,
          zipcode: data.zipcode ?? workorder.zipcode,
          city: data.city ?? workorder.city,
          state: data.state ?? workorder.state,
          county: data.county ?? workorder.county,
          status: data.status ?? workorder.status,
          modifiedDate: new Date().toISOString(),
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
      throw new NotFoundException("Workorder not found");
    }

    let updateStatus = await Workorder.findByIdAndUpdate(
      _id,
      {
        $set: {
          status: data.status ?? workorder.status,
          modifiedDate: new Date().toISOString(),
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
