import React, { useState } from 'react';
import { 
  Play, 
  Plus, 
  Trash2, 
  Award, 
  Layers, 
  Image as ImageIcon, 
  CheckCircle,
  BarChart2,
  ChevronDown,
  ChevronUp,
  FileText,
  Upload
} from 'lucide-react';
import { CaseStudySlide } from '../types';
import { uploadFileToStorage, isSupabaseConfigured } from '../lib/supabaseClient';

interface PPTSlideEditorProps {
  slides: CaseStudySlide[] | undefined;
  onUpdateSlides: (updatedSlides: CaseStudySlide[]) => void;
  theme: 'light' | 'dark';
}

export default function PPTSlideEditor({ slides = [], onUpdateSlides, theme }: PPTSlideEditorProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const activeSlide = slides[activeIndex];

  const handleAddSlide = () => {
    const newSlide: CaseStudySlide = {
      id: `slide-${Date.now()}`,
      title: "Slide Baru",
      content: "Tulis narasi atau penjelasan detail di sini untuk slide deck presentasi Anda.",
      visualType: "metric",
      metricLabel: "Dampak Bisnis",
      metricValue: "+10.5%",
      bulletsList: ["Milestone 1: Perencanaan", "Milestone 2: Eksekusi"]
    };
    const updated = [...slides, newSlide];
    onUpdateSlides(updated);
    setActiveIndex(updated.length - 1);
  };

  const handleRemoveSlide = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length <= 1) {
      alert("Presentasi minimal harus memiliki 1 slide.");
      return;
    }
    const updated = slides.filter((_, i) => i !== idx);
    onUpdateSlides(updated);
    // Adjust active index
    if (activeIndex >= updated.length) {
      setActiveIndex(updated.length - 1);
    }
  };

  const updateSlideField = (field: keyof CaseStudySlide, value: any) => {
    const updated = slides.map((slide, sidx) => {
      if (sidx === activeIndex) {
        return { ...slide, [field]: value };
      }
      return slide;
    });
    onUpdateSlides(updated);
  };

  const handleUpdateBullet = (bIdx: number, val: string) => {
    if (!activeSlide) return;
    const currentBullets = activeSlide.bulletsList || [];
    const updatedBullets = currentBullets.map((b, idx) => (idx === bIdx ? val : b));
    updateSlideField('bulletsList', updatedBullets);
  };

  const handleAddBullet = () => {
    if (!activeSlide) return;
    const currentBullets = activeSlide.bulletsList || [];
    updateSlideField('bulletsList', [...currentBullets, `Detail poin baru`]);
  };

  const handleRemoveBullet = (bIdx: number) => {
    if (!activeSlide) return;
    const currentBullets = activeSlide.bulletsList || [];
    updateSlideField('bulletsList', currentBullets.filter((_, idx) => idx !== bIdx));
  };

  const handleSlideImageUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran berkas melebihi 2.0MB.");
        return;
      }
      const publicUrl = await uploadFileToStorage(file);
      updateSlideField('image', publicUrl);
      alert("✓ Gambar slide berhasil diunggah ke bucket 'portfolio_assets'!");
    } catch (err: any) {
      console.error("Gagal mengunggah ke bucket:", err);
      alert(`❌ Gagal mengunggah gambar ke bucket 'portfolio_assets'. Harap pastikan bucket Anda sudah di-create di Supabase, di-set ke PUBLIC, dan memiliki kebijakan/policies RLS yang memperbolehkan upload berkas anonim/terautentikasi.\n\nDetail Error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`p-5 rounded-xl border space-y-6 ${
      theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
    }`}>
      
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3 ${theme === 'dark' ? 'border-slate-805/30' : 'border-slate-205'}`}>
        <div className="space-y-0.5">
          <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-500">
            📊 PowerPoint / Slide Deck Presentasi Editor
          </h5>
          <p className="text-[10px] font-mono leading-tight text-slate-550">
            Semua slide di bawah ini akan tampil sebagai dynamic slideshow interaktif saat card projek diklik.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddSlide}
          className={`flex items-center gap-1 border px-3 py-1 text-[10px] font-bold rounded cursor-pointer transition-all active:scale-97 select-none ${theme === 'dark' ? 'bg-emerald-600/20 hover:bg-emerald-650/30 text-emerald-450 border-emerald-500/30' : 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-705 border-emerald-250 shadow-sm'}`}
        >
          <Plus className="w-3.5 h-3.5" /> TAMBAH SALINDIA DECK
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Slide Sorter Tabs List */}
        <div className="lg:col-span-4 space-y-2 max-h-[350px] overflow-y-auto pr-1">
          <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            SLIDE SELECTOR ({slides.length})
          </span>
          {slides.map((slide, sidx) => (
            <div
              key={slide.id || sidx}
              onClick={() => setActiveIndex(sidx)}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between group ${
                sidx === activeIndex
                  ? 'bg-emerald-600/10 border-emerald-500 text-emerald-500 shadow-sm font-bold'
                  : theme === 'dark'
                    ? 'bg-slate-950/40 border-slate-805 hover:bg-slate-900 text-slate-350'
                    : 'bg-white border-slate-205 hover:bg-slate-100 text-slate-700 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`text-[10px] font-mono w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${theme === 'dark' ? 'bg-slate-500/15 text-slate-300' : 'bg-slate-150 text-slate-700'}`}>
                  {sidx + 1}
                </span>
                <span className="text-xs font-bold truncate max-w-[130px]">
                  {slide.title || `Slide #${sidx + 1}`}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span className={`text-[8px] font-mono px-1 py-0.2 rounded uppercase leading-none opacity-85 group-hover:opacity-100 ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                  {slide.visualType}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveSlide(sidx, e)}
                  className="text-slate-500 hover:text-red-500 transition-colors p-1 cursor-pointer"
                  title="Hapus slide ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {slides.length === 0 && (
            <div className={`text-center py-8 font-mono text-xs border border-dashed rounded-lg ${theme === 'dark' ? 'text-slate-510 border-slate-805' : 'text-slate-450 border-slate-300'}`}>
              Silakan klik tombol "Tambah Salindia" untuk memulai.
            </div>
          )}
        </div>

        {/* Right Side: Loaded Slide Form Editors */}
        <div className="lg:col-span-8 space-y-4">
          {activeSlide ? (
            <div className={`p-4 rounded-xl space-y-4 ${
              theme === 'dark' ? 'bg-slate-955/40' : 'bg-white border border-slate-205 shadow-sm'
            }`}>
              <div className={`flex items-center gap-2 border-b pb-2 ${theme === 'dark' ? 'border-slate-805/30' : 'border-slate-201'}`}>
                <FileText className="w-4 h-4 text-emerald-500" />
                <span className={`text-[11px] font-bold uppercase tracking-wider font-mono ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>
                  Mengedit Slide #{activeIndex + 1} ({activeSlide.title})
                </span>
              </div>

              {/* Slide Title */}
              <div>
                <label className={`text-[9px] font-mono font-bold block uppercase mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Judul Utama Slide PPT</label>
                <input
                  type="text"
                  value={activeSlide.title}
                  onChange={(e) => updateSlideField('title', e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none border focus:border-emerald-500 ${theme === 'dark' ? 'bg-slate-900 border-slate-805 text-slate-100' : 'bg-white border-slate-255 text-slate-800'}`}
                  placeholder="e.g. Tantangan Logistik & Solusi Analitik"
                />
              </div>

              {/* Slide Narration */}
              <div>
                <label className={`text-[9px] font-mono font-bold block uppercase mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Narasi Deskripsi Penjelasan Slide</label>
                <textarea
                  value={activeSlide.content}
                  onChange={(e) => updateSlideField('content', e.target.value)}
                  rows={2}
                  className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none leading-normal border focus:border-emerald-500 ${theme === 'dark' ? 'bg-slate-900 border-slate-805 text-slate-100' : 'bg-white border-slate-255 text-slate-800'}`}
                  placeholder="Ceritakan temuan bisnis atau langkah implementasi dari portfolio ini..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Visual Type selector */}
                <div>
                  <label className={`text-[9px] font-mono font-bold block uppercase mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Layout Komponen Visual Utama</label>
                  <select
                    value={activeSlide.visualType}
                    onChange={(e) => updateSlideField('visualType', e.target.value)}
                    className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none font-sans border focus:border-emerald-500 ${theme === 'dark' ? 'bg-slate-900 border-slate-805 text-slate-100' : 'bg-white border-slate-255 text-slate-800'}`}
                  >
                    <option value="metric">🔢 High-impact KPI Callout Metric</option>
                    <option value="bullet_points">📋 Checkpoints Implementation Highlights</option>
                    <option value="image">🖼️ Specific Case Illustration Image</option>
                    <option value="chart">📊 Comparison Performance Analytics Chart</option>
                    <option value="text">✍️ Quote / Strategic Advice Box</option>
                  </select>
                </div>

                {/* Sub configuration forms depending on chosen layout */}
                <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-805/40' : 'bg-slate-100/50 border-slate-205'}`}>
                  {/* METRIC SUB FORM */}
                  {activeSlide.visualType === 'metric' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-mono font-bold text-emerald-500 block uppercase mb-0.5">Nilai Metric (Value)</label>
                        <input
                          type="text"
                          value={activeSlide.metricValue || ''}
                          onChange={(e) => updateSlideField('metricValue', e.target.value)}
                          className={`w-full px-2 py-1 rounded text-[11px] outline-none font-mono focus:border-emerald-500 font-bold border ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-emerald-400' : 'bg-white border-slate-205 text-emerald-700'}`}
                          placeholder="e.g. +24.0% atau $2.20M USD"
                        />
                      </div>
                      <div>
                        <label className={`text-[9px] font-mono font-bold block uppercase mb-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Label Keterangan Metric</label>
                        <input
                          type="text"
                          value={activeSlide.metricLabel || ''}
                          onChange={(e) => updateSlideField('metricLabel', e.target.value)}
                          className={`w-full px-2 py-1 rounded text-[11px] outline-none border focus:border-emerald-500 ${theme === 'dark' ? 'bg-slate-955 border-slate-850 text-slate-100' : 'bg-white border-slate-205 text-slate-800'}`}
                          placeholder="e.g. Email Campaign CTR"
                        />
                      </div>
                    </div>
                  )}

                  {/* BULLET POINTS SUB FORM */}
                  {activeSlide.visualType === 'bullet_points' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className={`text-[9px] font-mono font-bold uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Poin-poin Sorotan</label>
                        <button
                          type="button"
                          onClick={handleAddBullet}
                          className="text-[8px] font-sans font-bold text-emerald-500 tracking-wider hover:underline cursor-pointer"
                        >
                          + TAMBAH POIN
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                        {(activeSlide.bulletsList || []).map((bullet, idx) => (
                           <div key={idx} className="flex items-center gap-1">
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => handleUpdateBullet(idx, e.target.value)}
                              className={`flex-grow px-2 py-1 rounded text-[10px] outline-none border focus:border-emerald-500 ${theme === 'dark' ? 'bg-slate-955 border-slate-850 text-slate-100' : 'bg-white border-slate-205 text-slate-800'}`}
                              placeholder={`Poin #${idx + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveBullet(idx)}
                              className="text-slate-505 hover:text-red-500 p-0.5 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* IMAGE SUB FORM */}
                  {activeSlide.visualType === 'image' && (
                    <div className="space-y-2">
                      <label className={`text-[9px] font-mono font-bold block uppercase mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Unggah Foto Slide</label>
                      <div className="flex items-center gap-2">
                        {activeSlide.image ? (
                          <img
                            src={activeSlide.image}
                            alt="preview"
                            className="w-10 h-7 rounded border border-slate-700 object-cover"
                          />
                        ) : (
                          <div className={`w-10 h-7 rounded font-mono text-[8px] flex items-center justify-center border border-dashed ${theme === 'dark' ? 'bg-slate-820 border-slate-705 text-slate-500' : 'bg-slate-100 border-slate-300 text-slate-400'}`}>
                            NIL
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          id={`input-slide-img-${activeIndex}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleSlideImageUpload(file);
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor={`input-slide-img-${activeIndex}`}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded cursor-pointer border flex items-center gap-1 select-none active:scale-97 ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-705 text-slate-200 border-slate-705' : 'bg-white hover:bg-slate-100 text-slate-705 border-slate-255 shadow-sm'}`}
                        >
                          <Upload className="w-3 h-3" /> {isUploading ? "PROCESS..." : "Unggah"}
                        </label>
                      </div>
                      <p className="text-[8px] text-slate-500 font-mono">
                        Biarkan kosong untuk otomatis memakai cover projek.
                      </p>
                    </div>
                  )}

                  {/* CHART INFO BOX */}
                  {activeSlide.visualType === 'chart' && (
                    <div className={`text-[10px] leading-normal font-mono select-none py-2 text-center ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      📈 Renders a beautiful KPI compared performance timeline bar chart reflecting metrics audit automatically on your presentation slides.
                    </div>
                  )}

                  {/* TEXT QUOTE INFO BOX */}
                  {activeSlide.visualType === 'text' && (
                    <div className={`text-[10px] leading-normal font-mono select-none py-2 text-center ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      ✍️ Displays a gorgeous italic editorial quote callout signed in your profile name, boosting executive confidence index instantly.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={`text-center py-16 font-mono text-xs border border-dashed rounded-xl select-none ${theme === 'dark' ? 'text-slate-500 border-slate-800 bg-slate-900/10' : 'text-slate-500 border-slate-300 bg-slate-50/20'}`}>
              Pilih salindia di panel kiri untuk membuka form edit tulisan &amp; visual.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
