import { IServiceAddress } from "./service-address.interface";
import { IWorkDescription } from "./work-description.interface";

export interface IWorkorder extends Document {
  _id: string;
  workOrderNumber?: string;
  customerId?: string;
  proId?: string;
  proSystemId?: string;
  customerName?: string;
  customerSince?: string;
  email: string; // Changed 'emailId' to 'email' for common usage
  firstName: string;
  lastName: string;
  phone: string; // Changed 'phoneNumber' to 'phone' for clarity
  phoneCategory?: string; // Changed 'phoneType' to 'phoneCategory' for better clarity
  streetAddress: string;
  zipcode: string;
  unit?: string;
  city: string;
  state: string;
  county: string;
  adminNotes?: string;
  sendInvoiceBy?: string; // Changed 'sendinvoiceBy' to 'sendInvoiceBy' for consistency
  invoiceEmail?: string;
  sendInvoiceTo?: string; // Changed 'sendinvoiceTo' to 'sendInvoiceTo' for consistency
  customerType?: string;
  jobdispatchtextNo?: string;
  po?: string;
  source?: string;
  paymentMethod?: string;
  customerCreditLimit?: number; // Changed 'customercreditLimit' to 'customerCreditLimit' for consistency
  customerCreditLimitRequired?: boolean; // Changed 'customercreditLimitRequired' to 'customerCreditLimitRequired' for consistency
  terms?: string;
  poRequired?: string;
  promoCode?: string;
  promotionName?: string;
  packageType?: string;
  emergency?: boolean;
  reCall?: boolean;
  preWorkChecklistNeeded?: boolean;
  postWorkChecklistNeeded?: boolean;
  sendReminderToAssignedWo?: string; // Changed 'sendRemainderToAssignedWo' to 'sendReminderToAssignedWo' for correct spelling
  sendReminderStaffLoginId?: string; // Changed 'sendRemainderstaffloginId' to 'sendReminderStaffLoginId' for correct spelling
  notes?: string;
  group?: string;
  groupId?: string;
  serviceAddress?: IServiceAddress; // Changed 'ServiceAddress' to 'serviceAddress' for consistency
  workDescription?: IWorkDescription; // Changed 'WorkDescription' to 'workDescription' for consistency
  status?: string;
  createdBy?: string;
  createdDate?: string; // Changed 'createdOn' to 'createdDate' for consistency
  modifiedBy?: string;
  modifiedByEmail?: string;
  modifiedDate?: string; // Changed 'modifiedOn' to 'modifiedDate' for consistency
}
