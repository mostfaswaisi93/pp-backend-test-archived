import { AccountSetting } from "../../models/account-setting/account-setting.model";
import { IAccountSetting } from "../../models/account-setting/account-setting.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

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
}
