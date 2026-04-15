import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// English Fallback Dictionary
const en = {
  translation: {
    welcome: 'Welcome to CropWatch',
    scan_leaf: 'Identify Issue',
    history: 'History',
    prevention: 'Prevention Tips',
    language_toggle: 'Switch to Pidgin',
    select_crop: 'Select Crop Type',
    describe_symptom: 'Describe what you see (e.g., leaves are turning yellow)',
    camera_permission: 'CropWatch needs camera access to scan leaves.',
  },
};

// Nigerian Pidgin Dictionary (To be expanded)
const pidgin = {
  translation: {
    welcome: 'Welcome to CropWatch',
    scan_leaf: 'Check Wetin Dey Happen',
    history: 'Wetin Don Happen Before',
    prevention: 'How To Stop Am',
    language_toggle: 'Switch to English',
    select_crop: 'Choose The Crop',
    describe_symptom: 'Make you describe wetin you dey see (e.g., the leaf dey turn yellow)',
    camera_permission: 'CropWatch need your camera make e help you check the leaf.',
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      pidgin,
    },
    lng: Localization.getLocales()[0]?.languageCode === 'en' ? 'en' : 'pidgin', // default logic
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
