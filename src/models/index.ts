import mongoose, { Mongoose } from "mongoose";

// Data types for the imported models
interface IDb {
  mongoose: Mongoose;
  [key: string]: any; // This allows adding other models later
}

// Database initialization
const db: IDb = {
  mongoose,
};

// Importing models
db.login = require("./auth.model")(mongoose);
db.pro = require("./pro.model")(mongoose);
db.pro_customers = require("./pro_customers.model")(mongoose);
db.inventory_log = require("./inventory_logs.model")(mongoose);
db.billing = require("./billing.model")(mongoose);
db.inventory = require("./inventory.model")(mongoose);
db.inventory_locations = require("./inventory_locations.model")(mongoose);
db.prolocation = require("./location.model")(mongoose);
db.accountsetting = require("./accountSetting.model")(mongoose);
db.vendor = require("./vendor.model")(mongoose);
db.staff = require("./staff.model")(mongoose);
db.lead = require("./lead.model")(mongoose);
db.workorder = require("./workorder.model")(mongoose);
db.customer = require("./customer.model")(mongoose);
db.customerAddresses = require("./customer_addresses.model")(mongoose);
db.matchingpros = require("./matching.pros.model")(mongoose);
db.scorecard = require("./scorecard.model")(mongoose);
db.probooking = require("./proBooking.model")(mongoose);
db.estimate = require("./estimate.model")(mongoose);
db.estimatepreinspection = require("./estimatepreinspection.model")(mongoose);
db.estimatepostinspection = require("./estimatepostinspection.model")(mongoose);
db.pricebook = require("./pricebook.model")(mongoose);
db.price_list = require("./price_list.model")(mongoose);
db.globalsettings = require("./globalSettings.model")(mongoose);
db.promotions = require("./promotions.model")(mongoose);
db.numverify_request = require("./numverify_requests.model")(mongoose);
db.workorderstatus_history = require("./workorderstatus_history.model")(
  mongoose
);
db.csr_log = require("./csr_logs.model")(mongoose);
db.shop_settings = require("./shop_settings.model")(mongoose);
db.reportPro = require("./reportPro.model")(mongoose);
db.truck_orders = require("./truckOrder.model")(mongoose);
db.truckorder_logs = require("./truckorder_logs.model")(mongoose);
db.promotion_logs = require("./promotion_logs.model")(mongoose);
db.purchaseOrders = require("./purchase_orders.model")(mongoose);
db.po_history = require("./po_history.model")(mongoose);
db.staff_history = require("./staff-history.model")(mongoose);
db.tsl_history = require("./tsl_history.model")(mongoose);
db.tsl_ordered_details = require("./tsl_order_details.model")(mongoose);
db.tsl_received_details = require("./tsl_recieved_details")(mongoose);
db.tsl_Return_item_details = require("./tsl_return.model")(mongoose);
db.po_ordered_details = require("./po_order_details.model")(mongoose);
db.po_order_received_details = require("./po_order_received_deatails.model")(
  mongoose
);
db.Po_Return_item_details = require("./po_order_return.model")(mongoose);
db.direct_booking_leads = require("./direct_booking_lead.model")(mongoose);
db.csr = require("./customer_mobile/csr.model")(mongoose);
db.staff_customers = require("./staff_customers.model")(mongoose);
db.estimate_payments = require("./estimate-payment.model")(mongoose);
db.estimate_refund_request = require("./estimate_refundpayments.model")(
  mongoose
);
db.authorize_net_Payment = require("./authorize-net-payment.model")(mongoose);
db.authorize_net_refund_Payment =
  require("./authorize-net-refund-payment.model")(mongoose);
db.promo_email_logs = require("./promo_email_logs.model")(mongoose);
db.promoShareStats = require("./promo-share-stats.model")(mongoose);
db.promoViewStats = require("./share-promo-views.model")(mongoose);
db.test_sms_logs = require("./testing_sms_logs.model")(mongoose);
db.estimate_refundpayments = require("./estimate_refund_payments.model")(
  mongoose
);
db.PO_Logs = require("./po_logs.model")(mongoose);
db.accountHistory = require("./accountHistory")(mongoose);
db.rating = require("./rating.model")(mongoose);
db.geolocation = require("./geolocation.model.js")(mongoose);

