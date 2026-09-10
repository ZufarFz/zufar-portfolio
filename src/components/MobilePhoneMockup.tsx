import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, 
  Monitor, 
  RotateCw, 
  RefreshCw, 
  ExternalLink, 
  Wifi, 
  Battery, 
  Signal,
  Check
} from 'lucide-react';
import { CVData } from '../types';

interface MobileDevicePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  os: 'ios' | 'android';
  notchType: 'island' | 'punchhole' | 'classic';
}

const DEVICE_PRESETS: MobileDevicePreset[] = [
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    width: 393,
    height: 852,
    os: 'ios',
    notchType: 'island'
  },
  {
    id: 'samsung-s24',
    name: 'Galaxy S24',
    width: 412,
    height: 915,
    os: 'android',
    notchType: 'punchhole'
  },
  {
    id: 'iphone-se',
    name: 'iPhone SE (Kecil)',
    width: 375,
    height: 667,
    os: 'ios',
    notchType: 'classic'
  }
];

interface MobilePhoneMockupProps {
  cvData: CVData;
  theme: 'light' | 'dark';
  lang: 'id' | 'en';
  onClose: () => void;
  onThemeChange?: (newTheme: 'light' | 'dark') => void;
  onLangChange?: (newLang: 'id' | 'en') => void;
}

