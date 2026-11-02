import React, { useState } from 'react';
import { 
  Share2, 
  Plus, 
  X, 
  ExternalLink, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  User, 
  Mail, 
  Globe, 
  Link, 
  Sliders, 
  Image, 
  Check, 
  Eye 
} from 'lucide-react';
import { CVData, CustomSocial } from '../../../../types';
import SocialIcon, { getAbsoluteSocialUrl } from '../../../common/SocialIcon';
import { SOCIAL_PLATFORM_PRESETS } from '../../types';

interface SocialLinksPanelProps {
  localData: CVData;
  handleUpdate: (updater: (prev: CVData) => CVData) => void;
  cardBg: string;
  inputClass: string;
}

export const SocialLinksPanel: React.FC<SocialLinksPanelProps> = ({
  localData,
  handleUpdate,
  cardBg,
  inputClass,
}) => {
  const [isAddingSocial, setIsAddingSocial] = useState<boolean>(false);
  const [newSocialData, setNewSocialData] = useState<{
    platform: string;
    name: string;
    value: string;
    usernameOrUrl: string;
    showOnWeb: boolean;
    showOnCvHeader: boolean;
    showOnCvFooter: boolean;
  }>({
    platform: 'LinkedIn',
    name: 'LinkedIn',
    value: '',
    usernameOrUrl: '',
    showOnWeb: true,
    showOnCvHeader: true,
    showOnCvFooter: true,
  });

  return (
    <div className="space-y-6">
      {/* 1.1 Header Overview & Live Stats Banner */}
      <div className={`p-4 rounded-xl border ${cardBg} space-y-3 relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-sky-400 flex items-center gap-1.5">
                <span>Pengaturan Media Sosial &amp; Kontak</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                Kelola akun sosial media, kontak utama narahubung profil, serta visibilitas di Web dan Header/Footer CV.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingSocial(true)}
            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Akun Baru</span>
          </button>
        </div>

        {/* Summary Metric Chips */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
          <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
            <span className="text-[10px] text-slate-400 block">Total Akun</span>
            <span className="text-sm font-bold text-slate-200">{(localData.customSocials || []).length} Akun</span>
          </div>
          <div className="p-2 rounded-lg bg-sky-950/40 border border-sky-500/30 text-center">
            <span className="text-[10px] text-sky-300 block">🌐 Tampil di Web</span>
            <span className="text-sm font-bold text-sky-400">
              {(localData.customSocials || []).filter(s => s.showOnWeb !== false).length}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-center">
            <span className="text-[10px] text-emerald-300 block">📄 CV Header/Footer</span>
            <span className="text-sm font-bold text-emerald-400">
              {(localData.customSocials || []).filter(s => s.showOnCvHeader || s.showOnCvFooter).length}
            </span>
          </div>
        </div>
      </div>

      {/* 1.2 FORM TAMBAH AKUN BARU */}
      {isAddingSocial && (
        <div className={`p-4 sm:p-5 rounded-xl border-2 border-sky-500/60 bg-slate-900/95 shadow-xl space-y-4`}>
          <div className="flex items-center justify-between pb-2 border-b border-sky-500/30">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-sky-500/20 text-sky-400">
                <Plus className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-sky-400">
                Tambah Akun Media Sosial / Tautan Baru
              </h5>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingSocial(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Preset Selector */}
          <div className="space-y-1.5">
            <label className="block text-[10.5px] font-bold text-slate-300">
              Pilih Platform Populer (Klik untuk Mengisi Otomatis):
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              {SOCIAL_PLATFORM_PRESETS.map((preset) => {
                const isSelected = newSocialData.platform.toLowerCase() === preset.id.toLowerCase();
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setNewSocialData(prev => ({
                        ...prev,
                        platform: preset.name,
                        name: preset.name,
                        usernameOrUrl: prev.usernameOrUrl || '',
                      }));
                    }}
                    className={`px-2 py-1 rounded-md text-[10.5px] font-medium transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-sky-600 text-white font-bold shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <SocialIcon platform={preset.id} className="w-3.5 h-3.5" useBrandColor={!isSelected} />
                    <span>{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10.5px] font-bold text-slate-400 mb-1">
                Nama Platform / Judul
              </label>
              <input
                type="text"
                value={newSocialData.name}
                onChange={(e) => setNewSocialData(prev => ({ ...prev, name: e.target.value, platform: e.target.value }))}
                placeholder="mis. LinkedIn, Instagram, Discord..."
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-bold text-slate-400 mb-1">
                Nama Akun / Label Tampilan
              </label>
              <input
                type="text"
                value={newSocialData.value}
                onChange={(e) => setNewSocialData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="mis. Muhammad Zufar Fauzi / @username"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-slate-400 mb-1">
              Username atau URL Lengkap
            </label>
            <input
              type="text"
              value={newSocialData.usernameOrUrl}
              onChange={(e) => setNewSocialData(prev => ({ ...prev, usernameOrUrl: e.target.value }))}
              placeholder="mis. username / https://linkedin.com/in/... / 0851..."
              className={inputClass}
            />
            {newSocialData.usernameOrUrl && (
              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-sky-400">
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  Target Link: <code className="text-sky-300">{getAbsoluteSocialUrl(newSocialData.platform || newSocialData.name, newSocialData.usernameOrUrl)}</code>
                </span>
              </div>
            )}
          </div>

          {/* Visibility Checkboxes in Add Form */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-[10.5px] font-bold text-slate-300">
              Penempatan &amp; Visibilitas:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] font-medium text-slate-300 cursor-pointer hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={newSocialData.showOnWeb}
                  onChange={(e) => setNewSocialData(prev => ({ ...prev, showOnWeb: e.target.checked }))}
                  className="rounded accent-sky-500 cursor-pointer"
                />
                <span>🌐 Tampil di Web</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] font-medium text-slate-300 cursor-pointer hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={newSocialData.showOnCvHeader}
                  onChange={(e) => setNewSocialData(prev => ({ ...prev, showOnCvHeader: e.target.checked }))}
                  className="rounded accent-emerald-500 cursor-pointer"
                />
                <span>📄 CV Header</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] font-medium text-slate-300 cursor-pointer hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={newSocialData.showOnCvFooter}
                  onChange={(e) => setNewSocialData(prev => ({ ...prev, showOnCvFooter: e.target.checked }))}
                  className="rounded accent-teal-500 cursor-pointer"
                />
                <span>📑 CV Footer</span>
              </label>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddingSocial(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                const platformName = newSocialData.platform.trim() || newSocialData.name.trim() || 'Custom';
                const displayVal = newSocialData.value.trim() || newSocialData.usernameOrUrl.trim() || platformName;
                const urlVal = newSocialData.usernameOrUrl.trim() || newSocialData.value.trim();
                if (!urlVal && !displayVal) return;

                const newId = `social-${Date.now()}`;
                const newSocial: CustomSocial = {
                  id: newId,
                  name: platformName,
                  value: displayVal,
                  usernameOrUrl: urlVal,
                  showOnWeb: newSocialData.showOnWeb,
                  showOnCvHeader: newSocialData.showOnCvHeader,
                  showOnCvFooter: newSocialData.showOnCvFooter,
                };

                handleUpdate(prev => {
                  const list = [...(prev.customSocials || []), newSocial];
                  let footerList = prev.footerSocials || [];
                  if (newSocialData.showOnWeb || newSocialData.showOnCvFooter) {
                    footerList = Array.from(new Set([...footerList, newId]));
                  }
                  let headerList = prev.headerContacts || [];
                  if (newSocialData.showOnCvHeader) {
                    headerList = Array.from(new Set([...headerList, newId]));
                  }

                  return {
                    ...prev,
                    customSocials: list,
                    footerSocials: footerList,
                    headerContacts: headerList,
                  };
                });

                setNewSocialData({
                  platform: 'LinkedIn',
                  name: 'LinkedIn',
                  value: '',
                  usernameOrUrl: '',
                  showOnWeb: true,
                  showOnCvHeader: true,
                  showOnCvFooter: true,
                });
                setIsAddingSocial(false);
              }}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan Akun Baru</span>
            </button>
          </div>
        </div>
      )}

      {/* 1.3 KONTAK UTAMA & PROFIL LANGSUNG */}
      <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
        <div className="flex items-center justify-between pb-1 border-b border-sky-500/20">
          <h5 className="font-bold text-xs uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>Kontak Utama &amp; Narahubung Profil</span>
          </h5>
          <span className="text-[10px] text-slate-400">Sinkronisasi Instan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[10.5px] font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Mail className="w-3 h-3 text-sky-400" />
              <span>Alamat Email Utama</span>
            </label>
            <input
              type="email"
              value={localData.email || ''}
              onChange={(e) => handleUpdate(prev => ({ ...prev, email: e.target.value }))}
              placeholder="contoh@gmail.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>Lokasi / Domisili</span>
            </label>
            <input
              type="text"
              value={localData.location || ''}
              onChange={(e) => handleUpdate(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Klaten, Jawa Tengah / Indonesia"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-slate-400 mb-1 flex items-center gap-1">
              <SocialIcon platform="whatsapp" className="w-3 h-3" />
              <span>Nomor WhatsApp / Telepon</span>
            </label>
            <input
              type="text"
              value={localData.whatsapp || ''}
              onChange={(e) => handleUpdate(prev => ({ ...prev, whatsapp: e.target.value }))}
              placeholder="085123333230 / +628..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-slate-400 mb-1 flex items-center gap-1">
              <SocialIcon platform="linkedin" className="w-3 h-3" />
              <span>LinkedIn Username / URL</span>
            </label>
            <input
              type="text"
              value={localData.linkedin || ''}
              onChange={(e) => handleUpdate(prev => ({ ...prev, linkedin: e.target.value }))}
              placeholder="muhammad-zufar-fauzi"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* 1.4 DAFTAR KARTU MEDIA SOSIAL */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5" />
              <span>Daftar Akun Media Sosial &amp; Tautan ({ (localData.customSocials || []).length })</span>
            </h5>
            <p className="text-[10px] text-slate-400">
              Atur urutan tampilan, label nama, tautan, dan centang di mana akun ini akan muncul
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingSocial(true)}
            className="px-2.5 py-1 rounded-md bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-3 h-3" />
            <span>Tambah</span>
          </button>
        </div>

        {(localData.customSocials || []).length === 0 ? (
          <div className={`p-6 rounded-xl border ${cardBg} text-center space-y-2`}>
            <Share2 className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-300">Belum ada akun media sosial yang terdaftar.</p>
            <button
              type="button"
              onClick={() => setIsAddingSocial(true)}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer shadow transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Akun Pertama</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {(localData.customSocials || []).map((social, index) => {
              const directUrl = getAbsoluteSocialUrl(social.name || social.id, social.usernameOrUrl || social.value);

              return (
                <div
                  key={social.id || index}
                  className={`p-3.5 rounded-xl border ${cardBg} space-y-3 hover:border-sky-500/40 transition-all shadow-xs`}
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                        <SocialIcon platform={social.name || social.id} className="w-4 h-4" useBrandColor />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-200 block truncate">
                          {social.name || 'Platform'}
                        </span>
                        <a
                          href={directUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-sky-400 hover:underline flex items-center gap-1 truncate"
                        >
                          <span className="truncate">{social.usernameOrUrl || social.value || 'Belum ada tautan'}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => {
                          if (index === 0) return;
                          handleUpdate(prev => {
                            const list = [...(prev.customSocials || [])];
                            const temp = list[index];
                            list[index] = list[index - 1];
                            list[index - 1] = temp;
                            return { ...prev, customSocials: list };
                          });
                        }}
                        className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="Pindah ke Atas"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === (localData.customSocials || []).length - 1}
                        onClick={() => {
                          if (index >= (localData.customSocials || []).length - 1) return;
                          handleUpdate(prev => {
                            const list = [...(prev.customSocials || [])];
                            const temp = list[index];
                            list[index] = list[index + 1];
                            list[index + 1] = temp;
                            return { ...prev, customSocials: list };
                          });
                        }}
                        className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="Pindah ke Bawah"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleUpdate(prev => ({
                            ...prev,
                            customSocials: (prev.customSocials || []).filter((_, i) => i !== index),
                            headerContacts: (prev.headerContacts || []).filter(id => id !== social.id),
                            footerSocials: (prev.footerSocials || []).filter(id => id !== social.id),
                          }));
                        }}
                        className="p-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-all cursor-pointer ml-1"
                        title="Hapus Akun Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Nama Platform
                      </label>
                      <input
                        type="text"
                        value={social.name || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdate(prev => {
                            const list = [...(prev.customSocials || [])];
                            list[index] = { ...list[index], name: val };
                            return { ...prev, customSocials: list };
                          });
                        }}
                        placeholder="Nama Platform"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Label / Nama Akun Tampilan
                      </label>
                      <input
                        type="text"
                        value={social.value || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdate(prev => {
                            const list = [...(prev.customSocials || [])];
                            list[index] = { ...list[index], value: val };
                            return { ...prev, customSocials: list };
                          });
                        }}
                        placeholder="Nama akun"
                        className={inputClass}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Username / URL Tautan
                      </label>
                      <input
                        type="text"
                        value={social.usernameOrUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdate(prev => {
                            const list = [...(prev.customSocials || [])];
                            list[index] = { ...list[index], usernameOrUrl: val };
                            return { ...prev, customSocials: list };
                          });
                        }}
                        placeholder="https://... atau username"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1.5">
                      Penempatan &amp; Visibilitas:
                    </span>
                    <div className="flex flex-wrap gap-2 text-[10.5px]">
                      <label className={`px-2 py-1 rounded-md border flex items-center gap-1.5 cursor-pointer transition-all ${
                        social.showOnWeb !== false
                          ? 'bg-sky-500/10 border-sky-500/40 text-sky-300 font-semibold'
                          : 'bg-slate-800/40 border-slate-700/40 text-slate-400'
                      }`}>
                        <input
                          type="checkbox"
                          checked={social.showOnWeb !== false}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            handleUpdate(prev => {
                              const list = [...(prev.customSocials || [])];
                              list[index] = { ...list[index], showOnWeb: checked };
                              return { ...prev, customSocials: list };
                            });
                          }}
                          className="rounded accent-sky-500 cursor-pointer"
                        />
                        <span>🌐 Web</span>
                      </label>

                      <label className={`px-2 py-1 rounded-md border flex items-center gap-1.5 cursor-pointer transition-all ${
                        social.showOnCvHeader
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold'
                          : 'bg-slate-800/40 border-slate-700/40 text-slate-400'
                      }`}>
                        <input
                          type="checkbox"
                          checked={!!social.showOnCvHeader}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            handleUpdate(prev => {
                              const list = [...(prev.customSocials || [])];
                              list[index] = { ...list[index], showOnCvHeader: checked };
                              let hList = prev.headerContacts || [];
                              if (checked) {
                                hList = Array.from(new Set([...hList, social.id]));
                              } else {
                                hList = hList.filter(id => id !== social.id);
                              }
                              return { ...prev, customSocials: list, headerContacts: hList };
                            });
                          }}
                          className="rounded accent-emerald-500 cursor-pointer"
                        />
                        <span>📄 CV Header</span>
                      </label>

                      <label className={`px-2 py-1 rounded-md border flex items-center gap-1.5 cursor-pointer transition-all ${
                        social.showOnCvFooter
                          ? 'bg-teal-500/10 border-teal-500/40 text-teal-300 font-semibold'
                          : 'bg-slate-800/40 border-slate-700/40 text-slate-400'
                      }`}>
                        <input
                          type="checkbox"
                          checked={!!social.showOnCvFooter}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            handleUpdate(prev => {
                              const list = [...(prev.customSocials || [])];
                              list[index] = { ...list[index], showOnCvFooter: checked };
                              let fList = prev.footerSocials || [];
                              if (checked) {
                                fList = Array.from(new Set([...fList, social.id]));
                              } else {
                                fList = fList.filter(id => id !== social.id);
                              }
                              return { ...prev, customSocials: list, footerSocials: fList };
                            });
                          }}
                          className="rounded accent-teal-500 cursor-pointer"
                        />
                        <span>📑 CV Footer</span>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 1.5 MATRIKS PENEMPATAN KONTAK CEPAT */}
      <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
        <div className="flex items-center justify-between pb-1 border-b border-sky-500/20">
          <h5 className="font-bold text-xs uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Matriks Penempatan Kontak Cepat di CV</span>
          </h5>
          <span className="text-[10px] text-slate-400">Header &amp; Footer Presets</span>
        </div>

        {/* Header Contacts */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-slate-300">
            1. Kontak di Header CV (<code className="text-emerald-400">headerContacts</code>):
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'location', label: '📍 Lokasi' },
              { id: 'email', label: '✉️ Email' },
              { id: 'social-linkedin', label: '💼 LinkedIn' },
              { id: 'social-github', label: '🐙 GitHub' },
              { id: 'social-whatsapp', label: '💬 WhatsApp' },
              { id: 'social-instagram', label: '📷 Instagram' },
              ...(localData.customSocials || []).map(s => ({ id: s.id, label: `🔗 ${s.name}` }))
            ].map(item => {
              const isChecked = (localData.headerContacts || []).includes(item.id);
              return (
                <button
                  key={`header-${item.id}`}
                  type="button"
                  onClick={() => {
                    handleUpdate(prev => {
                      const current = prev.headerContacts || [];
                      const next = isChecked ? current.filter(x => x !== item.id) : [...current, item.id];
                      return { ...prev, headerContacts: next };
                    });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isChecked
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                  }`}
                >
                  {isChecked ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-slate-500" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Contacts */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-[11px] font-bold text-slate-300">
            2. Tautan di Footer CV (<code className="text-teal-400">footerSocials</code>):
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'social-linkedin', label: '💼 LinkedIn' },
              { id: 'social-github', label: '🐙 GitHub' },
              { id: 'social-whatsapp', label: '💬 WhatsApp' },
              { id: 'social-instagram', label: '📷 Instagram' },
              { id: 'email', label: '✉️ Email' },
              ...(localData.customSocials || []).map(s => ({ id: s.id, label: `🔗 ${s.name}` }))
            ].map(item => {
              const isChecked = (localData.footerSocials || []).includes(item.id);
              return (
                <button
                  key={`footer-${item.id}`}
                  type="button"
                  onClick={() => {
                    handleUpdate(prev => {
                      const current = prev.footerSocials || [];
                      const next = isChecked ? current.filter(x => x !== item.id) : [...current, item.id];
                      return { ...prev, footerSocials: next };
                    });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isChecked
                      ? 'bg-teal-600 text-white border-teal-500 shadow-xs'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                  }`}
                >
                  {isChecked ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-slate-500" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 1.6 LIVE PREVIEW BAR */}
      <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>Pratinjau Tombol Media Sosial di Website:</span>
          </span>
          <span className="text-[10px] text-slate-500">Live Preview</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-wrap items-center gap-2">
          {(localData.customSocials || []).filter(s => s.showOnWeb !== false).map((social) => {
            const link = getAbsoluteSocialUrl(social.name || social.id, social.usernameOrUrl || social.value);
            return (
              <a
                key={`preview-${social.id}`}
                href={link}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-500/50 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs"
              >
                <SocialIcon platform={social.name || social.id} className="w-3.5 h-3.5" useBrandColor />
                <span>{social.value || social.name}</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
            );
          })}
        </div>
      </div>

      {/* 1.7 LINK PREVIEW & SOCIAL MEDIA SEO (WHATSAPP, LINKEDIN, TWITTER) */}
      <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
        <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-400">
                Preview Link WhatsApp &amp; Sosial Media (SEO)
              </h5>
              <p className="text-[10px] text-slate-400">
                Tersimpan otomatis di portfolioData.ts &amp; auto-inject ke HTML tanpa edit index.html
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
            Auto-Inject
          </span>
        </div>

        {/* Live WhatsApp Preview Box Simulation */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
            <SocialIcon platform="whatsapp" className="w-3.5 h-3.5" />
            <span>Simulasi Tampilan Link di WhatsApp:</span>
          </span>
          
          <div className="max-w-sm rounded-lg overflow-hidden border border-slate-700/80 bg-slate-900 shadow-md">
            <div className="relative h-32 w-full bg-slate-800 flex items-center justify-center overflow-hidden border-b border-slate-700">
              <img 
                src={localData.webTexts?.og_image || localData.avatarUrl || localData.homeImageUrl || '/profile.png'} 
                alt="Thumbnail Preview"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/profile.png';
                }}
              />
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-mono text-white">
                Preview Image
              </div>
            </div>
            <div className="p-2.5 space-y-1">
              <div className="text-[10px] text-emerald-400 font-mono truncate">
                {localData.webTexts?.site_url || 'https://domain-portfolio-anda.com'}
              </div>
              <h6 className="text-xs font-bold text-white line-clamp-1 leading-snug">
                {localData.webTexts?.og_title || `${localData.name || 'Muhammad Zufar Fauzi'} | ${localData.title || 'Junior Data Analyst'} Portfolio`}
              </h6>
              <p className="text-[10.5px] text-slate-400 line-clamp-2 leading-tight">
                {localData.webTexts?.og_description || localData.webTexts?.hero_subtitle || localData.aboutMe || 'Portfolio interaktif & Data Analytics showcase.'}
              </p>
            </div>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-[10.5px] font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-sky-400" />
                <span>Domain Web / Site URL (Wajib untuk Thumbnail WA)</span>
              </span>
              <span className="text-[9.5px] text-slate-400">Contoh: https://zufarfz.github.io</span>
            </label>
            <input
              type="text"
              value={localData.webTexts?.site_url || ''}
              onChange={(e) => {
                const val = e.target.value;
                handleUpdate(prev => ({
                  ...prev,
                  webTexts: {
                    ...prev.webTexts,
                    site_url: val
                  }
                }));
              }}
              placeholder="https://zufar-portfolio.vercel.app atau https://domainanda.com"
              className={inputClass}
            />
            <p className="text-[9.5px] text-slate-400 mt-1">
              💡 WhatsApp wajib menggunakan URL lengkap berawalan <code>https://</code> agar foto thumbnail dapat ditarik.
            </p>
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span>Judul Preview Link (og:title)</span>
              <span className="text-[9.5px] text-slate-400">Default: Nama | Posisi</span>
            </label>
            <input
              type="text"
              value={localData.webTexts?.og_title || ''}
              onChange={(e) => {
                const val = e.target.value;
                handleUpdate(prev => ({
                  ...prev,
                  webTexts: {
                    ...prev.webTexts,
                    og_title: val
                  }
                }));
              }}
              placeholder={`${localData.name || 'Nama Anda'} | ${localData.title || 'Posisi'} Portfolio`}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span>Deskripsi Preview Link (og:description)</span>
              <span className="text-[9.5px] text-slate-400">1 - 2 kalimat singkat</span>
            </label>
            <textarea
              rows={2}
              value={localData.webTexts?.og_description || ''}
              onChange={(e) => {
                const val = e.target.value;
                handleUpdate(prev => ({
                  ...prev,
                  webTexts: {
                    ...prev.webTexts,
                    og_description: val
                  }
                }));
              }}
              placeholder="Portfolio interaktif & Data Analytics showcase. Mengubah data transaksi mentah menjadi wawasan bisnis strategis..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Image className="w-3 h-3 text-pink-400" />
                <span>Path / URL Gambar Thumbnail (og:image)</span>
              </span>
              <span className="text-[9.5px] text-slate-400">Default: /profile.png</span>
            </label>
            <input
              type="text"
              value={localData.webTexts?.og_image || ''}
              onChange={(e) => {
                const val = e.target.value;
                handleUpdate(prev => ({
                  ...prev,
                  webTexts: {
                    ...prev.webTexts,
                    og_image: val
                  }
                }));
              }}
              placeholder="/profile.png atau URL gambar online"
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