// Stripe Collections
const { stripePurchaseLog } = require("./stripe.model")(mongoose);
db.stripepurchaselog = stripePurchaseLog;

// Refund request Collections
const { leadRefundRequest } = require("./lead_refund_request.model")(mongoose);
db.leadRefundRequest = leadRefundRequest;

// Twilio Collections
const { twilioSMSLogsCollectionMP, twilioCallLogsCollectionMP } =
  require("./twilio.model")(mongoose);
db.twiliosmslogsmp = twilioSMSLogsCollectionMP;
db.twiliocalllogsmp = twilioCallLogsCollectionMP;

// Questions Collections
const {
  categoryQuestionsCollection,
  standardQuestionsCollection,
  categoryQuestionOptionsCollection,
  standardQuestionOptionsCollection,
} = require("./questions.model")(mongoose);

db.categoryquestions = categoryQuestionsCollection;
db.standardquestions = standardQuestionsCollection;
db.categoryoptions = categoryQuestionOptionsCollection;
db.standardoptions = standardQuestionOptionsCollection;

// Master Collections
const {
  zipcodesMasterCollection,
  yearMasterCollection,
  statesMasterCollection,
  businessHoursMasterCollection,
  rolesMasterCollection,
  newRolesMasterCollection,
  proRolesMasterCollection,
  proRolesAccountSettingCollection,
  rbacModulesMasterCollection,
  autoIncrementorMasterCollection,
  categoriesMasterCollection,
  subCategoriesMasterCollection,
} = require("./master.model")(mongoose);

db.zipcodes = zipcodesMasterCollection;
db.proRoles = proRolesMasterCollection;
db.proaccountsettingDB = proRolesAccountSettingCollection;
db.years = yearMasterCollection;
db.states = statesMasterCollection;
db.businessHours = businessHoursMasterCollection;
db.roles = rolesMasterCollection;
db.newRoles = newRolesMasterCollection;
db.rbacModules = rbacModulesMasterCollection;
db.autoIncrementor = autoIncrementorMasterCollection;
db.categoriesMaster = categoriesMasterCollection;
db.subCategoriesMaster = subCategoriesMasterCollection;

db.staffClockTiming = require("./vanlynk-app-alp/staff-clock-alp.model")(
  mongoose
);
db.dispatchboardstat =
  require("./vanlynk-app-alp/dispatchboard-stats-alp.model")(mongoose);
db.notifications = require("./notifications-alp.model")(mongoose);
db.staffLocationLog = require("./vanlynk-app-alp/staff-location-log.model")(
  mongoose
);
db.staffMotoionLog = require("./vanlynk-app-alp/staff-motion-alp.model")(
  mongoose
);
db.staffTimeCard = require("./vanlynk-app-alp/staff-timecard-alp.model")(
  mongoose
);
db.staffDailyTimecard = require("./vanlynk-app-alp/timecardStats.model")(
  mongoose
);

// EQUIPMENT
db.equipment = require("./vanlynk-app-alp/equipment-alp.model")(mongoose);
db.bookEquipment = require("./vanlynk-app-alp/book-equipment-alp.model")(
  mongoose
);
db.notes = require("./vanlynk-app-alp/notes-alp.model")(mongoose);
db.equipmentReport = require("./vanlynk-app-alp/equipment-report.model")(
  mongoose
);
db.equipment_checkout_and_drop =
  require("./vanlynk-app-alp/equipment-checkout-drop.model")(mongoose);
db.equipmentHistory = require("./vanlynk-app-alp/equipment-history.model")(
  mongoose
);

db.log = require("./vanlynk-app-alp/log.model.js")(mongoose);

// INVOICE
db.invoice = require("./vanlynk-app-alp/invoice-alp.model")(mongoose);

// PAYMENTS
db.transactions = require("./transactions.model")(mongoose);

// Request Refund
db.refundRequests = require("./refundsRequests.model")(mongoose);

// Vanlynk IOS
db.staffnotes = require("./vanlynk-ios/staffnotes.model")(mongoose);

db.commissionReports = require("./commissions-report.model")(mongoose);
db.payrollReport = require("./payroll-report.model")(mongoose);

export default db;
