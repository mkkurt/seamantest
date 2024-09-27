import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import tr from "./locales/tr.json";
import en from "./locales/en.json";

if (!localStorage.getItem("i18nextLng")) {
  localStorage.setItem("i18nextLng", "tr");
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "tr", // Fallback language if the detected language is not supported
    supportedLngs: ["tr", "en"], // The languages your app supports
    detection: {
      // Priority order of where to detect language
      order: [
        "localStorage",
        "sessionStorage",
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],

      // Cache the user's language in these places
      caches: ["localStorage"],

      // Use the custom localStorage key (if needed)
      lookupLocalStorage: "i18nextLng", // Key to check language in localStorage
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    resources: {
      tr: {
        translation: tr,
      },
      en: {
        translation: en,
      },
    },
  });

export default i18n;
