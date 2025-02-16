import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { json, urlencoded } from "express";
import { authRoutes } from "./routes/auth/auth.routes";
import { userRoutes } from "./routes/users/users.routes";
import { errorHandler } from "./middleware/exception.middleware";
import i18next from "./config/i18n"; // تأكد من أنه يتم استيراده بشكل صحيح
import i18nextMiddleware from "i18next-express-middleware";

// import i18n from "i18next";
// import Backend from "i18next-fs-backend";
// import { join } from "path";

const app = express();

// تفعيل الترجمات
app.use(i18nextMiddleware.handle(i18next));

// إعداد الـ Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));

// تعريف المسارات
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// معالج الأخطاء العام
app.use(errorHandler);

export default app;

// i18n.use(Backend).init({
//   lng: "en",
//   fallbackLng: "en",
//   backend: {
//     loadPath: join(__dirname, "locales/{{lng}}.json"),
//   },
// });

// export default i18n;
