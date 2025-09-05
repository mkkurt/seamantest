import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'topBarTitle': 'Seaman\'s Test',
      'categories': 'Categories',
      'settings': 'Settings',
      'language': 'Language',
      'appearance': 'Appearance',
      'light': 'Light',
      'dark': 'Dark',
      'system': 'System'
    }
  },
  tr: {
    translation: {
      'topBarTitle': 'Gemiadamısoruları',
      'categories': 'Kategoriler',
      'settings': 'Ayarlar',
      'language': 'Dil',
      'appearance': 'Görünüm',
      'light': 'Açık',
      'dark': 'Koyu',
      'system': 'Sistem'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;