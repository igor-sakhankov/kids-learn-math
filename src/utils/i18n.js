import { I18n } from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import es from '../locales/es.json';
import { LANGUAGES } from './constants';

// Create i18n instance
const i18n = new I18n({
  en,
  ru,
  es,
});

// Set default locale
i18n.defaultLocale = LANGUAGES.EN;
i18n.locale = LANGUAGES.EN;

// Enable fallbacks
i18n.enableFallback = true;

// Get device locale
export const getDeviceLocale = () => {
  const locales = RNLocalize.getLocales();
  if (locales && locales.length > 0) {
    const languageCode = locales[0].languageCode;
    // Map device locale to supported languages
    if (languageCode === 'ru') return LANGUAGES.RU;
    if (languageCode === 'es') return LANGUAGES.ES;
  }
  return LANGUAGES.EN;
};

// Set locale
export const setLocale = (locale) => {
  i18n.locale = locale;
};

// Get current locale
export const getCurrentLocale = () => {
  return i18n.locale;
};

// Translation function
export const t = (key, options = {}) => {
  return i18n.t(key, options);
};

export default i18n;

