import React from 'react';
import { Heart, Cpu, Bookmark, Layers, GraduationCap, FileText, Sparkles } from 'lucide-react';

export interface TranslatedSubpageItemData {
  title: string;
  description: string;
}

export interface SubpageItemTranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseId: string;
  sourceLang: 'id' | 'en';
  itemType: 'personality' | 'hobby' | 'career_goal' | 'education' | 'story_slide' | 'methodology' | 'generic';
  sourceData: {
    title: string;
    description: string;
  };
  labels?: {
    itemTypeName?: string;
    titleLabel?: string;
    descriptionLabel?: string;
  };
  isDark?: boolean;
  onApply: (translatedData: TranslatedSubpageItemData, targetLang: 'id' | 'en') => void;
}

export function getItemTypeConfig(
  itemType: string,
  labels?: { itemTypeName?: string; titleLabel?: string; descriptionLabel?: string }
) {
  const map: Record<string, any> = {
    personality: {
      name: labels?.itemTypeName || 'Pilar Kepribadian',
      titleLabel: labels?.titleLabel || 'Nama Karakter / Prinsip',
      descLabel: labels?.descriptionLabel || 'Deskripsi / Refleksi Kerja',
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      gradient: 'from-emerald-600 to-teal-500',
      shadowColor: 'shadow-emerald-950/30'
    },
    hobby: {
      name: labels?.itemTypeName || 'Hobi & Minat',
      titleLabel: labels?.titleLabel || 'Nama Hobi / Aktivitas',
      descLabel: labels?.descriptionLabel || 'Deskripsi Inspirasi & Minat',
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      gradient: 'from-rose-600 to-pink-500',
      shadowColor: 'shadow-rose-950/30'
    },
    story_slide: {
      name: labels?.itemTypeName || 'Slide Cerita Sub-Halaman',
      titleLabel: labels?.titleLabel || 'Judul Lembar Cerita',
      descLabel: labels?.descriptionLabel || 'Konten Narasi & Analisis',
      icon: <Layers className="w-5 h-5 text-teal-400" />,
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      gradient: 'from-teal-600 to-emerald-500',
      shadowColor: 'shadow-teal-950/30'
    },
    career_goal: {
      name: labels?.itemTypeName || 'Target Karir',
      titleLabel: labels?.titleLabel || 'Judul Sasaran',
      descLabel: labels?.descriptionLabel || 'Rincian Target & Milestone',
      icon: <Bookmark className="w-5 h-5 text-amber-400" />,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      gradient: 'from-amber-600 to-orange-500',
      shadowColor: 'shadow-amber-950/30'
    },
    education: {
      name: labels?.itemTypeName || 'Riwayat Pendidikan',
      titleLabel: labels?.titleLabel || 'Gelar / Jurusan',
      descLabel: labels?.descriptionLabel || 'Fokus Keilmuan & Prestasi',
      icon: <GraduationCap className="w-5 h-5 text-indigo-400" />,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      gradient: 'from-indigo-600 to-blue-500',
      shadowColor: 'shadow-indigo-950/30'
    },
    methodology: {
      name: labels?.itemTypeName || 'Core Methodology (Filosofi Kerja CV)',
      titleLabel: labels?.titleLabel || 'Judul Metodologi',
      descLabel: labels?.descriptionLabel || 'Deskripsi Filosofi & Metodologi Kerja',
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      gradient: 'from-emerald-600 to-teal-500',
      shadowColor: 'shadow-emerald-950/30'
    },
    generic: {
      name: labels?.itemTypeName || 'Konten Halaman',
      titleLabel: labels?.titleLabel || 'Judul',
      descLabel: labels?.descriptionLabel || 'Deskripsi',
      icon: <FileText className="w-5 h-5 text-purple-400" />,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      gradient: 'from-purple-600 to-indigo-500',
      shadowColor: 'shadow-purple-950/30'
    }
  };

  return map[itemType] || map.generic;
}

