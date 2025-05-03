import { Document } from "mongoose";

export interface IUom {
  unitMeasurement: string;
  symbol: string;
  category: string;
  status: string;
}

export interface IEmploymentStatus {
  employmentStatus: string;
  status: string;
}

export interface IPaymentMethod {
  paymentMethods: string;
  status: string;
}

export interface ITimeCardActivity {
  name: string;
  status: string;
}

export interface ICurrentStatus {
  name: string;
  color: string;
  status: string;
}

export interface IWorkOrder {
  WoStatusTag: string;
  status: string;
}

export interface IGlobalTerm {
  termName: string;
  text: string;
}

export interface IEstimateStatusTag {
  estimateStatusTag: string;
  colorCode: string;
  status: string;
}

export interface IInvoiceStatusTag {
  invoiceStatusTag: string;
  colorCode: string;
  status: string;
}

export interface IServiceTypeTag {
  serviceTypeTag: string;
  status: string;
}

export interface IPurchaseOrder {
  purchaseOrder: string;
  status: string;
}

export interface IAppVersion {
  title: string;
  description: string;
  androidUrl: string;
  iosUrl: string;
  AndroidVersion: string;
  IOSVersion: string;
}

export interface IGlobalSetting extends Document {
  loginId: string;
  uom: IUom[];
  EmployementStatus: IEmploymentStatus[];
  paymentMethods: IPaymentMethod[];
  timeCardActivities: ITimeCardActivity[];
  currentStatus: ICurrentStatus[];
  workOrder: IWorkOrder[];
  globalTermsAndConditions: IGlobalTerm[];
  estimateStatusTags: IEstimateStatusTag[];
  invoiceStatusTags: IInvoiceStatusTag[];
  serviceTypeTags: IServiceTypeTag[];
  purchaseOrders: IPurchaseOrder[];
  appVersions: IAppVersion;
  Geofence_radius: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
