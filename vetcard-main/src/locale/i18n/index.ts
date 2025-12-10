import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ru from './ru.json';
import kg from './kg.json';

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    kg: { translation: kg },
  },
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

export const changeLanguage = (language: 'ru' | 'kg') => {
  i18n.changeLanguage(language);
  localStorage.setItem('language', language);
};

export const getCurrentLanguage = () => {
  return i18n.language;
};

const savedLanguage = localStorage.getItem('language') as 'ru' | 'kg';
if (savedLanguage && (savedLanguage === 'ru' || savedLanguage === 'kg')) {
  i18n.changeLanguage(savedLanguage);
}

export default i18n;
