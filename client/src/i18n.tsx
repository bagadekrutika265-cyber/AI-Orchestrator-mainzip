import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import mr from './locales/mr/translation.json';
import es from './locales/es/translation.json';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'es';
export const LANGUAGE_OPTIONS: Array<{ code: LanguageCode; label: string; flag: string }> = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

const translations = { en, hi, mr, es };
type TranslationTree = typeof en;
type I18nContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const lookup = (source: unknown, key: string) =>
  key.split('.').reduce<unknown>((value, part) => (value && typeof value === 'object' ? (value as Record<string, unknown>)[part] : undefined), source);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const stored = localStorage.getItem('ao_language');
    return stored === 'hi' || stored === 'mr' || stored === 'es' ? stored : 'en';
  });

  const setLanguage = (nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
    localStorage.setItem('ao_language', nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nContextValue>(() => ({
    language,
    setLanguage,
    t: (key, variables) => {
      const selected = lookup(translations[language] as TranslationTree, key);
      const fallback = lookup(en, key);
      let result = typeof selected === 'string' ? selected : typeof fallback === 'string' ? fallback : key;
      if (typeof selected !== 'string' && typeof window !== 'undefined' && window.location.hostname === 'localhost') console.debug(`[i18n] Missing ${language}:${key}; using English fallback`);
      Object.entries(variables || {}).forEach(([name, variable]) => {
        result = result.split(`{{${name}}}`).join(String(variable));
      });
      return result;
    },
  }), [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
};