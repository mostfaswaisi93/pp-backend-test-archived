import dotenv from "dotenv";
import { AccountSetting } from "../models/account-setting/account-setting.model";

dotenv.config();

export const runAccountSettingSeeder = async () => {
  const accountSettingData = [
    {
      code: "EL0001",
      name: "Electronics",
      description: "All kinds of electronic devices",
      icon: "electronics-icon.png",
      image: "electronics-image.png",
      price: 100,
      createdBy: "SYSTEM ADMIN",
      status: "ACTIVE",
      isAdminOnly: false,
      isPopularAccountSetting: true,
    },
    {
      code: "CL0001",
      name: "Clothing",
      description: "Men and women clothing",
      icon: "clothing-icon.png",
      image: "clothing-image.png",
      price: 50,
      createdBy: "SYSTEM ADMIN",
      status: "ACTIVE",
      isAdminOnly: false,
      isPopularAccountSetting: true,
    },
  ];

  try {
    await AccountSetting.insertMany(accountSettingData);
    console.log("Account Setting seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting Account Setting seed data:", error);
  }
};
