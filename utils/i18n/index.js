"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "../locales/en/en.json";
import br from "../locales/br/br.json";

if (!i18n.isInitialized && typeof window !== "undefined") {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        br: { translation: br },
      },
      fallbackLng: "en",
      detection: {
        order: ["localStorage", "cookie", "navigator"],
        caches: ["localStorage", "cookie"],
      },
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
