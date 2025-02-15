import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import redis from "./config/redis";
import serviceRoutes from "./routes/service.routes";

dotenv.config();

const app = express();

// 🔹 إعدادات الأمان والـ CORS
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// 🔹 تحميل المسارات
app.use("/api/services", serviceRoutes);

// 🔹 تشغيل MongoDB
connectDB();

export default app;
