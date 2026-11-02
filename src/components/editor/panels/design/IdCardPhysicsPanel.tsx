import React from 'react';
import { CVData } from '../../../../types';
import { CreditCard } from 'lucide-react';

interface IdCardPhysicsPanelProps {
  localData: CVData;
  handleUpdate: React.Dispatch<React.SetStateAction<CVData>>;
  cardBg: string;
  inputClass: string;
}

export const IdCardPhysicsPanel: React.FC<IdCardPhysicsPanelProps> = ({
  localData,
  handleUpdate,
  cardBg,
  inputClass,
}) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            <span>ID Card Vektor &amp; Badge Visual</span>
          </h4>
          <p className="text-[10.5px] text-slate-400 mt-0.5">
            Kustomisasi teks timbul, fade portrait, dan ornamen kartu ID
          </p>
        </div>
      </div>

      <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">
              Grup Tag Kartu (Mis: [TECH CORP])
            </label>
            <input
              type="text"
              value={localData.idCardGroup || ''}
              onChange={(e) => {
                const val = e.target.value;
                handleUpdate((prev) => ({ ...prev, idCardGroup: val }));
              }}
              placeholder="[BUSINESS INTEL]"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">
              Sub-Teks / ID Card Code
            </label>
            <input
              type="text"
              value={localData.idCardSubText || ''}
              onChange={(e) => {
                const val = e.target.value;
                handleUpdate((prev) => ({ ...prev, idCardSubText: val }));
              }}
              placeholder="CORP ID: BI-2024-X"
              className={inputClass}
            />
          </div>
        </div>

        {/* Portrait Fade Toggle */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localData.idCardPortraitFadeEnabled !== false}
              onChange={(e) => {
                const checked = e.target.checked;
                handleUpdate((prev) => ({ ...prev, idCardPortraitFadeEnabled: checked }));
              }}
              className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-300">
              Aktifkan Efek Halus Gradasi Portrait (Fade Bottom)
            </span>
          </label>
        </div>

        {/* ID Card Background Text Size Slider */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
            <span>Ukuran Teks Latar Belakang Kartu:</span>
            <span className="font-mono text-purple-400">{localData.idCardBgTextSize || 18}px</span>
          </div>
          <input
            type="range"
            min="10"
            max="40"
            step="1"
            value={localData.idCardBgTextSize || 18}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              handleUpdate((prev) => ({ ...prev, idCardBgTextSize: val }));
            }}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
