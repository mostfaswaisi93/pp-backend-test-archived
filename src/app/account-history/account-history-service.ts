import { AccountHistory } from "../../models/account-history/account-history.model";
import { IAccountHistory } from "../../models/account-history/account-history.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class AccountHistoryService {
  private static _instance: AccountHistoryService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IAccountHistory) {
    // if (data.name) {
    //   let nameExist = await AccountHistory.findOne({ name: data.name });
    //   if (nameExist) {
    //     throw new InvalidInputException("AccountHistory name already exists");
    //   }
    // }

    let accountHistory = new AccountHistory({});

    try {
      let result = await accountHistory.save();
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async getAccountHistoryById(_id: string) {
    const accountHistory = await AccountHistory.findById({ _id });
    if (!accountHistory)
      throw new InvalidInputException("AccountHistory not found");
    return accountHistory;
  }

  public async getLastAccountHistoryId() {
    const lastAccountHistory = await AccountHistory.findOne().sort({ _id: -1 });
    if (!lastAccountHistory)
      throw new InvalidInputException("There are no accountHistories.");
    return lastAccountHistory;
  }

  public async getAccountHistories() {
    const accountHistories = await AccountHistory.find({
      status: "ACTIVE",
    }).sort({
      name: 1,
    });
    if (accountHistories.length === 0)
      throw new InvalidInputException("AccountHistories not found");
    return accountHistories;
  }

  public async getAccountHistoriesWithSSP() {
    const accountHistories = await AccountHistory.find({
      status: "ACTIVE",
    }).sort({
      name: 1,
    });
    if (accountHistories.length === 0)
      throw new InvalidInputException("AccountHistories not found");
    return accountHistories;
  }

  public async getAccountHistoryName(body: any) {
    if (!Array.isArray(body)) {
      return {
        error: true,
        message: "Invalid request body. An array is expected.",
      };
    }

    const tradeLicenseArray: string[] = body.map(
      (item: { tradeLicense: string }) => item.tradeLicense
    );

    const accountHistories = await AccountHistory.find({
      status: "ACTIVE",
      code: { $in: tradeLicenseArray },
    });

    if (accountHistories.length === 0)
      throw new InvalidInputException("AccountHistories not found");
    return { error: false, accountHistories: accountHistories ?? [] };
  }

  public async update(_id: string, data: IAccountHistory) {
    const accountHistory = await AccountHistory.findOne({ _id });
    if (!accountHistory) {
      throw new NotFoundException();
    }

    let updatedAccountHistory = await AccountHistory.findByIdAndUpdate(
      _id,
      {
        $set: {},
      },
      {
        new: true,
      }
    );

    if (!updatedAccountHistory)
      throw new InvalidInputException("Account History not found");
    return updatedAccountHistory;
  }

  public async updateStatus(_id: string, data: IAccountHistory) {
    let accountHistory = await AccountHistory.findOne({ _id });

    if (!accountHistory) {
      throw new NotFoundException();
    }

    let updateStatus = await AccountHistory.findByIdAndUpdate(
      _id,
      {
        $set: {
          status: data.status || accountHistory.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus)
      throw new InvalidInputException("Account History not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const accountHistory = await AccountHistory.findByIdAndDelete({ _id });
    if (!accountHistory)
      throw new InvalidInputException("Account History not found");
  }
}
