import ProCustomer from "../../models/pro-customer/pro-customer.model";
import { IProCustomer } from "../../models/pro-customer/pro-customer.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class ProCustomerService {
  private static _instance: ProCustomerService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IProCustomer) {
    if (!data.customerId || !data.customerEmailId || !data.proUserId) {
      throw new InvalidInputException(
        "Missing required fields: customerId, customerEmailId, or proUserId"
      );
    }

    let existingProCustomer = await ProCustomer.findOne({
      customerId: data.customerId,
      proUserId: data.proUserId,
    });

    if (existingProCustomer) {
      throw new InvalidInputException(
        "Pro customer already exists for this customer and pro"
      );
    }

    const proCustomer = new ProCustomer({
      customerId: data.customerId,
      customerEmailId: data.customerEmailId,
      proEmailId: data.proEmailId,
      proUserId: data.proUserId,
      proId: data.proId,
      type: data.type,
      customerUserId: data.customerUserId,
      customerRef: data.customerRef,
      proRef: data.proRef,
      customerType: data.customerType,
      businessName: data.businessName,
      phoneNumber: data.phoneNumber,
      dispatchTextNumber: data.dispatchTextNumber,
      source: data.source,
      vendor: data.vendor,
      paymentMethod: data.paymentMethod,
      creditLimit: data.creditLimit,
      paymentTerms: data.paymentTerms,
      taxExempt: data.taxExempt,
      poRequired: data.poRequired,
      doNotServe: data.doNotServe,
      doNotServeReason: data.doNotServeReason,
      subscribeToReceiveMarketingEmails: data.subscribeToReceiveMarketingEmails,
      mediaFiles: data.mediaFiles,
      status: data.status ?? "Active",
      createdBy: data.createdBy,
      createdOn: new Date(),
      createdByEmail: data.createdByEmail,
      createdById: data.createdById,
      createdByRole: data.createdByRole,
      staffAssignedLoginIds: data.staffAssignedLoginIds,
      updatedBy: data.updatedBy,
      updatedByImageUrl: data.updatedByImageUrl,
      updatedByEmail: data.updatedByEmail,
      customerBillingAddress: {
        firstName: data.customerBillingAddress?.firstName,
        lastName: data.customerBillingAddress?.lastName,
        userType: data.customerBillingAddress?.userType,
        address: data.customerBillingAddress?.address,
        invoiceEmail: data.customerBillingAddress?.invoiceEmail,
        city: data.customerBillingAddress?.city,
        country: data.customerBillingAddress?.country,
        state: data.customerBillingAddress?.state,
        zipCode: data.customerBillingAddress?.zipCode,
        adminNotes: data.customerBillingAddress?.adminNotes,
      },
      isDeleted: data.isDeleted,
    });

    try {
      return await proCustomer.save();
    } catch (error: any) {
      throw new Error("Error saving pro customer: " + error.message);
    }
  }

  public async getProCustomerById(_id: string) {
    const proCustomer = await ProCustomer.findById({ _id });
    if (!proCustomer) throw new InvalidInputException("Pro customer not found");
    return proCustomer;
  }

  public async getProCustomers() {
    const proCustomers = await ProCustomer.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (proCustomers.length === 0)
      throw new InvalidInputException("Pro customers not found");
    return proCustomers;
  }

  public async update(_id: string, data: Partial<IProCustomer>) {
    if (!Object.keys(data).length) {
      throw new InvalidInputException("No update data provided");
    }

    const updatedProCustomer = await ProCustomer.findByIdAndUpdate(
      _id,
      {
        $set: {
          customerId: data.customerId,
          customerEmailId: data.customerEmailId,
          proEmailId: data.proEmailId,
          proUserId: data.proUserId,
          proId: data.proId,
          type: data.type,
          customerUserId: data.customerUserId,
          customerRef: data.customerRef,
          proRef: data.proRef,
          customerType: data.customerType,
          businessName: data.businessName,
          phoneNumber: data.phoneNumber,
          dispatchTextNumber: data.dispatchTextNumber,
          source: data.source,
          vendor: data.vendor,
          paymentMethod: data.paymentMethod,
          creditLimit: data.creditLimit,
          paymentTerms: data.paymentTerms,
          taxExempt: data.taxExempt,
          poRequired: data.poRequired,
          doNotServe: data.doNotServe,
          doNotServeReason: data.doNotServeReason,
          subscribeToReceiveMarketingEmails:
            data.subscribeToReceiveMarketingEmails,
          mediaFiles: data.mediaFiles,
          status: data.status,
          createdBy: data.createdBy,
          createdOn: data.createdOn,
          createdByEmail: data.createdByEmail,
          createdById: data.createdById,
          createdByRole: data.createdByRole,
          staffAssignedLoginIds: data.staffAssignedLoginIds,
          updatedBy: data.updatedBy,
          updatedByImageUrl: data.updatedByImageUrl,
          updatedByEmail: data.updatedByEmail,
          customerBillingAddress: {
            firstName: data.customerBillingAddress?.firstName,
            lastName: data.customerBillingAddress?.lastName,
            userType: data.customerBillingAddress?.userType,
            address: data.customerBillingAddress?.address,
            invoiceEmail: data.customerBillingAddress?.invoiceEmail,
            city: data.customerBillingAddress?.city,
            country: data.customerBillingAddress?.country,
            state: data.customerBillingAddress?.state,
            zipCode: data.customerBillingAddress?.zipCode,
            adminNotes: data.customerBillingAddress?.adminNotes,
          },
          isDeleted: data.isDeleted,
        },
      },
      { new: true }
    );

    if (!updatedProCustomer) {
      throw new NotFoundException("Pro Customer not found or update failed");
    }

    return updatedProCustomer;
  }

  public async updateStatus(_id: string, data: IProCustomer) {
    let proCustomer = await ProCustomer.findOne({ _id });

    if (!proCustomer) {
      throw new NotFoundException();
    }

    let updateStatus = await ProCustomer.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || proCustomer.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus)
      throw new InvalidInputException("Pro customer not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const proCustomer = await ProCustomer.findByIdAndDelete({ _id });
    if (!proCustomer) throw new InvalidInputException("Pro customer not found");
  }
}
