import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import translationEN from './locales/en/translation.json'
import translationKK from './locales/kk/translation.json'

const resources = {
  en: {
    translation: translationEN,
  },
  kk: {
    translation: translationKK,
  },
}

i18n
  .use(LanguageDetector) // Браузер тілін анықтау
  .use(initReactI18next) // react-i18next-ті іске қосу
  .init({
    resources,
    fallbackLng: 'kk', // Әдепкі тіл қазақша
    debug: false, // Даму кезінде true қоюға болады

    interpolation: {
      escapeValue: false, // react компоненттері XSS шабуылынан қорғайды
    },
    detection: {
      order: [
        'queryString',
        'cookie',
        'localStorage',
        'sessionStorage',
        'navigator',
        'htmlTag',
      ],
      caches: ['localStorage', 'cookie'],
    },
  })

export default i18n
