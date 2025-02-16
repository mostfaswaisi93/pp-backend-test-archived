import express from "express";
import "./config/i18n";
import "./config/redis";
import { json, urlencoded } from "express";
import { authRoutes } from "./routes/auth/auth.routes";
import { userRoutes } from "./routes/users/users.routes";
import { errorHandler } from "./middleware/exception.middleware";

const app = express();

// Middlewares
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Global error handler
app.use(errorHandler);

export default app;
