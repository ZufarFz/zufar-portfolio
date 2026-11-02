import React, { useState, useEffect } from 'react';
import { FileCode, Upload, Code, X } from 'lucide-react';
import { ThemeSvgAsset } from '../../../data/themeAssets';

interface SvgAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAsset: ThemeSvgAsset | null;
  onSave: (assetData: {
    name: string;
    category: ThemeSvgAsset['category'];
    description: string;
    svg: string;
    defaultWidth: number;
    defaultLayer: 'bg' | 'above_image';
  }) => void;
}

export const SvgAssetModal: React.FC<SvgAssetModalProps> = ({
  isOpen,
  onClose,
  editingAsset,
  onSave
}) => {
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ThemeSvgAsset['category']>('circle');
  const [formDescription, setFormDescription] = useState('');
  const [formSvgCode, setFormSvgCode] = useState('');
  const [formDefaultWidth, setFormDefaultWidth] = useState<number>(350);
  const [formDefaultLayer, setFormDefaultLayer] = useState<'bg' | 'above_image'>('bg');
  const [uploadFileName, setUploadFileName] = useState<string>('');

  useEffect(() => {
    if (editingAsset) {
      setFormName(editingAsset.name);
      setFormCategory(editingAsset.category);
      setFormDescription(editingAsset.description);
      setFormSvgCode(editingAsset.svg);
      setFormDefaultWidth(editingAsset.defaultWidth || 300);
      setFormDefaultLayer(editingAsset.defaultLayer || 'bg');
      setUploadFileName('');
      setInputMode('paste');
    } else {
      setFormName('');
      setFormCategory('circle');
      setFormDescription('');
      setFormSvgCode('');
      setFormDefaultWidth(350);
      setFormDefaultLayer('bg');
      setUploadFileName('');
      setInputMode('upload');
    }
  }, [editingAsset, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    if (!formName) {
      const cleanName = file.name.replace(/\.svg$/i, '').replace(/[-_]/g, ' ');
      setFormName(cleanName);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setFormSvgCode(content.trim());
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSvgCode.trim()) {
      alert('Mohon isi nama aset dan pastikan kode SVG tidak kosong!');
      return;
    }

    onSave({
      name: formName.trim(),
      category: formCategory,
      description: formDescription.trim(),
      svg: formSvgCode.trim(),
      defaultWidth: Number(formDefaultWidth) || 300,
      defaultLayer: formDefaultLayer
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-sm text-white">
              {editingAsset ? 'Edit Aset SVG' : 'Tambah Aset SVG Baru'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-300">
              Cara Memasukkan Kode SVG:
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInputMode('upload')}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  inputMode === 'upload'
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File .SVG</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode('paste')}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  inputMode === 'paste'
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Paste Kode SVG Manual</span>
              </button>
            </div>
          </div>

          {inputMode === 'upload' && (
            <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-center space-y-2">
              <Upload className="w-7 h-7 text-emerald-400 mx-auto" />
              <div>
                <span className="text-xs font-bold text-slate-200 block">Pilih File SVG dari Komputer</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Mendukung format gambar vector .svg</span>
              </div>
              <input
                type="file"
                accept=".svg"
                onChange={handleFileUpload}
                className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
              />
              {uploadFileName && (
                <p className="text-[10px] text-emerald-400 font-mono">File terpilih: {uploadFileName}</p>
              )}
            </div>
          )}

          {(inputMode === 'paste' || formSvgCode) && (
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-300">
                Kode String SVG (&lt;svg...&gt;):
              </label>
              <textarea
                rows={5}
                value={formSvgCode}
                onChange={(e) => setFormSvgCode(e.target.value)}
                placeholder="<svg viewBox='0 0 500 500'...></svg>"
                className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 font-mono text-[11px] text-emerald-300 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {formSvgCode && (
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Live Preview Aset:
              </label>
              <div className="w-full h-32 rounded-xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center overflow-hidden">
                <div
                  className="w-full h-full flex items-center justify-center [&>svg]:max-h-full [&>svg]:max-w-full [&>svg]:object-contain"
                  dangerouslySetInnerHTML={{ __html: formSvgCode }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Nama Aset:</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="contoh: Lingkaran Neon Blue"
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 text-xs focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Kategori Aset:</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 text-xs focus:border-emerald-500"
              >
                <option value="circle">⭕ Circle / Lingkaran Hero</option>
                <option value="japanese">🎴 Japanese / Zen</option>
                <option value="geometric">🔷 Geometric / Abstract</option>
                <option value="minimal">✨ Minimalist</option>
                <option value="custom">⚙️ Custom Asset</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Ukuran Default (Width px):</label>
              <input
                type="number"
                value={formDefaultWidth}
                onChange={(e) => setFormDefaultWidth(parseInt(e.target.value) || 300)}
                placeholder="350"
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 text-xs focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Posisi Layer Default:</label>
              <select
                value={formDefaultLayer}
                onChange={(e) => setFormDefaultLayer(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 text-xs focus:border-emerald-500"
              >
                <option value="bg">🖼️ Layer Belakang (Background)</option>
                <option value="above_image">✨ Layer Depan (Above Image)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Deskripsi Singkat:</label>
            <input
              type="text"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Keterangan singkat tentang ornamen aset ini..."
              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 text-xs focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              {editingAsset ? 'Simpan Perubahan' : 'Tambahkan Aset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

