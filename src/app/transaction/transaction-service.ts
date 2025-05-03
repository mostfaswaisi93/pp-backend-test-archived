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
    let existingTransaction = await Transaction.findOne({});
    if (existingTransaction) {
      throw new InvalidInputException(
        "Transaction already exists for this day"
      );
    }

    let transaction = new Transaction({
      customerId: data.customerId,
      proUserId: data.proUserId,
      invoiceId: data.invoiceId,
      invoiceNumber: data.invoiceNumber,
      transactionId: data.transactionId,
      transactionNumber: data.transactionNumber,
      creditCard: data.creditCard,
      cardName: data.cardName,
      transactionType: data.transactionType,
      documentType: data.documentType,
      status: data.status,
      amount: data.amount,
      creditCardProcessingFee: data.creditCardProcessingFee,
      creditCardPF: data.creditCardPF,
      totalAmount: data.totalAmount,
      paymentType: data.paymentType,
      zelleId: data.zelleId,
      venmoId: data.venmoId,
      appleId: data.appleId,
      googleId: data.googleId,
      payPalEmail: data.payPalEmail,
      companyName: data.companyName,
      checkNumber: data.checkNumber,
      insuranceName: data.insuranceName,
      bankName: data.bankName,
      transactionTimestamp: data.transactionTimestamp,
      transactionRemarks: data.transactionRemarks,
      writeOffReason: data.writeOffReason,
      message: data.message,
      source: data.source,
      refundRequested: data.refundRequested,
      creditAppliedFrom: data.creditAppliedFrom,
      isVoided: data.isVoided,
      cancellationReason: data.cancellationReason,
      createdBy: data.createdBy,
      creatorRole: data.creatorRole,
      voidedBy: data.voidedBy,
      voidedAt: data.voidedAt,
      details: data.details,
      businessInfo: data.businessInfo,
      isVerified: data.isVerified,
      verifiedBy: data.verifiedBy,
    });

    try {
      return await transaction.save();
    } catch (error: any) {
      throw new Error("Error saving transaction: " + error.message);
    }
  }

  public async getTransactionById(_id: string) {
    const transaction = await Transaction.findById(_id);
    if (!transaction) throw new NotFoundException("Transaction not found");
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

    let updatedTransaction = await Transaction.findByIdAndUpdate(
      _id,
      {
        $set: {
          customerId: data.customerId,
          proUserId: data.proUserId,
          invoiceId: data.invoiceId,
          invoiceNumber: data.invoiceNumber,
          transactionId: data.transactionId,
          transactionNumber: data.transactionNumber,
          creditCard: data.creditCard,
          cardName: data.cardName,
          transactionType: data.transactionType,
          documentType: data.documentType,
          status: data.status,
          amount: data.amount,
          creditCardProcessingFee: data.creditCardProcessingFee,
          creditCardPF: data.creditCardPF,
          totalAmount: data.totalAmount,
          paymentType: data.paymentType,
          zelleId: data.zelleId,
          venmoId: data.venmoId,
          appleId: data.appleId,
          googleId: data.googleId,
          payPalEmail: data.payPalEmail,
          companyName: data.companyName,
          checkNumber: data.checkNumber,
          insuranceName: data.insuranceName,
          bankName: data.bankName,
          transactionTimestamp: data.transactionTimestamp,
          transactionRemarks: data.transactionRemarks,
          writeOffReason: data.writeOffReason,
          message: data.message,
          source: data.source,
          refundRequested: data.refundRequested,
          creditAppliedFrom: data.creditAppliedFrom,
          isVoided: data.isVoided,
          cancellationReason: data.cancellationReason,
          createdBy: data.createdBy,
          creatorRole: data.creatorRole,
          voidedBy: data.voidedBy,
          voidedAt: data.voidedAt,
          details: data.details,
          businessInfo: data.businessInfo,
          isVerified: data.isVerified,
          verifiedBy: data.verifiedBy,
        },
      },
      { new: true }
    );

    if (!updatedTransaction) {
      throw new InvalidInputException("Failed to update Transaction");
    }
    return updatedTransaction;
  }

  public async updateStatus(_id: string, status: string) {
    let transaction = await Transaction.findOne({ _id });

    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }

    let updateStatus = await Transaction.findByIdAndUpdate(
      _id,
      {
        $set: {
          status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus)
      throw new InvalidInputException("Failed to update status");
    return updateStatus;
  }

  public async delete(_id: string) {
    const transaction = await Transaction.findByIdAndDelete({ _id });
    if (!transaction) throw new NotFoundException("Transaction not found");
  }
}
