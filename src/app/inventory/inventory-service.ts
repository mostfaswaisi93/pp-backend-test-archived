import { Inventory } from "../../models/inventory/inventory.model";
import { IInventory } from "../../models/inventory/inventory.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class InventoryService {
  private static _instance: InventoryService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IInventory) {
    // if (data.name) {
    //   let nameExist = await Inventory.findOne({ name: data.name });
    //   if (nameExist) {
    //     throw new InvalidInputException("Inventory name already exists");
    //   }
    // }

    let inventory = new Inventory({
      // code: generatedCode,
      // name: data.name,
      // description: data.description,
    });

    try {
      let result = await inventory.save();
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async getInventoryById(_id: string) {
    const inventory = await Inventory.findById({ _id });
    if (!inventory) throw new InvalidInputException("Inventory not found");
    return inventory;
  }

  public async getLastInventoryId() {
    const lastInventory = await Inventory.findOne().sort({ _id: -1 });
    if (!lastInventory)
      throw new InvalidInputException("There are no inventories.");
    return lastInventory;
  }

  public async getInventories() {
    const inventories = await Inventory.find({ status: "ACTIVE" }).sort({
      name: 1,
    });
    if (inventories.length === 0)
      throw new InvalidInputException("Inventories not found");
    return inventories;
  }

  public async getInventoriesWithSSP() {
    const inventories = await Inventory.find({ status: "ACTIVE" }).sort({
      name: 1,
    });
    if (inventories.length === 0)
      throw new InvalidInputException("Inventories not found");
    return inventories;
  }

  public async getInventoryName(body: any) {
    if (!Array.isArray(body)) {
      return {
        error: true,
        message: "Invalid request body. An array is expected.",
      };
    }

    const tradeLicenseArray: string[] = body.map(
      (item: { tradeLicense: string }) => item.tradeLicense
    );

    const inventories = await Inventory.find({
      status: "ACTIVE",
      code: { $in: tradeLicenseArray },
    });

    if (inventories.length === 0)
      throw new InvalidInputException("Inventories not found");
    return { error: false, inventories: inventories ?? [] };
  }

  public async update(_id: string, data: IInventory) {
    const inventory = await Inventory.findOne({ _id });
    if (!inventory) {
      throw new NotFoundException();
    }

    let updatedInventory = await Inventory.findByIdAndUpdate(
      _id,
      {
        $set: {
          // name: data.name || inventory.name,
          // description: data.description || inventory.description,
          // icon: data.icon || inventory.icon,
          // image: data.image || inventory.image,
          // price: data.price || inventory.price,
          // status: data.status || inventory.status,
          // isAdminOnly: data.isAdminOnly || inventory.isAdminOnly,
          // isPopularInventory:
          //   data.isPopularInventory || inventory.isPopularInventory,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedInventory)
      throw new InvalidInputException("Inventory not found");
    return updatedInventory;
  }

  public async updateStatus(_id: string, data: IInventory) {
    let inventory = await Inventory.findOne({ _id });

    if (!inventory) {
      throw new NotFoundException();
    }

    let updateStatus = await Inventory.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || inventory.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Inventory not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const inventory = await Inventory.findByIdAndDelete({ _id });
    if (!inventory) throw new InvalidInputException("Inventory not found");
  }

  public async getStaffInventory() {
    const inventories = await Inventory.find({
      status: "ACTIVE",
      isAdminOnly: false,
    });

    if (!inventories || inventories.length === 0) {
      throw new InvalidInputException("Staff inventories not found.");
    }

    return inventories;
  }

  public async getInventoryListByProId(proId: string) {
    if (!proId) {
      throw new InvalidInputException("Pro ID is required");
    }

    const inventories = await Inventory.find({
      status: "ACTIVE",
      proId: proId,
    });

    if (!inventories || inventories.length === 0) {
      throw new NotFoundException(
        "No inventories found for the specified Pro ID."
      );
    }

    return inventories;
  }

  public async getInvDataByCategoryCode(categoryCode: string) {
    if (!categoryCode) {
      throw new InvalidInputException("Category code is required.");
    }

    const inventories = await Inventory.find({
      status: "ACTIVE",
      categoryCode,
    });

    if (!inventories || inventories.length === 0) {
      throw new NotFoundException(
        "No inventory data found for this category code."
      );
    }

    return inventories;
  }

  public async getInvLocations(): Promise<any[]> {
    const locations = await Inventory.find(
      { status: "ACTIVE" },
      { _id: 0, code: 1, location: 1 }
    );

    if (!locations || locations.length === 0) {
      throw new NotFoundException("No inventory locations found.");
    }

    return locations;
  }

  public async getItemDataCatSubCatLocations(): Promise<any[]> {
    const inventories = await Inventory.find(
      { status: "ACTIVE" },
      {
        _id: 0,
        categoryCode: 1,
        subCategoryCode: 1,
        itemCode: 1,
        location: 1,
      }
    );

    if (!inventories || inventories.length === 0) {
      throw new NotFoundException("No inventory data found.");
    }

    return inventories;
  }

  public async getAccInvSubSubcat(): Promise<any[]> {
    const result = await Inventory.aggregate([
      {
        $match: {
          acc: { $ne: null },
          inv: { $ne: null },
          subsubcat: { $ne: null },
        },
      },
      {
        $group: {
          _id: {
            acc: "$acc",
            inv: "$inv",
            subsubcat: "$subsubcat",
          },
        },
      },
      {
        $project: {
          _id: 0,
          acc: "$_id.acc",
          inv: "$_id.inv",
          subsubcat: "$_id.subsubcat",
        },
      },
    ]);
    return result;
  }

  public async getInventoryProSelectedCategory(
    proId: string,
    categoryCode: string
  ) {
    if (!proId || !categoryCode) {
      throw new InvalidInputException("Pro ID and Category Code are required.");
    }

    const inventories = await Inventory.find({
      status: "ACTIVE",
      proId,
      categoryCode,
    });

    if (!inventories || inventories.length === 0) {
      throw new NotFoundException(
        "No inventories found for the given Pro ID and Category Code."
      );
    }

    return inventories;
  }

  async getCategoriesFromAcc(accId: string): Promise<any[]> {
    const result = await Inventory.aggregate([
      // { $match: { acc_id: new mongoose.Types.ObjectId(accId) } },
      {
        $group: {
          _id: {
            category_id: "$category_id",
            category_name_en: "$category_name_en",
            category_name_ar: "$category_name_ar",
          },
        },
      },
      {
        $project: {
          _id: 0,
          category_id: "$_id.category_id",
          category_name_en: "$_id.category_name_en",
          category_name_ar: "$_id.category_name_ar",
        },
      },
    ]);
    return result;
  }
}
