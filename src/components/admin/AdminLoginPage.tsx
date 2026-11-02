import React, { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff, AlertCircle, ArrowLeft, Sun, Moon, Sparkles, CheckCircle2 } from 'lucide-react';

export interface AdminLoginPageProps {
  onSuccess: () => void;
  onClose: () => void;
  lang?: 'id' | 'en';
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark', e?: any) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onSuccess,
  onClose,
  lang = 'id',
  theme,
  setTheme
}) => {
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

    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        try {
          sessionStorage.setItem('admin_session_auth', 'true');
        } catch {
          // ignore
        }
        onSuccess();
      } else {
        setError(
          lang === 'id' 
            ? 'Kredensial tidak valid. Silakan coba lagi.' 
            : 'Invalid credentials. Please try again.'
        );
        setIsSubmitting(false);
      }
    }, 400);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-800'
    }`}>
      {/* Dynamic Background Grid Pattern */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${
        isDark 
          ? 'bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]' 
          : 'bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)]'
      }`} style={{ backgroundSize: '24px 24px' }} />

      {/* Floating Theme & Back Quick Bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <button
          onClick={onClose}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-200 border cursor-pointer ${
            isDark 
              ? 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' 
              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'id' ? 'KEMBALI' : 'BACK'}</span>
        </button>

        <button
          onClick={(e) => setTheme(isDark ? 'light' : 'dark', e)}
          className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
            isDark 
              ? 'bg-slate-900/80 border-slate-800 text-amber-400 hover:bg-slate-800' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-xs'
          }`}
          title={isDark ? 'Mode Terang' : 'Mode Gelap'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Login Card */}
      <div className={`w-full max-w-md p-8 sm:p-10 rounded-3xl border shadow-2xl relative z-10 backdrop-blur-xl transition-all duration-300 ${
        isDark 
          ? 'bg-slate-900/90 border-slate-800 shadow-slate-950/60' 
          : 'bg-white/95 border-slate-200 shadow-slate-200/50'
      }`}>
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4 border border-emerald-500/20 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight font-sans">
            {lang === 'id' ? 'Autentikasi Administrator' : 'Administrator Access'}
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            {lang === 'id' 
              ? 'Masukkan kredensial otorisasi untuk mengakses CMS Visual Editor.' 
              : 'Provide authorization credentials to access the Visual Studio CMS.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none ${
                isDark 
                  ? 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500/60 focus:bg-white focus:ring-1 focus:ring-emerald-500/30'
              }`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none pr-10 ${
                  isDark 
                    ? 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500/60 focus:bg-white focus:ring-1 focus:ring-emerald-500/30'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-6 ${
              isSubmitting 
                ? 'opacity-70 cursor-not-allowed bg-emerald-600 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white shadow-emerald-950/30'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span>Masuk ke Editor</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/40 text-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px] font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kredensial Default: admin / admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

