import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import pcm from './locales/pcm.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pcm: { translation: pcm },
    },
    lng: 'en', // Default to English, AuthContext will load saved preference
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
