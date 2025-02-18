import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { json, urlencoded } from "express";
import { authRoutes } from "./routes/auth/auth.routes";
import { userRoutes } from "./routes/users/users.routes";
import { errorHandler } from "./middlewares/exception.middleware";
import i18next from "./config/i18n";
import i18nextMiddleware from "i18next-express-middleware";
import "./config/redis-config"; // Redis
import "./config/i18n"; // i18n

const app = express();

// i18next Middleware
app.use(i18nextMiddleware.handle(i18next));

// Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
