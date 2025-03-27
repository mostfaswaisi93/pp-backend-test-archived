import Transaction from "../../models/transaction/transaction.model";
import { ITransaction } from "../../models/transaction/transaction.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class TransactionService {
  private static _instance: TransactionService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: ITransaction) {
    // if (!data.day || !data.fromTime || !data.toTime) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    let existingTransaction = await Transaction.findOne({
      // day: data.day,
    });
    if (existingTransaction) {
      throw new InvalidInputException(
        "Transaction already exists for this day"
      );
    }

    let transaction = new Transaction({
      // day: data.day,
      // status: data.status ?? "OPEN",
    });

    try {
      return await transaction.save();
    } catch (error: any) {
      throw new Error("Error saving transaction: " + error.message);
    }
  }

  public async getTransactionById(_id: string) {
    const transaction = await Transaction.findById({ _id });
    if (!transaction) throw new InvalidInputException("Transaction not found");
    return transaction;
  }

  public async getTransactions() {
    const transactions = await Transaction.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (transactions.length === 0)
      throw new InvalidInputException("Transactions not found");
    return transactions;
  }

  public async update(_id: string, data: ITransaction) {
    const transaction = await Transaction.findById(_id);
    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }

    // if (data.day) {
    //   let existingTransaction = await Transaction.findOne({
    //     day: data.day,
    //     _id: { $ne: _id },
    //   });
    //   if (existingTransaction) {
    //     throw new InvalidInputException(
    //       "Transaction already exists for this day"
    //     );
    //   }
    // }

    let updatedTransaction = await Transaction.findByIdAndUpdate(
      _id,
      {
        $set: {
          // day: data.day ?? transaction.day,
          // fromTime: data.fromTime ?? transaction.fromTime,
          // toTime: data.toTime ?? transaction.toTime,
          // status: data.status ?? transaction.status,
        },
      },
      { new: true }
    );

    if (!updatedTransaction) {
      throw new InvalidInputException("Failed to update Transaction");
    }
    return updatedTransaction;
  }

  public async updateStatus(_id: string, data: ITransaction) {
    let transaction = await Transaction.findOne({ _id });

    if (!transaction) {
      throw new NotFoundException();
    }

    let updateStatus = await Transaction.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || transaction.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Transaction not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const transaction = await Transaction.findByIdAndDelete({ _id });
    if (!transaction) throw new InvalidInputException("Transaction not found");
  }
}
