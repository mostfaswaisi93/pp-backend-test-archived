import mongoose, { Mongoose } from "mongoose";
import User from "./user/user.model";
import Pro from "./pro/pro.model";
import { Vendor } from "./vendor/vendor.model";
import { Workorder } from "./workorder/workorder.model";
import { Estimate } from "./estimate/estimate.model";
import { AccountSetting } from "./account-setting/account-setting.model";
import { Invoice } from "./invoice/invoice.model";
import { Permission } from "./permission/permission.model";
import { PriceList } from "./price-list/price-list.model";
import { Pricebook } from "./pricebook/pricebook.model";
import ProCustomer from "./pro-customer/pro-customer.model";
import { Promo } from "./promo/promo.model";
import { Role } from "./role/role.model";
import { Staff } from "./staff/staff.model";
import TruckOrder from "./truck-order/truck-order.model";
import Transaction from "./transaction/transaction.model";
import { PurchaseOrder } from "./purchase-order/purchase-order.model";
import { PayrollReport } from "./payroll-report/payroll-report.model";

mongoose.Promise = global.Promise;

interface IDb {
  mongoose: Mongoose;
  User: typeof User;
  Pro: typeof Pro;
  Vendor: typeof Vendor;
  Workorder: typeof Workorder;
  Estimate: typeof Estimate;
  AccountSetting: typeof AccountSetting;
  Invoice: typeof Invoice;
  Permission: typeof Permission;
  PriceList: typeof PriceList;
  Pricebook: typeof Pricebook;
  ProCustomer: typeof ProCustomer;
  Promo: typeof Promo;
  Role: typeof Role;
  Staff: typeof Staff;
  TruckOrder: typeof TruckOrder;
  Transaction: typeof Transaction;
  PurchaseOrder: typeof PurchaseOrder;
  PayrollReport: typeof PayrollReport;
  Notification: typeof Notification;
}

const db: IDb = {
  mongoose,
  User,
  Pro,
  Vendor,
  Workorder,
  Estimate,
  AccountSetting,
  Invoice,
  Permission,
  PriceList,
  Pricebook,
  ProCustomer,
  Promo,
  Role,
  Staff,
  TruckOrder,
  Transaction,
  PurchaseOrder,
  PayrollReport,
  Notification,
};

export default db;
