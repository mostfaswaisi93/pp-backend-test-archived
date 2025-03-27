import { Invoice } from "../../models/invoice/invoice.model";
import { IInvoice } from "../../models/invoice/invoice.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class InvoiceService {
  private static _instance: InvoiceService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IInvoice) {
    // if (!data.day || !data.fromTime || !data.toTime) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    let existingInvoice = await Invoice.findOne({
      // day: data.day,
    });
    if (existingInvoice) {
      throw new InvalidInputException("Invoice already exists for this day");
    }

    let invoice = new Invoice({
      // day: data.day,
      // status: data.status ?? "OPEN",
    });

    try {
      return await invoice.save();
    } catch (error: any) {
      throw new Error("Error saving invoice: " + error.message);
    }
  }

  public async getInvoiceById(_id: string) {
    const invoice = await Invoice.findById({ _id });
    if (!invoice) throw new InvalidInputException("Invoice not found");
    return invoice;
  }

  public async getInvoices() {
    const invoices = await Invoice.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (invoices.length === 0)
      throw new InvalidInputException("Invoices not found");
    return invoices;
  }

  public async update(_id: string, data: IInvoice) {
    const invoice = await Invoice.findById(_id);
    if (!invoice) {
      throw new NotFoundException("Invoice not found");
    }

    // if (data.day) {
    //   let existingInvoice = await Invoice.findOne({
    //     day: data.day,
    //     _id: { $ne: _id },
    //   });
    //   if (existingInvoice) {
    //     throw new InvalidInputException(
    //       "Invoice already exists for this day"
    //     );
    //   }
    // }

    let updatedInvoice = await Invoice.findByIdAndUpdate(
      _id,
      {
        $set: {
          // day: data.day ?? invoice.day,
          // fromTime: data.fromTime ?? invoice.fromTime,
          // toTime: data.toTime ?? invoice.toTime,
          // status: data.status ?? invoice.status,
        },
      },
      { new: true }
    );

    if (!updatedInvoice) {
      throw new InvalidInputException("Failed to update invoice");
    }
    return updatedInvoice;
  }

  public async updateStatus(_id: string, data: IInvoice) {
    let invoice = await Invoice.findOne({ _id });

    if (!invoice) {
      throw new NotFoundException();
    }

    let updateStatus = await Invoice.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || invoice.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Invoice not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const invoice = await Invoice.findByIdAndDelete({ _id });
    if (!invoice) throw new InvalidInputException("Invoice not found");
  }
}
