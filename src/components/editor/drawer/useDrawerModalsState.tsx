import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { CVData, Experience } from '../../../types';
import { getBilingualPairs } from '../editorUtils';

export function useDrawerModalsState(
  handleUpdate: (updater: (prev: CVData) => CVData) => void,
  updateBilingualItem: <T extends { id?: string | number }>(
    listKey: keyof CVData,
    baseId: string,
    targetLang: 'id' | 'en',
    field: string,
    value: any
  ) => void,
  editLang: 'id' | 'en'
) {
  const [methodologyTranslateModalOpen, setMethodologyTranslateModalOpen] = useState<boolean>(false);

  const [aiModalState, setAiModalState] = useState<{
    isOpen: boolean;
    fieldLabel: string;
    currentValue: string;
    targetLang: 'id' | 'en';
    onApply: (text: string) => void;
    contextHint?: string;
  }>({
    isOpen: false,
    fieldLabel: '',
    currentValue: '',
    targetLang: 'id',
    onApply: () => {},
  });

  const [jobAiModalState, setJobAiModalState] = useState<{
    isOpen: boolean;
    experienceBaseId: string;
    role: string;
    company: string;
    existingBullets: string[];
  }>({
    isOpen: false,
    experienceBaseId: '',
    role: '',
    company: '',
    existingBullets: [],
  });

  const [expTranslateModalState, setExpTranslateModalState] = useState<{
    isOpen: boolean;
    experienceBaseId: string;
    sourceLang: 'id' | 'en';
    sourceData: {
      role: string;
      company: string;
      period: string;
      bulletPoints: string[];
    };
  }>({
    isOpen: false,
    experienceBaseId: '',
    sourceLang: 'id',
    sourceData: {
      role: '',
      company: '',
      period: '',
      bulletPoints: [],
    },
  });

  const [subpageTranslateModalState, setSubpageTranslateModalState] = useState<{
    isOpen: boolean;
    baseId: string;
    listKey: keyof CVData;
    sourceLang: 'id' | 'en';
    itemType: 'personality' | 'hobby' | 'career_goal' | 'education' | 'story_slide' | 'generic';
    sourceData: {
      title: string;
      description: string;
    };
    labels?: {
      itemTypeName?: string;
      titleLabel?: string;
      descriptionLabel?: string;
    };
  }>({
    isOpen: false,
    baseId: '',
    listKey: 'personality',
    sourceLang: 'id',
    itemType: 'personality',
    sourceData: {
      title: '',
      description: '',
    },
  });

  const handleApplyExperienceTranslation = (
    translatedData: { role: string; company: string; period: string; bulletPoints: string[] },
    targetLang: 'id' | 'en'
  ) => {
    handleUpdate((prev) => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs(currentList);
      const updatedPairs = pairs.map((pair) => {
        if (pair.baseId === expTranslateModalState.experienceBaseId) {
          return {
            ...pair,
            [targetLang]: {
              ...(pair[targetLang] as Experience),
              role: translatedData.role,
              company: translatedData.company,
              period: translatedData.period,
              bulletPoints: translatedData.bulletPoints,
            },
          };
        }
        return pair;
      });

      const flatList: Experience[] = [];
      updatedPairs.forEach((p) => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return {
        ...prev,
        experiences: flatList,
      };
    });
  };

  const handleApplySubpageTranslation = (
    translatedData: { title: string; description: string },
    targetLang: 'id' | 'en'
  ) => {
    const { listKey, baseId } = subpageTranslateModalState;
    if (listKey === 'educationSections') {
      updateBilingualItem('educationSections', baseId, targetLang, 'title', translatedData.title);
      updateBilingualItem('educationSections', baseId, targetLang, 'content', translatedData.description);
    } else {
      updateBilingualItem(listKey, baseId, targetLang, 'title', translatedData.title);
      updateBilingualItem(listKey, baseId, targetLang, 'description', translatedData.description);
    }
  };

  const handleApplyMethodologyTranslation = (
    translatedData: { title: string; description: string },
    targetLang: 'id' | 'en'
  ) => {
    handleUpdate((prev) => {
      const nextTexts = { ...(prev.webTexts || {}) };
      nextTexts[`methodologyTitle_${targetLang}`] = translatedData.title;
      nextTexts[`methodologyText_${targetLang}`] = translatedData.description;
      if (editLang === targetLang) {
        nextTexts.methodologyTitle = translatedData.title;
        nextTexts.methodologyText = translatedData.description;
      }
      return {
        ...prev,
        methodologyTitle:
          editLang === targetLang ? translatedData.title : prev.methodologyTitle || translatedData.title,
        methodologyText:
          editLang === targetLang ? translatedData.description : prev.methodologyText || translatedData.description,
        webTexts: nextTexts,
      };
    });
  };

  const openAiAssistant = (
    fieldLabel: string,
    currentValue: string,
    onApply: (text: string) => void,
    targetLang: 'id' | 'en' = editLang,
    contextHint?: string
  ) => {
    setAiModalState({
      isOpen: true,
      fieldLabel,
      currentValue,
      targetLang,
      onApply,
      contextHint,
    });
  };

  const renderAiButton = (
    fieldLabel: string,
    currentValue: string,
    onApply: (text: string) => void,
    contextHint?: string
  ) => (
    <button
      type="button"
      onClick={() => openAiAssistant(fieldLabel, currentValue, onApply, editLang, contextHint)}
      title={`AI Writing Assistant: Tingkatkan ${fieldLabel}`}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r from-purple-600/25 via-indigo-600/25 to-violet-600/25 hover:from-purple-600/40 hover:to-indigo-600/40 text-purple-300 hover:text-purple-200 border border-purple-500/30 hover:border-purple-400/60 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
    >
      <Sparkles className="w-2.5 h-2.5 text-purple-400 animate-pulse" />
      <span>✨ AI Enhance</span>
    </button>
  );

  return {
    aiModalState,
    setAiModalState,
    jobAiModalState,
    setJobAiModalState,
    expTranslateModalState,
    setExpTranslateModalState,
    subpageTranslateModalState,
    setSubpageTranslateModalState,
    methodologyTranslateModalOpen,
    setMethodologyTranslateModalOpen,
    handleApplyExperienceTranslation,
    handleApplySubpageTranslation,
    handleApplyMethodologyTranslation,
    renderAiButton,
  };
}
