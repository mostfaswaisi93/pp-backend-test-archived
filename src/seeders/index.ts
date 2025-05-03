import { runProSeeder } from "./pro-seeder";
import { runYearSeeder } from "./year-seeder";
import { runUserSeeder } from "./user-seeder";
import { Logger } from "../commons/libs/logger";
import { runStateSeeder } from "./state-seeder";
import { runPromoSeeder } from "./promo-seeder";
import { runStaffSeeder } from "./staff-seeder";
import { runRatingSeeder } from "./rating-seeder";
import { runVendorSeeder } from "./vendor-seeder";
import connectToDatabase from "../config/database";
import { runBillingSeeder } from "./billing-seeder";
import { runZipcodeSeeder } from "./zipcode-seeder";
import { runInvoiceSeeder } from "./invoice-seeder";
import { runEstimateSeeder } from "./estimate-seeder";
import { runCategorySeeder } from "./category-seeder";
import { runEquipmentSeeder } from "./equipment-seeder";
import { runWorkorderSeeder } from "./workorder-seeder";
import { runPricebookSeeder } from "./pricebook-seeder";
import { runInventorySeeder } from "./inventory-seeder";
import { runReportProSeeder } from "./report-pro-seeder";
import { runPriceListSeeder } from "./price-list-seeder";
import { runProBookingSeeder } from "./pro-booking-seeder";
import { runTruckOrderSeeder } from "./truck-order-seeder";
import { runTransactionSeeder } from "./transaction-seeder";
import { runProCustomerSeeder } from "./pro-customer-seeder";
import { runSubCategorySeeder } from "./sub-category-seeder";
import { runNotificationSeeder } from "./notification-seeder";
import { runBusinessHourSeeder } from "./business-hour-seeder";
import { runPayrollReportSeeder } from "./payroll-report-seeder";
import { runGlobalSettingSeeder } from "./global-setting-seeder";
import { runPurchaseOrderSeeder } from "./purchase-order-seeder";
import { runRolePermissionSeeder } from "./role-permission-seeder";
import { runAccountSettingSeeder } from "./account-setting-seeder";
import { runCategoryQuestionSeeder } from "./category-question-seeder";
import { runStandardQuestionSeeder } from "./standard-question-seeder";
import { runInventoryLocationSeeder } from "./inventory-location-seeder";
import { runCategoryQuestionOptionSeeder } from "./category-option-seeder";
import { runStandardQuestionOptionSeeder } from "./standard-option-seeder";

const logger = Logger.Instance;

const seedDatabase = async () => {
  try {
    await connectToDatabase();
    console.log("🔄 Running role permission seeder...");

    // await runProSeeder();
    // await runYearSeeder();
    // await runUserSeeder();
    // await runStateSeeder();
    // await runPromoSeeder();
    // await runStaffSeeder();
    // await runVendorSeeder();
    // await runRatingSeeder();
    // await runZipcodeSeeder();
    // await runInvoiceSeeder();
    // await runBillingSeeder();
    // await runCategorySeeder();
    // await runEstimateSeeder();
    // await runReportProSeeder();
    // await runInventorySeeder();
    // await runPricebookSeeder();
    // await runPriceListSeeder();
    // await runWorkorderSeeder();
    // await runEquipmentSeeder();
    // await runTruckOrderSeeder();
    // await runProBookingSeeder();
    // await runTransactionSeeder();
    // await runProCustomerSeeder();
    // await runSubCategorySeeder();
    // await runNotificationSeeder();
    // await runBusinessHourSeeder();
    // await runPayrollReportSeeder();
    // await runPurchaseOrderSeeder();
    // await runGlobalSettingSeeder();
    // await runRolePermissionSeeder();
    // await runAccountSettingSeeder();
    // await runStandardQuestionSeeder();
    // await runCategoryQuestionSeeder();
    // await runInventoryLocationSeeder();
    // await runStandardQuestionOptionSeeder();
    // await runCategoryQuestionOptionSeeder();
    
    console.log("✅ Seeding completed successfully!");
    logger.log().info("✅ Seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    logger.log().error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
