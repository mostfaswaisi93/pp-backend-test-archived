import { AccountSetting } from "../../models/account-setting/account-setting.model";
import { IAccountSetting } from "../../models/account-setting/account-setting.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";
import { Vendor } from "../../models/vendor/vendor.model";
import { Promo } from "../../models/promo/promo.model";

export class AccountSettingService {
  private static _instance: AccountSettingService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IAccountSetting) {
    // if (!data.day || !data.fromTime || !data.toTime) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    let existingAccountSetting = await AccountSetting.findOne({
      // day: data.day,
    });
    if (existingAccountSetting) {
      throw new InvalidInputException(
        "Account setting already exists for this day"
      );
    }

    let accountSetting = new AccountSetting({
      // day: data.day,
      status: data.status ?? "OPEN",
    });

    try {
      return await accountSetting.save();
    } catch (error: any) {
      throw new Error("Error saving account setting: " + error.message);
    }
  }

  public async getAccountSettingById(_id: string) {
    const accountSetting = await AccountSetting.findById({ _id });
    if (!accountSetting)
      throw new InvalidInputException("Account setting not found");
    return accountSetting;
  }

  public async getAccountSettings() {
    const accountSettings = await AccountSetting.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (accountSettings.length === 0)
      throw new InvalidInputException("Account settings not found");
    return accountSettings;
  }

  public async update(_id: string, data: IAccountSetting) {
    const accountSetting = await AccountSetting.findById(_id);
    if (!accountSetting) {
      throw new NotFoundException("Account setting not found");
    }

    // if (data.day) {
    //   let existingAccountSetting = await AccountSetting.findOne({
    //     day: data.day,
    //     _id: { $ne: _id },
    //   });
    //   if (existingAccountSetting) {
    //     throw new InvalidInputException(
    //       "Account setting already exists for this day"
    //     );
    //   }
    // }

    let updatedAccountSetting = await AccountSetting.findByIdAndUpdate(
      _id,
      {
        $set: {
          // day: data.day ?? accountSetting.day,
          // fromTime: data.fromTime ?? accountSetting.fromTime,
          // toTime: data.toTime ?? accountSetting.toTime,
          status: data.status ?? accountSetting.status,
        },
      },
      { new: true }
    );

    if (!updatedAccountSetting) {
      throw new InvalidInputException("Failed to update account setting");
    }
    return updatedAccountSetting;
  }

  public async updateStatus(_id: string, data: IAccountSetting) {
    let accountSetting = await AccountSetting.findOne({ _id });

    if (!accountSetting) {
      throw new NotFoundException();
    }

    let updateStatus = await AccountSetting.findByIdAndUpdate(
      _id,
      {
        $set: {
          status: data.status || accountSetting.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus)
      throw new InvalidInputException("Account setting not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const accountSetting = await AccountSetting.findByIdAndDelete({ _id });
    if (!accountSetting)
      throw new InvalidInputException("Account setting not found");
  }

  public async insertAccountsetting(data: IAccountSetting) {
    try {
      const newSetting = new AccountSetting(data);
      return await newSetting.save();
    } catch (error: any) {
      throw new InvalidInputException(
        "Failed to insert account setting: " + error.message
      );
    }
  }

  public async getAccountSettingsByLoginId(loginId: string) {
    const groupSettings = await AccountSetting.findOne({ loginId });
    if (!groupSettings) {
      throw new NotFoundException(
        "Account settings not found for this loginId"
      );
    }
    return groupSettings;
  }

  public async getAccountSettingsSubCategories(
    loginId: string,
    mainCategory: string
  ) {
    const groupSettings = await AccountSetting.findOne({
      loginId,
      "pricebookServiceSubCategories.mainCategory": mainCategory,
    });

    if (!groupSettings) {
      throw new NotFoundException(
        "Account settings not found for given parameters"
      );
    }

    return groupSettings;
  }

  public async deleteStaffRoles(loginId: string) {
    const accountSetting = await AccountSetting.findOne({ loginId });

    if (!accountSetting) {
      throw new NotFoundException("Account setting not found for this loginId");
    }

    // accountSetting.staffRoles = [];

    await accountSetting.save();

    return {
      message: "Staff roles successfully deleted.",
      data: accountSetting,
    };
  }

  public async deletePriceBookSubCat(
    loginId: string,
    mainCategory: string,
    subCategoryId: string
  ) {
    const accountSetting = await AccountSetting.findOne({
      loginId,
      "pricebookServiceSubCategories.mainCategory": mainCategory,
    });

    if (!accountSetting) {
      throw new NotFoundException(
        "Account setting not found for the given loginId and mainCategory."
      );
    }

    const result = await AccountSetting.updateOne(
      {
        loginId,
        "pricebookServiceSubCategories.mainCategory": mainCategory,
      },
      {
        $pull: {
          "pricebookServiceSubCategories.$.subCategories": {
            _id: subCategoryId,
          },
        },
      }
    );

    if (result.modifiedCount === 0) {
      throw new InvalidInputException(
        "SubCategory not found or already deleted."
      );
    }

    return {
      message: "SubCategory deleted successfully",
      result,
    };
  }

  public async deleteEquipmentStatus(
    loginId: string,
    equipmentStatusId: string
  ) {
    const accountSetting = await AccountSetting.findOne({ loginId });

    if (!accountSetting) {
      throw new NotFoundException("Account setting not found for this loginId");
    }

    const result = await AccountSetting.updateOne(
      { loginId },
      {
        $pull: {
          equipmentStatuses: { _id: equipmentStatusId },
        },
      }
    );

    if (result.modifiedCount === 0) {
      throw new InvalidInputException(
        "Equipment status not found or already deleted."
      );
    }

    return {
      message: "Equipment status deleted successfully.",
      result,
    };
  }

  public async deleteEquipmentItemType(loginId: string, itemTypeId: string) {
    const accountSetting = await AccountSetting.findOne({ loginId });

    if (!accountSetting) {
      throw new NotFoundException("Account setting not found for this loginId");
    }

    const result = await AccountSetting.updateOne(
      { loginId },
      {
        $pull: {
          equipmentItemTypes: { _id: itemTypeId },
        },
      }
    );

    if (result.modifiedCount === 0) {
      throw new InvalidInputException(
        "Item type not found or already deleted."
      );
    }

    return {
      message: "Equipment item type deleted successfully",
      result,
    };
  }

  public async deletePreWorkInspectionForm(loginId: string, formId: string) {
    const accountSetting = await AccountSetting.findOne({ loginId });

    if (!accountSetting) {
      throw new NotFoundException("Account setting not found for this loginId");
    }

    const result = await AccountSetting.updateOne(
      { loginId },
      {
        $pull: {
          preWorkInspectionForms: { _id: formId },
        },
      }
    );

    if (result.modifiedCount === 0) {
      throw new InvalidInputException(
        "Pre-work inspection form not found or already deleted."
      );
    }

    return {
      message: "Pre-work inspection form deleted successfully.",
      result,
    };
  }

  public async insertInventorySubSubCat(
    loginId: string,
    mainCategory: string,
    subCategoryId: string,
    newSubSubCategory: { name: string }
  ) {
    const accountSetting = await AccountSetting.findOne({
      loginId,
      "pricebookServiceSubCategories.mainCategory": mainCategory,
      "pricebookServiceSubCategories.subCategories._id": subCategoryId,
    });

    if (!accountSetting) {
      throw new NotFoundException("Account setting or sub-category not found.");
    }

    const updateResult = await AccountSetting.updateOne(
      {
        loginId,
        "pricebookServiceSubCategories.mainCategory": mainCategory,
        "pricebookServiceSubCategories.subCategories._id": subCategoryId,
      },
      {
        $push: {
          "pricebookServiceSubCategories.$[mainCat].subCategories.$[subCat].subSubCategories":
            newSubSubCategory,
        },
      },
      {
        arrayFilters: [
          { "mainCat.mainCategory": mainCategory },
          { "subCat._id": subCategoryId },
        ],
      }
    );

    if (updateResult.modifiedCount === 0) {
      throw new InvalidInputException("Failed to insert sub-sub-category.");
    }

    return {
      message: "Sub-sub-category added successfully.",
      result: updateResult,
    };
  }

  public async updatePaymentGateway(
    loginId: string,
    gatewayId: string,
    updatedData: any
  ) {
    const accountSetting = await AccountSetting.findOne({ loginId });

    if (!accountSetting) {
      throw new NotFoundException("Account setting not found for this loginId");
    }

    const updateResult = await AccountSetting.updateOne(
      {
        loginId,
        "paymentGateways._id": gatewayId,
      },
      {
        $set: {
          "paymentGateways.$": {
            ...updatedData,
            _id: gatewayId, // Ensure the ID remains intact
          },
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      throw new InvalidInputException("Payment gateway update failed");
    }

    return {
      message: "Payment gateway updated successfully",
      result: updateResult,
    };
  }

  public async deleteInventorySubSubCat(
    loginId: string,
    mainCategory: string,
    subCategoryId: string,
    subSubCategoryId: string
  ) {
    const accountSetting = await AccountSetting.findOne({
      loginId,
      "pricebookServiceSubCategories.mainCategory": mainCategory,
      "pricebookServiceSubCategories.subCategories._id": subCategoryId,
    });

    if (!accountSetting) {
      throw new NotFoundException("Account setting or sub-category not found.");
    }

    const updateResult = await AccountSetting.updateOne(
      {
        loginId,
        "pricebookServiceSubCategories.mainCategory": mainCategory,
        "pricebookServiceSubCategories.subCategories._id": subCategoryId,
      },
      {
        $pull: {
          "pricebookServiceSubCategories.$[mainCat].subCategories.$[subCat].subSubCategories":
            {
              _id: subSubCategoryId,
            },
        },
      },
      {
        arrayFilters: [
          { "mainCat.mainCategory": mainCategory },
          { "subCat._id": subCategoryId },
        ],
      }
    );

    if (updateResult.modifiedCount === 0) {
      throw new InvalidInputException("Failed to delete sub-sub-category.");
    }

    return {
      message: "Sub-sub-category deleted successfully.",
      result: updateResult,
    };
  }

  public async deleteInventory(loginId: string, inventoryId: string) {
    const accountSetting = await AccountSetting.findOne({ loginId });

    if (!accountSetting) {
      throw new NotFoundException("Account setting not found for this loginId");
    }

    const updateResult = await AccountSetting.updateOne(
      { loginId },
      {
        $pull: {
          inventories: { _id: inventoryId },
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      throw new InvalidInputException(
        "Inventory item not found or already deleted."
      );
    }

    return {
      message: "Inventory item deleted successfully.",
      result: updateResult,
    };
  }

  public async getPriceBookSubcategoryByCategory(
    loginId: string,
    mainCategory: string
  ) {
    const accountSetting = await AccountSetting.findOne({ loginId });

    if (!accountSetting) {
      throw new NotFoundException("Data Not Found");
    }

    const priceBookData = accountSetting.pricebookServiceSubCategories;
    if (!priceBookData || priceBookData.length === 0) {
      throw new NotFoundException("Inv Data Not Found");
    }

    const filterData = priceBookData.filter(
      (ele) => ele.mainCategory === mainCategory
    );

    if (filterData.length === 0) {
      throw new NotFoundException("Inv category Data Not Found");
    }

    return filterData;
  }

  public async getPriceBookCategoriesFromAcc(loginId: string) {
    const accountSetting = await AccountSetting.findOne({ loginId });

    if (!accountSetting) {
      throw new NotFoundException("Account setting not found for this loginId");
    }

    const categories = accountSetting.pricebookServiceSubCategories;

    if (!categories || categories.length === 0) {
      throw new NotFoundException(
        "No price book categories found for this loginId"
      );
    }

    return {
      message: "Price book categories retrieved successfully.",
      data: categories,
    };
  }

  public async updateaccountSetting(
    loginId: string,
    data: Partial<IAccountSetting>
  ) {
    const updatedAccount = await AccountSetting.findOneAndUpdate(
      { loginId },
      {
        $set: {
          General: data.General,
          StaffRoles: data.StaffRoles,
          StaffAgreements: data.StaffAgreements,
          Inventory: data.Inventory,
          markups: data.markups,
          priceBookPackageName: data.priceBookPackageName,
          pricebookServiceSubCategories: data.pricebookServiceSubCategories,
          equipmentItemType: data.equipmentItemType,
          equipmentStatus: data.equipmentStatus,
          EstimatePriceBook: data.EstimatePriceBook,
          invoice: data.invoice,
          LogInAgreements: data.LogInAgreements,
          equipment: data.equipment,
          marketingMediaType: data.marketingMediaType,
          Vendors: data.Vendors,
          preWorkInsepection: data.preWorkInsepection,
          postWorkInsepection: data.postWorkInsepection,
          Timecard: data.Timecard,
          messagesandalerts: data.messagesandalerts,
          payment_geteWay: data.payment_geteWay,
        },
      },
      { upsert: true, new: true }
    );

    if (!updatedAccount) {
      throw new InvalidInputException("Failed to update account setting");
    }

    return {
      message: "Account setting updated successfully.",
      data: updatedAccount,
    };
  }

  public async updateaccountSettingsRolePermissions(
    loginId: string,
    roleCode: string,
    permissions: any
  ) {
    const accountSetting = await AccountSetting.findOne({
      loginId,
      StaffRoles: { $elemMatch: { roleCode } },
    });

    if (!accountSetting) {
      throw new NotFoundException("Account setting or role not found.");
    }

    const updated = await AccountSetting.updateOne(
      {
        loginId,
        StaffRoles: { $elemMatch: { roleCode } },
      },
      {
        $set: {
          "StaffRoles.$.permissions": permissions,
        },
      },
      { upsert: true }
    );

    if (updated.modifiedCount === 0 && updated.upsertedCount === 0) {
      throw new InvalidInputException("Failed to update permissions.");
    }

    return {
      message: "Updated role permissions successfully.",
      result: updated,
    };
  }

  public async deletePostWorkInspectionForm(loginId: string, formId: string) {
    const accountSetting = await AccountSetting.findOne({ loginId });

    if (!accountSetting) {
      throw new NotFoundException("Account setting not found for this loginId");
    }

    const result = await AccountSetting.updateOne(
      { loginId },
      {
        $pull: {
          postWorkInsepection: { _id: formId },
        },
      }
    );

    if (result.modifiedCount === 0) {
      throw new InvalidInputException(
        "Post work inspection form not found or already deleted."
      );
    }

    return {
      message: "Post work inspection form deleted successfully.",
      result,
    };
  }

  public async deleteVendors(loginId: string, vendorCategory: string) {
    const existingVendors = await Vendor.find({
      loginId,
      vendorCategory,
      status: "ACTIVE",
    });

    if (existingVendors && existingVendors.length > 0) {
      throw new InvalidInputException(
        "Sorry, there are active vendors for this vendor category."
      );
    }

    const result = await AccountSetting.updateOne(
      { loginId },
      {
        $pull: {
          Vendors: { vendorCategory },
        },
      }
    );

    return {
      message: "Vendors deleted successfully.",
      result,
    };
  }

  public async deleteSaleseMarketing(loginId: string, sourceType: string) {
    const promotions = await Promo.find({
      loginId,
      marketingMediaType: sourceType,
      status: { $in: ["DRAFT", "ACTIVE"] },
    });

    if (promotions.length > 0) {
      throw new InvalidInputException(
        "Sorry, there are active or draft promotions for this marketing media type."
      );
    }

    const result = await AccountSetting.updateOne(
      { loginId },
      {
        $pull: {
          marketingMediaType: { sourceType },
        },
      }
    );

    return {
      message: "Marketing media type deleted successfully.",
      result,
    };
  }

  public async deleteEquipmentStatusById(
    loginId: string,
    equipmentStatusId: string
  ) {
    const accountSetting = await AccountSetting.findOne({ loginId });

    if (!accountSetting) {
      throw new NotFoundException("Account setting not found for this loginId");
    }

    const result = await AccountSetting.updateOne(
      { loginId },
      {
        $pull: {
          equipmentStatus: { _id: equipmentStatusId },
        },
      }
    );

    if (result.modifiedCount === 0) {
      throw new InvalidInputException(
        "Equipment status not found or already deleted."
      );
    }

    return {
      message: "Equipment status deleted successfully.",
      result,
    };
  }
}
