//constants/i18n/index.ts

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en";
import si from "./si";
import ta from "./ta";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    si: { translation: si },
    ta: { translation: ta },
  },
  lng: "en",          // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
