import { Schema, model, Document, Types } from "mongoose";

interface ITechInfo {
  id?: Types.ObjectId;
  staffId?: string;
  name?: string;
  email?: string;
  avatar?: string;
  staffLocation?: string;
  role?: string;
  employementStatus?: string;
  group?: string;
  status?: string;
  commisionRange?: Record<string, any>;
}

interface IBillingDetails {
  customerName?: string;
  customerType?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  customerSince?: Date;
  streetAddress?: string;
  zip?: string;
  city?: string;
  state?: string;
  paymentMethod?: string;
  invoiceEmail?: string;
  adminNotes?: string;
  poNumber?: string;
  customerCreditLimit?: string;
  terms?: string;
}

interface IProduct {
  productType?: "material" | "pricebook" | "labor" | "custom";
  id?: Types.ObjectId;
  itemId?: string;
  ref?: "inventory" | "pricebook" | "staff";
  name?: string;
  description?: string;
  qty: number;
  units?: string;
  role?: string;
  unitPrice?: number;
  costPrice?: number;
  subTotal?: number;
  image?: string;
  productLocation?: string;
}

interface ITransactions {
  paidAmount?: number;
  unpaidAmount?: number;
  writeOffAmount?: number;
  refundedAmount?: number;
  creditAmount?: number;
  usedCreditAmount?: number;
  actualPaidAmount?: number;
  availableForRefundRequests?: number;
  transactionDate?: Date;
  paidDeposits?: Types.ObjectId[];
  refundedDeposits?: Types.ObjectId[];
  creditDeposits?: Types.ObjectId[];
}

export interface IInvoice extends Document {
  invoiceNumber?: string;
  customer?: Types.ObjectId;
  pro?: Types.ObjectId;
  estimate?: Types.ObjectId;
  estimateNumber?: string;
  workOrder?: Types.ObjectId;
  workOrderNumber?: string;
  primaryTech?: ITechInfo;
  secondaryTech?: ITechInfo;
  channelManager?: ITechInfo;
  parentLoginId?: Types.ObjectId;
  managerLoginId?: Types.ObjectId;
  billing_details?: IBillingDetails;
  createdBy?: string;
  createdByLoginId?: Types.ObjectId;
  createdFrom?: "workOrder" | "estimate";
  jobTitle?: string;
  jobDescription?: string;
  status?:
    | "temp"
    | "draft"
    | "partiallyPaid"
    | "paid"
    | "unpaid"
    | "pending"
    | "refunded"
    | "modify"
    | "voided";
  images?: string[];
  videos?: string[];
  invoiceNotes?: string;
  jobSiteNotes?: string;
  techNotes?: string;
  labourWarranty?: number;
  partsWarranty?: number;
  unpaidBalanceReminder?: number;
  products?: IProduct[];
  totalBeforeDiscount?: number;
  discount?: {
    id?: Types.ObjectId;
    promotionCode?: string;
    promotionName?: string;
    amount?: number;
  };
  totalAfterDiscount?: number;
  materialTax?: number;
  laborTax?: number;
  taxAmount?: number;
  totalAmount?: number;
  transactions?: ITransactions;
  dueDate?: Date;
  agreedToTerms?: boolean;
  termsAndConditions?: string[];
  invoiceSignature?: {
    signature?: string;
    date?: Date;
    isString?: boolean;
  };
}
