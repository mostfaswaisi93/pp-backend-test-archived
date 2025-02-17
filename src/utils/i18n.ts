import i18next from "i18next";
const i18nextMiddleware = require("i18next-express-middleware");
import Backend from "i18next-http-backend";

i18next
  .use(Backend)
  .use(i18nextMiddleware)
  .init({
    fallbackLng: "en",
    lng: "en",
    preload: ["en", "ar"],
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
    debug: true,
    saveMissing: true,
  });

export default i18next;
