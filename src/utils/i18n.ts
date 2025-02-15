import i18next from "i18next";
const i18nextMiddleware = require("i18next-express-middleware");
import Backend from "i18next-http-backend";
import path from "path";

// إعدادات i18next
i18next
  .use(Backend) // لتحميل ملفات الترجمة من ملفات خارجية
  .use(i18nextMiddleware) // استخدام Middleware
  .init({
    fallbackLng: "en", // اللغة الافتراضية
    lng: "en", // اللغة الابتدائية
    preload: ["en", "ar"], // تحميل اللغات المدعومة
    resources: {
      en: {
        translation: {
          hello: "Hello",
          welcome: "Welcome to our application",
        },
      },
      ar: {
        translation: {
          hello: "مرحبًا",
          welcome: "مرحبًا بكم في تطبيقنا",
        },
      },
    },
    debug: true, // تفعيل تصحيح الأخطاء
    saveMissing: true, // حفظ الترجمات المفقودة
  });

export default i18next;
