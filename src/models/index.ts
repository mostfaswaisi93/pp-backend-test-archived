import Pro from "./pro/pro.model";
import User from "./user/user.model";
import { Role } from "./role/role.model";
import { Year } from "./year/year.model";
import { Promo } from "./promo/promo.model";
import { Staff } from "./staff/staff.model";
import { State } from "./state/state.model";
import mongoose, { Mongoose } from "mongoose";
import { Vendor } from "./vendor/vendor.model";
import { Invoice } from "./invoice/invoice.model";
import { Zipcode } from "./zipcode/zipcode.model";
import { Estimate } from "./estimate/estimate.model";
import { Category } from "./category/category.model";
import { Workorder } from "./workorder/workorder.model";
import { Pricebook } from "./pricebook/pricebook.model";
import { Inventory } from "./inventory/inventory.model";
import TruckOrder from "./truck-order/truck-order.model";
import { PriceList } from "./price-list/price-list.model";
import Transaction from "./transaction/transaction.model";
import { Permission } from "./permission/permission.model";
import ProCustomer from "./pro-customer/pro-customer.model";
import { SubCategory } from "./sub-category/subcategory.model";
import { BusinessHour } from "./business-hour/business-hour.model";
import { PurchaseOrder } from "./purchase-order/purchase-order.model";
import { PayrollReport } from "./payroll-report/payroll-report.model";
import { AccountSetting } from "./account-setting/account-setting.model";
import { AccountHistory } from "./account-history/account-history.model";
import { AutoIncrementor } from "./auto-incrementor/auto-incrementor.model";

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
  Category: typeof Category;
  SubCategory: typeof SubCategory;
  Zipcode: typeof Zipcode;
  BusinessHour: typeof BusinessHour;
  Year: typeof Year;
  State: typeof State;
  Staff: typeof Staff;
  TruckOrder: typeof TruckOrder;
  Transaction: typeof Transaction;
  PurchaseOrder: typeof PurchaseOrder;
  PayrollReport: typeof PayrollReport;
  Notification: typeof Notification;
  AutoIncrementor: typeof AutoIncrementor;
  Inventory: typeof Inventory;
  AccountHistory: typeof AccountHistory;
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
  Category,
  SubCategory,
  Zipcode,
  BusinessHour,
  Year,
  State,
  Staff,
  TruckOrder,
  Transaction,
  PurchaseOrder,
  PayrollReport,
  Notification,
  AutoIncrementor,
  Inventory,
  AccountHistory,
};

export default db;
