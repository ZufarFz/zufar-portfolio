import React from 'react';
import { 
  Smartphone, 
  Monitor, 
  RotateCw, 
  RefreshCw, 
  ExternalLink 
} from 'lucide-react';
import { MobileDevicePreset, DEVICE_PRESETS } from './mockupPresets';

interface MobileMockupToolbarProps {
  selectedDevice: MobileDevicePreset;
  setSelectedDevice: (device: MobileDevicePreset) => void;
  scale: number;
  setScale: (scale: number) => void;
  isLandscape: boolean;
  setIsLandscape: (isLandscape: boolean | ((prev: boolean) => boolean)) => void;
  onRefresh: () => void;
  iframeSrc: string;
  onClose: () => void;
}

export const MobileMockupToolbar: React.FC<MobileMockupToolbarProps> = ({
  selectedDevice,
  setSelectedDevice,
  scale,
  setScale,
  isLandscape,
  setIsLandscape,
  onRefresh,
  iframeSrc,
  onClose,
}) => {
  return (
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

      {/* Viewport Actions */}
      <div className="flex items-center gap-2">
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

        <button
          type="button"
          onClick={() => setIsLandscape(prev => !prev)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          title="Rotasi Layar (Portrait / Landscape)"
        >
          <RotateCw className={`w-3.5 h-3.5 transition-transform ${isLandscape ? 'rotate-90 text-amber-400' : ''}`} />
        </button>

        <button
          type="button"
          onClick={onRefresh}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          title="Muat Ulang Tampilan HP"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <a
          href={iframeSrc}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          title="Buka Pratinjau Mobile di Tab Baru"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

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
  );
};
