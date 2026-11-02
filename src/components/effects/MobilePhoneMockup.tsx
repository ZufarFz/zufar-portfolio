import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Wifi, Signal } from 'lucide-react';
import { MobilePhoneMockupProps, DEVICE_PRESETS, MobileDevicePreset } from './mockup/mockupPresets';
import { MobileMockupToolbar } from './mockup/MobileMockupToolbar';

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

  const effectiveWidth = isLandscape ? selectedDevice.height : selectedDevice.width;
  const effectiveHeight = isLandscape ? selectedDevice.width : selectedDevice.height;
  const iframeSrc = `${window.location.pathname}?simulated_mobile=1&lang=${lang}&theme=${theme}`;

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-4 select-none min-h-[calc(100vh-100px)]">
      <MobileMockupToolbar
        selectedDevice={selectedDevice}
        setSelectedDevice={setSelectedDevice}
        scale={scale}
        setScale={setScale}
        isLandscape={isLandscape}
        setIsLandscape={setIsLandscape}
        onRefresh={() => {
          setIsIframeLoaded(false);
          setIframeKey((prev) => prev + 1);
        }}
        iframeSrc={iframeSrc}
        onClose={onClose}
      />

      {/* Realistic Smartphone Chassis */}
      <div 
        className="transition-all duration-300 relative flex items-center justify-center"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: `${effectiveWidth + 28}px`,
          height: `${effectiveHeight + 36}px`
        }}
      >
        <div 
          className="relative bg-gradient-to-b from-zinc-700 via-zinc-900 to-black p-[12px] shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/20 transition-all"
          style={{
            width: `${effectiveWidth + 24}px`,
            height: `${effectiveHeight + 24}px`,
            borderRadius: isLandscape ? '44px' : '52px'
          }}
        >
          {/* Hardware buttons */}
          <div className="absolute -left-[3px] top-[105px] w-[3px] h-[34px] bg-zinc-600 rounded-l-sm" />
          <div className="absolute -left-[3px] top-[150px] w-[3px] h-[34px] bg-zinc-600 rounded-l-sm" />
          <div className="absolute -left-[3px] top-[65px] w-[3px] h-[20px] bg-zinc-600 rounded-l-sm" />
          <div className="absolute -right-[3px] top-[120px] w-[3px] h-[55px] bg-zinc-600 rounded-r-sm" />

          {/* Screen */}
          <div 
            className="w-full h-full bg-slate-950 relative overflow-hidden flex flex-col shadow-inner"
            style={{ borderRadius: isLandscape ? '36px' : '44px' }}
          >
            {!isLandscape && (
              <div className="absolute top-0 left-0 right-0 h-11 z-30 flex items-center justify-between px-6 pointer-events-none text-white font-sans text-xs select-none">
                <div className="font-semibold text-[13px] tracking-tight pl-1">
                  {currentTime}
                </div>

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

              {!isIframeLoaded && (
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-2 z-20 text-white text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                  <span className="font-semibold text-slate-300">Menyiapkan tampilan smartphone...</span>
                </div>
              )}
            </div>

            {!isLandscape && (
              <div className="absolute bottom-1.5 left-0 right-0 flex justify-center pointer-events-none z-30">
                <div className="w-32 h-1 bg-white/40 rounded-full backdrop-blur-sm" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-400 max-w-md">
        <p className="font-medium">
          💡 <span className="text-white font-semibold">Tampilan 100% Real Mobile</span>: 
          Media query CSS aktif sempurna persis seperti membuka web di HP fisik.
        </p>
      </div>
    </div>
  );
};

export default MobilePhoneMockup;

