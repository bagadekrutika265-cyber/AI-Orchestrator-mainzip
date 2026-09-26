import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { useI18n } from '../i18n';
import { LanguageSelector } from '../components/LanguageSelector';

export const ResetPasswordPage: React.FC<{
  onSubmit: (token: string, password: string, confirmPassword: string) => Promise<void>;
  onBack: () => void;
  error?: string;
}> = ({ onSubmit, onBack, error }) => {
  const { t } = useI18n();
  const [token, setToken] = useState(new URLSearchParams(window.location.search).get('token') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const strength = useMemo(() => password.length >= 12 ? 'Strong' : password.length >= 8 ? 'Good' : password.length ? 'Weak' : '—', [password]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try { await onSubmit(token, password, confirmPassword); setDone(true); } finally { setBusy(false); }
  };
  return (
    <div className="min-h-screen bg-dark-base px-4 py-6 text-gray-100">
      <div className="mx-auto flex max-w-6xl justify-between"><button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> {t('common.backHome')}</button><LanguageSelector /></div>
      <main className="mx-auto flex min-h-[calc(100vh-100px)] max-w-md items-center">
        <section className="w-full rounded-3xl border border-dark-border bg-dark-card p-8 shadow-2xl">
          <KeyRound className="h-9 w-9 text-brand-300" />
          <h1 className="mt-5 text-3xl font-extrabold text-white">{t('auth.resetTitle')}</h1>
          {error && <p className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
          {done ? <div className="mt-6 space-y-4 text-emerald-200"><CheckCircle2 className="h-8 w-8" /><p>{t('auth.passwordUpdated')}</p><button onClick={onBack} className="font-semibold text-white underline">{t('auth.signIn')}</button></div> : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <input required value={token} onChange={(event) => setToken(event.target.value)} placeholder={t('auth.resetToken')} className="w-full rounded-xl border border-dark-border bg-dark-base px-4 py-3 text-xs text-white outline-none focus:border-brand-400" />
              <input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t('auth.newPassword')} className="w-full rounded-xl border border-dark-border bg-dark-base px-4 py-3 text-sm text-white outline-none focus:border-brand-400" />
              <p className="text-xs text-gray-400">{t('auth.passwordStrength')}: <span className="font-semibold text-brand-300">{strength}</span></p>
              <input required minLength={8} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder={t('auth.confirmPassword')} className="w-full rounded-xl border border-dark-border bg-dark-base px-4 py-3 text-sm text-white outline-none focus:border-brand-400" />
              <button disabled={busy} className="w-full rounded-xl bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-500 disabled:opacity-60">{busy ? t('common.loading') : t('auth.resetPassword')}</button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};