import dotenv from "dotenv";
import { PriceList } from "../models/price-list/price-list.model";

dotenv.config();

export const runPriceListSeeder = async () => {
  const priceListData = [
    {
      type: "monthly",
      name: "Basic Plan",
      package_desc: "Basic package for small businesses",
      price_desc: "Monthly payment",
      package_price: 29.99,
      price_per: "month",
      package_features: {
        users: 1,
        storage: "10GB",
        support: "email",
      },
    },
    {
      type: "yearly",
      name: "Pro Plan",
      package_desc: "Pro package for growing businesses",
      price_desc: "Annual payment",
      package_price: 299.99,
      price_per: "year",
      package_features: {
        users: 5,
        storage: "100GB",
        support: "priority email",
      },
    },
  ];

  try {
    await PriceList.insertMany(priceListData);
    console.log("Price list seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting price list seed data:", error);
  }
};
