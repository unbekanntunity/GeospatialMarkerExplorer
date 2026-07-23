import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import de from "./locales/de/translation.json";
import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";

i18n.use(initReactI18next).init({
  fallbackLng: "en",

  resources: {
    en: {
      translation: en
    },
    de: {
      translation: de
    },
    es: {
      translation: es
    }
  },

  interpolation: {
    escapeValue: false
  }
});

export default i18n;
