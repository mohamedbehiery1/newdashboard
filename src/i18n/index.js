import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationsEN from "./en/en.json";
import mainAr from "./ar/main.json";
import errorAr from "./ar/error.json";
import datagridAr from "./ar/datagrid.json";
// import { $__DEV__ } from "src/constants";

const resources = {
  "en-US": {
    main: translationsEN,
  },
  "ar-SA": {
    main: mainAr,
    Error: errorAr,
    datagrid: datagridAr
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    // ns: ['main', 'error'],
    defaultNS: 'main',
    fallbackLng: "en-US",
    // keySeparator: false,
    debug: false, //$__DEV__,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