export const MobilePhoneMockup: React.FC<MobilePhoneMockupProps> = ({
  cvData,
  theme,
  lang,
  onClose,
  onThemeChange,
  onLangChange
}) => {
  const [selectedDevice, setSelectedDevice] = useState<MobileDevicePreset>(DEVICE_PRESETS[0]);
  const [scale, setScale] = useState<number>(0.85);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('09:41');
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Update clock every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Send latest state to iframe whenever cvData, theme, or lang changes
  const syncStateToIframe = () => {
    if (!iframeRef.current?.contentWindow) return;
    try {
      iframeRef.current.contentWindow.postMessage({
        type: 'SYNC_CV_DATA',
        data: cvData,
        theme,
        lang
      }, '*');
    } catch (_) {}
  };

  useEffect(() => {
    syncStateToIframe();
  }, [cvData, theme, lang]);

  // Listen for messages from inside the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'MOBILE_FRAME_READY') {
        setIsIframeLoaded(true);
        syncStateToIframe();
      } else if (event.data?.type === 'CHILD_THEME_CHANGED' && event.data.theme) {
        onThemeChange?.(event.data.theme);
      } else if (event.data?.type === 'CHILD_LANG_CHANGED' && event.data.lang) {
        onLangChange?.(event.data.lang);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [cvData, theme, lang, onThemeChange, onLangChange]);

  // Compute effective width & height based on orientation
  const effectiveWidth = isLandscape ? selectedDevice.height : selectedDevice.width;
  const effectiveHeight = isLandscape ? selectedDevice.width : selectedDevice.height;

  // Iframe URL
  const iframeSrc = `${window.location.pathname}?simulated_mobile=1&lang=${lang}&theme=${theme}`;

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-4 select-none min-h-[calc(100vh-100px)]">
      {/* 1. TOP SIMULATOR CONTROLS TOOLBAR */}
      <div className="w-full max-w-4xl mb-6 bg-slate-900/95 border border-slate-800 backdrop-blur-md rounded-2xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-white">
        {/* Device & Resolution */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-bold">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mode Layar HP Asli</span>
          </div>

          {/* Device Selector */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-lg border border-slate-700/60">
            {DEVICE_PRESETS.map((dev) => (
              <button
                key={dev.id}
                type="button"
                onClick={() => setSelectedDevice(dev)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedDevice.id === dev.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>{dev.name}</span>
                <span className="text-[9px] opacity-70">({dev.width}px)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Viewport Actions: Orientation, Scale, Refresh, External Link */}
        <div className="flex items-center gap-2">
          {/* Scale Buttons */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-lg border border-slate-700/60 text-[11px] font-mono">
            {[0.75, 0.85, 1.0].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScale(s)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                  scale === s
                    ? 'bg-slate-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {Math.round(s * 100)}%
              </button>
            ))}
          </div>

          {/* Orientation Toggle */}
          <button
            type="button"
            onClick={() => setIsLandscape(!isLandscape)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Rotasi Layar (Portrait / Landscape)"
          >
            <RotateCw className={`w-3.5 h-3.5 transition-transform ${isLandscape ? 'rotate-90 text-amber-400' : ''}`} />
          </button>

          {/* Reload Frame */}
          <button
            type="button"
            onClick={() => {
              setIsIframeLoaded(false);
              setIframeKey((prev) => prev + 1);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Muat Ulang Tampilan HP"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Open in New Window */}
          <a
            href={iframeSrc}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Buka Pratinjau Mobile di Tab Baru"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Return to Desktop Mode */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg shadow-md cursor-pointer transition-all active:scale-95 ml-1"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Kembali ke Desktop</span>
          </button>
        </div>
      </div>

      {/* 2. REALISTIC SMARTPHONE CHASSIS */}
      <div 
        className="transition-all duration-300 relative flex items-center justify-center"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: `${effectiveWidth + 28}px`,
          height: `${effectiveHeight + 36}px`
        }}
      >
        {/* Outer Phone Bezel with Titanium Edge Glow & Side Hardware Buttons */}
        <div 
          className="relative bg-gradient-to-b from-zinc-700 via-zinc-900 to-black p-[12px] shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/20 transition-all"
          style={{
            width: `${effectiveWidth + 24}px`,
            height: `${effectiveHeight + 24}px`,
            borderRadius: isLandscape ? '44px' : '52px'
          }}
        >
          {/* Left Side Buttons (Volume Up / Down) */}
          <div className="absolute -left-[3px] top-[105px] w-[3px] h-[34px] bg-zinc-600 rounded-l-sm" />
          <div className="absolute -left-[3px] top-[150px] w-[3px] h-[34px] bg-zinc-600 rounded-l-sm" />
          <div className="absolute -left-[3px] top-[65px] w-[3px] h-[20px] bg-zinc-600 rounded-l-sm" />

          {/* Right Side Button (Power / Lock) */}
          <div className="absolute -right-[3px] top-[120px] w-[3px] h-[55px] bg-zinc-600 rounded-r-sm" />

          {/* Phone Inner Screen Container */}
          <div 
            className="w-full h-full bg-slate-950 relative overflow-hidden flex flex-col shadow-inner"
            style={{
              borderRadius: isLandscape ? '36px' : '44px'
            }}
          >
            {/* Top Status Bar & Notch / Dynamic Island */}
            {!isLandscape && (
              <div className="absolute top-0 left-0 right-0 h-11 z-30 flex items-center justify-between px-6 pointer-events-none text-white font-sans text-xs select-none">
                {/* Time */}
                <div className="font-semibold text-[13px] tracking-tight pl-1">
                  {currentTime}
                </div>

                {/* Notch / Dynamic Island Center */}
                {selectedDevice.notchType === 'island' && (
                  <div className="w-26 h-7 bg-black rounded-full flex items-center justify-between px-2.5 shadow-md -translate-y-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#131520] ring-1 ring-blue-950/40 relative">
                      <div className="absolute inset-0.5 rounded-full bg-blue-900/60 opacity-80" />
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                  </div>
                )}

                {selectedDevice.notchType === 'punchhole' && (
                  <div className="w-3.5 h-3.5 bg-black rounded-full ring-2 ring-zinc-900 mx-auto -translate-y-0.5" />
                )}

                {/* Status Icons (Signal, Wifi, Battery) */}
                <div className="flex items-center gap-1.5 pr-1 text-white">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <div className="flex items-center gap-0.5">
                    <div className="w-5 h-2.5 border border-white/80 rounded-xs p-[1px] flex items-center">
                      <div className="w-full h-full bg-emerald-400 rounded-2xs" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* IFRAME: REAL ISOLATED MOBILE VIEWPORT */}
            <div className={`w-full h-full relative overflow-hidden ${!isLandscape ? 'pt-7' : ''}`}>
              <iframe
                key={iframeKey}
                ref={iframeRef}
                src={iframeSrc}
                title="Mobile Preview Frame"
                className="w-full h-full border-none bg-transparent"
                onLoad={() => {
                  setIsIframeLoaded(true);
                  syncStateToIframe();
                }}
              />

              {/* Loading Indicator when switching/loading iframe */}
              {!isIframeLoaded && (
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-2 z-20 text-white text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                  <span className="font-semibold text-slate-300">Menyiapkan tampilan smartphone...</span>
                </div>
              )}
            </div>

            {/* Bottom iOS Home Indicator Bar */}
            {!isLandscape && (
              <div className="absolute bottom-1.5 left-0 right-0 flex justify-center pointer-events-none z-30">
                <div className="w-32 h-1 bg-white/40 rounded-full backdrop-blur-sm" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Tip below simulator */}
      <div className="mt-8 text-center text-xs text-slate-400 max-w-md">
        <p className="font-medium">
          💡 <span className="text-white font-semibold">Tampilan 100% Real Mobile</span>: 
          Media query CSS (<code className="text-amber-300">md:hidden</code>, font HP, padding, susunan kartu, & posisi aset mobile) aktif sempurna persis seperti membuka web di HP fisik.
        </p>
      </div>
    </div>
  );
};
