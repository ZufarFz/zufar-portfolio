import React from 'react';
import { CVData } from '../../../types';
import { ID_TRANSLATIONS } from '../../../data/portfolioData';
import {
  AIAssistantModal,
  JobExperienceAiModal,
  ExperienceTranslateModal,
  SubpageItemTranslateModal,
} from '../../modals';

interface DrawerModalsProps {
  aiModalState: {
    isOpen: boolean;
    fieldLabel: string;
    currentValue: string;
    targetLang: 'id' | 'en';
    onApply: (text: string) => void;
    contextHint?: string;
  };
  setAiModalState: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      fieldLabel: string;
      currentValue: string;
      targetLang: 'id' | 'en';
      onApply: (text: string) => void;
      contextHint?: string;
    }>
  >;
  jobAiModalState: {
    isOpen: boolean;
    experienceBaseId: string;
    role: string;
    company: string;
    existingBullets: string[];
  };
  setJobAiModalState: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      experienceBaseId: string;
      role: string;
      company: string;
      existingBullets: string[];
    }>
  >;
  expTranslateModalState: {
    isOpen: boolean;
    experienceBaseId: string;
    sourceLang: 'id' | 'en';
    sourceData: {
      role: string;
      company: string;
      period: string;
      bulletPoints: string[];
    };
  };
  setExpTranslateModalState: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      experienceBaseId: string;
      sourceLang: 'id' | 'en';
      sourceData: {
        role: string;
        company: string;
        period: string;
        bulletPoints: string[];
      };
    }>
  >;
  subpageTranslateModalState: {
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
  };
  setSubpageTranslateModalState: React.Dispatch<
    React.SetStateAction<{
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
    }>
  >;
  methodologyTranslateModalOpen: boolean;
  setMethodologyTranslateModalOpen: (open: boolean) => void;
  localData: CVData;
  editLang: 'id' | 'en';
  theme: 'light' | 'dark';
  updateBilingualItem: <T extends { id?: string | number }>(
    listKey: keyof CVData,
    baseId: string,
    targetLang: 'id' | 'en',
    field: string,
    value: any
  ) => void;
  handleApplyExperienceTranslation: (
    translatedData: { role: string; company: string; period: string; bulletPoints: string[] },
    targetLang: 'id' | 'en'
  ) => void;
  handleApplySubpageTranslation: (
    translatedData: { title: string; description: string },
    targetLang: 'id' | 'en'
  ) => void;
  handleApplyMethodologyTranslation: (
    translatedData: { title: string; description: string },
    targetLang: 'id' | 'en'
  ) => void;
}

export const DrawerModals: React.FC<DrawerModalsProps> = ({
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
  localData,
  editLang,
  theme,
  updateBilingualItem,
  handleApplyExperienceTranslation,
  handleApplySubpageTranslation,
  handleApplyMethodologyTranslation,
}) => {
  return (
    <>
      {/* AI Assistant Dialog Modal */}
      <AIAssistantModal
        isOpen={aiModalState.isOpen}
        onClose={() => setAiModalState((prev) => ({ ...prev, isOpen: false }))}
        fieldLabel={aiModalState.fieldLabel}
        currentValue={aiModalState.currentValue}
        targetLang={aiModalState.targetLang}
        onApply={aiModalState.onApply}
        contextHint={aiModalState.contextHint}
      />

      {/* Dedicated Per-Job AI Assistant Modal */}
      <JobExperienceAiModal
        isOpen={jobAiModalState.isOpen}
        onClose={() => setJobAiModalState((prev) => ({ ...prev, isOpen: false }))}
        role={jobAiModalState.role}
        company={jobAiModalState.company}
        existingBullets={jobAiModalState.existingBullets}
        lang={editLang}
        isDark={theme === 'dark'}
        onApply={(newBullets) => {
          updateBilingualItem('experiences', jobAiModalState.experienceBaseId, editLang, 'bulletPoints', newBullets);
        }}
      />

      {/* Dedicated Per-Job AI Language Transfer Modal */}
      <ExperienceTranslateModal
        isOpen={expTranslateModalState.isOpen}
        onClose={() => setExpTranslateModalState((prev) => ({ ...prev, isOpen: false }))}
        experienceBaseId={expTranslateModalState.experienceBaseId}
        sourceLang={expTranslateModalState.sourceLang}
        sourceData={expTranslateModalState.sourceData}
        isDark={theme === 'dark'}
        onApply={handleApplyExperienceTranslation}
      />

      {/* Generic Subpage Item AI Language Transfer Modal */}
      <SubpageItemTranslateModal
        isOpen={subpageTranslateModalState.isOpen}
        onClose={() => setSubpageTranslateModalState((prev) => ({ ...prev, isOpen: false }))}
        baseId={subpageTranslateModalState.baseId}
        itemType={subpageTranslateModalState.itemType}
        sourceLang={subpageTranslateModalState.sourceLang}
        sourceData={subpageTranslateModalState.sourceData}
        isDark={theme === 'dark'}
        labels={subpageTranslateModalState.labels}
        onApply={handleApplySubpageTranslation}
      />

      {/* Dedicated Methodology AI Language Transfer Modal */}
      {methodologyTranslateModalOpen && (
        <SubpageItemTranslateModal
          isOpen={methodologyTranslateModalOpen}
          onClose={() => setMethodologyTranslateModalOpen(false)}
          baseId="core-methodology"
          itemType="methodology"
          sourceLang={editLang}
          sourceData={{
            title:
              editLang === 'id'
                ? localData.webTexts?.[`methodologyTitle_id`] ||
                  (localData.webTexts?.methodologyTitle && editLang === 'id' ? localData.webTexts.methodologyTitle : '') ||
                  localData.methodologyTitle ||
                  (ID_TRANSLATIONS as any).methodologyTitle ||
                  'Metodologi Utama'
                : localData.webTexts?.[`methodologyTitle_en`] ||
                  (localData.webTexts?.methodologyTitle && editLang === 'en' ? localData.webTexts.methodologyTitle : '') ||
                  localData.methodologyTitle ||
                  'Core Methodology',
            description:
              editLang === 'id'
                ? localData.webTexts?.[`methodologyText_id`] ||
                  (localData.webTexts?.methodologyText && editLang === 'id' ? localData.webTexts.methodologyText : '') ||
                  localData.methodologyText ||
                  (ID_TRANSLATIONS as any).methodologyText ||
                  ''
                : localData.webTexts?.[`methodologyText_en`] ||
                  (localData.webTexts?.methodologyText && editLang === 'en' ? localData.webTexts.methodologyText : '') ||
                  localData.methodologyText ||
                  '',
          }}
          isDark={theme === 'dark'}
          labels={{
            itemTypeName: 'Core Methodology',
            titleLabel: 'Judul Seksi Metodologi',
            descriptionLabel: 'Deskripsi & Filosofi Metodologi',
          }}
          onApply={handleApplyMethodologyTranslation}
        />
      )}
    </>
  );
};

