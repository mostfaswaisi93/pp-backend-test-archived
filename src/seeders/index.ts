import { runProSeeder } from "./pro-seeder";
import { runYearSeeder } from "./year-seeder";
import { Logger } from "../commons/libs/logger";
import { runStateSeeder } from "./state-seeder";
import connectToDatabase from "../config/database";
import { runZipcodeSeeder } from "./zipcode-seeder";
import { runCategorySeeder } from "./category-seeder";
import { runBusinessHourSeeder } from "./business-hour-seeder";
import { runRolePermissionSeeder } from "./role-permission-seeder";

const logger = Logger.Instance;

const seedDatabase = async () => {
  try {
    await connectToDatabase();
    console.log("🔄 Running role permission seeder...");

    // await runRolePermissionSeeder();
    // await runProSeeder();
    // await runYearSeeder();
    // await runStateSeeder();
    // await runZipcodeSeeder();
    // await runCategorySeeder();
    // await runBusinessHourSeeder();

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
