import connectToDatabase from "../config/database";
import { runProSeeder } from "./pro-seeder";
import { runRolePermissionSeeder } from "./role-permission-seeder";
import { Logger } from "../commons/libs/logger";

const logger = Logger.Instance;

const seedDatabase = async () => {
  try {
    await connectToDatabase();
    console.log("🔄 Running role permission seeder...");

    await runRolePermissionSeeder();
    // await runProSeeder();

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
