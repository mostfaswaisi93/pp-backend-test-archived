import { Equipment } from "../../models/equipment/equipment.model";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";
import { IEquipment } from "../../models/equipment/equipment.interface";

export class EquipmentService {
  private static _instance: EquipmentService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IEquipment) {
    // if (data.name) {
    //   let nameExist = await Equipment.findOne({ name: data.name });
    //   if (nameExist) {
    //     throw new InvalidInputException("Equipment name already exists");
    //   }
    // }

    let equipment = new Equipment({});

    try {
      let result = await equipment.save();
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async getEquipmentById(_id: string) {
    const equipment = await Equipment.findById({ _id });
    if (!equipment) throw new InvalidInputException("Equipment not found");
    return equipment;
  }

  public async getLastEquipmentId() {
    const lastEquipment = await Equipment.findOne().sort({ _id: -1 });
    if (!lastEquipment)
      throw new InvalidInputException("There are no equipments.");
    return lastEquipment;
  }

  public async getEquipments() {
    const equipments = await Equipment.find({ status: "ACTIVE" }).sort({
      name: 1,
    });
    if (equipments.length === 0)
      throw new InvalidInputException("Equipments not found");
    return equipments;
  }

  public async getEquipmentsWithSSP() {
    const equipments = await Equipment.find({ status: "ACTIVE" }).sort({
      name: 1,
    });
    if (equipments.length === 0)
      throw new InvalidInputException("Equipments not found");
    return equipments;
  }

  public async getEquipmentName(body: any) {
    if (!Array.isArray(body)) {
      return {
        error: true,
        message: "Invalid request body. An array is expected.",
      };
    }

    const tradeLicenseArray: string[] = body.map(
      (item: { tradeLicense: string }) => item.tradeLicense
    );

    const equipments = await Equipment.find({
      status: "ACTIVE",
      code: { $in: tradeLicenseArray },
    });

    if (equipments.length === 0)
      throw new InvalidInputException("Equipments not found");
    return { error: false, equipments: equipments ?? [] };
  }

  public async update(_id: string, data: IEquipment) {
    const equipment = await Equipment.findOne({ _id });
    if (!equipment) {
      throw new NotFoundException();
    }

    let updatedEquipment = await Equipment.findByIdAndUpdate(
      _id,
      {
        $set: {
          // name: data.name || equipment.name,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedEquipment)
      throw new InvalidInputException("Equipment not found");
    return updatedEquipment;
  }

  public async updateStatus(_id: string, data: IEquipment) {
    let equipment = await Equipment.findOne({ _id });

    if (!equipment) {
      throw new NotFoundException();
    }

    let updateStatus = await Equipment.findByIdAndUpdate(
      _id,
      {
        $set: {
          status: data.status || equipment.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Equipment not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const equipment = await Equipment.findByIdAndDelete({ _id });
    if (!equipment) throw new InvalidInputException("Equipment not found");
  }
}
