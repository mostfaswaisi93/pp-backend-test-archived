import i18n from "i18next";
import Backend from "i18next-fs-backend";
import { join } from "path";

i18n.use(Backend).init({
  lng: "en",
  fallbackLng: "en",
  backend: {
    loadPath: join(__dirname, "locales/{{lng}}.json"),
  },
});

export default i18n;
