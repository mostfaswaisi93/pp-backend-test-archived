import { Schema, model } from "mongoose";
import { IWorkorder } from "./workorder.interface";

const workorderSchema = new Schema<IWorkorder>(
  {
    workOrderNumber: { type: String },
    customerId: { type: String },
    proId: { type: String },
    proSystemId: { type: String },
    customerName: { type: String },
    customerSince: { type: String },
    email: { type: String, required: true }, // Changed 'emailId' to 'email'
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true }, // Changed 'phoneNumber' to 'phone'
    phoneCategory: { type: String }, // Changed 'phoneType' to 'phoneCategory'
    streetAddress: { type: String, required: true },
    zipcode: { type: String, required: true },
    unit: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    county: { type: String, required: true },
    adminNotes: { type: String },
    sendInvoiceBy: { type: String }, // Changed 'sendinvoiceBy' to 'sendInvoiceBy'
    invoiceEmail: { type: String },
    sendInvoiceTo: { type: String }, // Changed 'sendinvoiceTo' to 'sendInvoiceTo'
    customerType: { type: String },
    jobdispatchtextNo: { type: String },
    po: { type: String },
    source: { type: String },
    paymentMethod: { type: String },
    customerCreditLimit: { type: Number }, // Changed 'customercreditLimit' to 'customerCreditLimit'
    customerCreditLimitRequired: { type: Boolean, default: false }, // Changed 'customercreditLimitRequired' to 'customerCreditLimitRequired'
    terms: { type: String },
    poRequired: { type: String },
    promoCode: { type: String },
    promotionName: { type: String },
    packageType: { type: String },
    emergency: { type: Boolean, default: false },
    reCall: { type: Boolean, default: false },
    preWorkChecklistNeeded: { type: Boolean, default: false },
    postWorkChecklistNeeded: { type: Boolean, default: false },
    sendReminderToAssignedWo: { type: String }, // Changed 'sendRemainderToAssignedWo' to 'sendReminderToAssignedWo'
    sendReminderStaffLoginId: { type: String }, // Changed 'sendRemainderstaffloginId' to 'sendReminderStaffLoginId'
    notes: { type: String },
    group: { type: String },
    groupId: { type: String },
    serviceAddress: { type: Object }, // Changed 'ServiceAddress' to 'serviceAddress'
    workDescription: { type: Object }, // Changed 'WorkDescription' to 'workDescription'
    status: { type: String },
    createdBy: { type: String },
    createdDate: { type: String }, // Changed 'createdOn' to 'createdDate'
    modifiedBy: { type: String },
    modifiedByEmail: { type: String },
    modifiedDate: { type: String }, // Changed 'modifiedOn' to 'modifiedDate'
  },
  { timestamps: true }
);

export const Workorder = model<IWorkorder>("Workorder", workorderSchema);
