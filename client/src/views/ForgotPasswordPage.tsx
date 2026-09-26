import React, { useState } from 'react';
import { ArrowLeft, KeyRound, MailCheck } from 'lucide-react';
import { useI18n } from '../i18n';
import { LanguageSelector } from '../components/LanguageSelector';

export const ForgotPasswordPage: React.FC<{
  onSubmit: (username: string) => Promise<{ message?: string; resetToken?: string }>;
  onBack: () => void;
  error?: string;
}> = ({ onSubmit, onBack, error }) => {
  const { t } = useI18n();
  const [username, setUsername] = useState('');
  const [result, setResult] = useState<{ message?: string; resetToken?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try { setResult(await onSubmit(username)); } finally { setBusy(false); }
  };
  return (
    <div className="min-h-screen bg-dark-base px-4 py-6 text-gray-100">
      <div className="mx-auto flex max-w-6xl justify-between"><button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> {t('common.backHome')}</button><LanguageSelector /></div>
      <main className="mx-auto flex min-h-[calc(100vh-100px)] max-w-md items-center">
        <section className="w-full rounded-3xl border border-dark-border bg-dark-card p-8 shadow-2xl">
          <KeyRound className="h-9 w-9 text-brand-300" />
          <h1 className="mt-5 text-3xl font-extrabold text-white">{t('auth.forgotTitle')}</h1>
          <p className="mt-2 text-sm leading-6 text-gray-400">{t('auth.forgotDescription')}</p>
          {error && <p className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
          {result ? (
            <div className="mt-6 space-y-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              <div className="flex gap-2"><MailCheck className="h-5 w-5 shrink-0" /> <span>{result.message || t('auth.resetSent')}</span></div>
              {result.resetToken && (
                <>
                  <p className="break-all rounded-lg bg-black/20 p-3 font-mono text-xs text-emerald-100">{result.resetToken}</p>
                  <button onClick={() => { window.history.pushState({}, '', `/reset-password?token=${result.resetToken}`); window.dispatchEvent(new PopStateEvent('popstate')); }} className="font-semibold text-white underline">Open reset password</button>
                </>
              )}
              <button onClick={onBack} className="font-semibold text-white underline">{t('auth.signIn')}</button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <input required value={username} onChange={(event) => setUsername(event.target.value)} placeholder={t('auth.username')} className="w-full rounded-xl border border-dark-border bg-dark-base px-4 py-3 text-sm text-white outline-none focus:border-brand-400" />
              <button disabled={busy} className="w-full rounded-xl bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-500 disabled:opacity-60">{busy ? t('common.loading') : t('auth.sendReset')}</button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};