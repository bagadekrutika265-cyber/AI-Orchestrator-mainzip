import React from 'react';
import { Globe2 } from 'lucide-react';
import { LANGUAGE_OPTIONS, LanguageCode, useI18n } from '../i18n';

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage, t } = useI18n();
  return (
    <label className={`inline-flex items-center gap-2 rounded-xl border border-dark-border bg-dark-card/80 px-3 py-2 text-xs font-semibold text-gray-200 ${compact ? '' : 'shadow-lg'}`}>
      <Globe2 className="h-4 w-4 text-brand-300" />
      {!compact && <span className="hidden sm:inline">{t('common.language')}</span>}
      <select
        aria-label={t('common.language')}
        value={language}
        onChange={(event) => setLanguage(event.target.value as LanguageCode)}
        className="cursor-pointer bg-transparent text-gray-100 outline-none"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.code} value={option.code} className="bg-dark-card">
            {option.flag} {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};