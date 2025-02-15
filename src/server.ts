import express from "express";
import { json, urlencoded } from "express";
import { connectDB } from "./config/database";
import { authRoutes } from "./routes/auth/auth.routes";
import { userRoutes } from "./routes/users/users.routes";
import { errorHandler } from "./middlewares/exception.middleware";

const app = express();

// Middlewares
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Global error handler
app.use(errorHandler);

// Connect to the database and start the server
const PORT = process.env.PORT || 8000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
