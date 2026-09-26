import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck, Sparkles, UserRound, UsersRound } from 'lucide-react';
import { UserRole } from '../types';
import { useI18n } from '../i18n';
import { LanguageSelector } from '../components/LanguageSelector';

interface LoginPageProps {
  onLogin: (username: string, password: string, role: UserRole, rememberMe: boolean) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  onForgotPassword: () => void;
  onBackHome: () => void;
  error?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onGoogleLogin,
  onForgotPassword,
  onBackHome,
  error,
}) => {
  const { t } = useI18n();
  const [role, setRole] = useState<UserRole>('EMPLOYEE');
  const [username, setUsername] = useState('david.m@acme.com');
  const [password, setPassword] = useState('Demo@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles: Array<{ value: UserRole; icon: React.ReactNode; label: string }> = [
    { value: 'EMPLOYEE', icon: <UserRound className="h-4 w-4" />, label: t('auth.employee') },
    { value: 'MANAGER', icon: <UsersRound className="h-4 w-4" />, label: t('auth.manager') },
    { value: 'ADMIN', icon: <ShieldCheck className="h-4 w-4" />, label: t('auth.admin') },
  ];

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onLogin(username, password, role, rememberMe);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-base px-4 py-6 text-gray-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <button onClick={onBackHome} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> {t('common.backHome')}
        </button>
        <LanguageSelector />
      </div>

      <main className="mx-auto grid min-h-[calc(100vh-100px)] max-w-6xl items-center gap-10 py-10 lg:grid-cols-[1fr_440px]">
        <section className="relative hidden overflow-hidden rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-950/60 via-dark-card to-purple-950/30 p-10 shadow-2xl lg:block">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="relative space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-lg shadow-brand-500/30">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-extrabold tracking-tight text-white">AI ORCHESTRATOR</p>
                <p className="text-xs text-brand-200">From Business Request to Intelligent Action</p>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-300">Protected workspace</p>
              <h1 className="max-w-lg text-4xl font-extrabold leading-tight text-white">
                {t('auth.secureAccess')}
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-gray-300">
                One shared orchestration engine connects requests, approvals, policies, and adaptive execution across your business.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[t('auth.secure'), t('auth.roleBased'), t('auth.protected')].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs font-semibold text-gray-200">
                  <LockKeyhole className="mb-3 h-4 w-4 text-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-dark-border bg-dark-card/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-300">AI ORCHESTRATOR</p>
            <h2 className="mt-2 text-3xl font-extrabold text-white">{t('auth.welcome')}</h2>
            <p className="mt-2 text-sm text-gray-400">{t('auth.secureAccess')}</p>
          </div>

          {error && <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div>}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">{t('auth.role')}</p>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => setRole(item.value)}
                    className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-[11px] font-bold transition ${
                      role === item.value ? 'border-brand-400 bg-brand-500/20 text-white shadow-lg shadow-brand-500/10' : 'border-dark-border bg-dark-base text-gray-400 hover:border-brand-500/50'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-gray-300">{t('auth.username')}</span>
              <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required className="w-full rounded-xl border border-dark-border bg-dark-base px-4 py-3 text-sm text-white outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-gray-300">{t('auth.password')}</span>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required className="w-full rounded-xl border border-dark-border bg-dark-base px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
                <button type="button" aria-label={showPassword ? t('auth.hide') : t('auth.show')} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            <div className="flex items-center justify-between gap-3 text-xs">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="accent-brand-500" />
                {t('auth.remember')}
              </label>
              <button type="button" onClick={onForgotPassword} className="font-semibold text-brand-300 hover:text-brand-200">{t('auth.forgot')}</button>
            </div>
            <button disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-600/20 transition hover:from-brand-500 hover:to-indigo-500 disabled:cursor-wait disabled:opacity-60">
              <LockKeyhole className="h-4 w-4" />
              {isSubmitting ? t('common.loading') : t('auth.signIn')}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-gray-500">
            <span className="h-px flex-1 bg-dark-border" /> {t('common.language')} <span className="h-px flex-1 bg-dark-border" />
          </div>
          <button onClick={onGoogleLogin} className="w-full rounded-xl border border-dark-border bg-dark-base px-4 py-3 text-sm font-semibold text-gray-200 transition hover:border-brand-400 hover:text-white">{t('auth.demoGoogle')}</button>
          <p className="mt-4 text-center text-[11px] text-gray-500">{t('auth.demoCredentials')}</p>
        </section>
      </main>
    </div>
  );
};