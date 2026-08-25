import React, { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff, AlertCircle, ArrowLeft, Sun, Moon, Sparkles, CheckCircle2 } from 'lucide-react';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onClose: () => void;
  lang?: 'id' | 'en';
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark', e?: any) => void;
}

export default function AdminLoginPage({
  onSuccess,
  onClose,
  lang = 'id',
  theme,
  setTheme
}: AdminLoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDark = theme === 'dark';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const validUsername = (import.meta.env.VITE_ADMIN_USERNAME || 'admin').trim();
    const validPassword = (import.meta.env.VITE_ADMIN_PASSWORD || 'admin123').trim();

    setTimeout(() => {
      if (username.trim() === validUsername && password.trim() === validPassword) {
        try {
          sessionStorage.setItem('admin_session_auth', 'true');
        } catch (_) {}
        setIsSubmitting(false);
        onSuccess();
      } else {
        setIsSubmitting(false);
        setError(
          lang === 'id' 
            ? 'Username atau Password salah. Silakan periksa kembali.'
            : 'Incorrect username or password. Please try again.'
        );
      }
    }, 250);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-250 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Top Bar Navigation */}
      <header className={`px-4 sm:px-6 py-4 border-b flex items-center justify-between transition-colors ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200 shadow-xs'
      } backdrop-blur-md sticky top-0 z-20`}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer select-none active:scale-97 ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700 hover:text-white' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'id' ? 'Kembali ke Website' : 'Back to Website'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={(e) => setTheme(isDark ? 'light' : 'dark', e)}
            title={isDark ? "Mode Terang" : "Mode Gelap"}
            className={`p-2 rounded-lg border transition-all cursor-pointer select-none ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-750' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 shadow-xs'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Login Gate Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className={`w-full max-w-md rounded-2xl p-6 sm:p-8 border shadow-xl transition-all ${
          isDark 
            ? 'bg-slate-900/90 border-slate-800 shadow-slate-950/60' 
            : 'bg-white border-slate-200/90 shadow-slate-200/50'
        }`}>
          {/* Icon and Header */}
          <div className="text-center mb-6 select-none">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border transition-all ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-emerald-400' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-600'
            }`}>
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            
            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {lang === 'id' ? 'Login Administrator' : 'Administrator Login'}
            </h1>
            
            <p className={`text-xs mt-2 leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {lang === 'id' 
                ? 'Masuk untuk mengakses mode pratinjau & mengedit konten secara visual melalui tombol pensil.'
                : 'Sign in to access preview mode and edit website content visually using the pencil editor.'}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`block text-[11px] font-mono font-bold uppercase mb-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Username
              </label>
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border outline-none transition-all ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[11px] font-mono font-bold uppercase mb-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 pr-10 rounded-xl text-xs font-medium border outline-none transition-all ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-200 cursor-pointer`}
                  title={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 font-medium flex items-start gap-2 bg-red-950/30 p-3 border border-red-500/20 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-emerald-950/20 active:scale-98"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmitting ? (lang === 'id' ? 'Memverifikasi...' : 'Verifying...') : (lang === 'id' ? 'Masuk ke Mode Edit (/prev)' : 'Enter Edit Mode (/prev)')}</span>
            </button>
          </form>

          {/* Informational feature card */}
          <div className={`mt-6 pt-5 border-t text-center select-none ${
            isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-emerald-500 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'id' ? 'Visual Quick Editor' : 'Visual Quick Editor'}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {lang === 'id' 
                ? 'Setelah masuk, edit semua teks, foto, dan warna langsung di halaman /prev melalui tombol pensil melayang.' 
                : 'Once logged in, customize all text, photos, and colors directly in /prev via the floating pencil button.'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
