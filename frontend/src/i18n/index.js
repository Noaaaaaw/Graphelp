import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import id from "./id.json";
import en from "./en.json";

i18n.use(initReactI18next).init({
  resources: { id: { translation: id }, en: { translation: en } },
  lng: localStorage.getItem("lang") || "id",
  fallbackLng: "id",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
  document.documentElement.lang = lng;
});

export default i18n;