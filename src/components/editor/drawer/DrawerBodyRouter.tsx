import React from 'react';
import { Info } from 'lucide-react';
import { CVData } from '../../../types';
import { EditorMode, AssetTab, SocialCvSubTab } from '../types';
import { DrawerAssetsBody } from './DrawerAssetsBody';
import { DrawerSocialBody } from './DrawerSocialBody';
import { DrawerContentBody } from './DrawerContentBody';
import { DrawerMarkdownGuide } from './DrawerMarkdownGuide';

interface DrawerBodyRouterProps {
  editorMode: EditorMode;
  assetTab: AssetTab;
  socialCvSubTab: SocialCvSubTab;
  currentCategory: string;
  localData: CVData;
  activeBgSection: string;
  setActiveBgSection: (sec: string) => void;
  isDark: boolean;
  theme: 'light' | 'dark';
  editLang: 'id' | 'en';
  cardBg: string;
  inputClass: string;
  textareaClass: string;
  appliedAllNotice: boolean;
  setAppliedAllNotice: (notice: boolean) => void;
  activeDeviceMode: 'desktop' | 'mobile';
  handleSetDeviceMode: (mode: 'desktop' | 'mobile') => void;
  handleUpdate: (updater: (prev: CVData) => CVData) => void;
  getWebText: (key: string, targetLang: 'id' | 'en') => string;
  handleWebTextChange: (key: string, value: string, targetLang?: 'id' | 'en') => void;
  renderColorControls: (
    lightKey: string,
    darkKey: string,
    label?: string,
    defaultLightHex?: string,
    defaultDarkHex?: string
  ) => React.ReactNode;
  renderAiButton: (
    fieldLabel: string,
    currentValue: string,
    onApply: (text: string) => void,
    contextHint?: string
  ) => React.ReactNode;
  assetHandlers: any;
  uploadFileToStorage: (file: File) => Promise<string>;
  handleImageFileUpload: (e: React.ChangeEvent<HTMLInputElement>, field: keyof CVData) => Promise<void>;
  handleWebTextImageUpload: (e: React.ChangeEvent<HTMLInputElement>, key: string) => Promise<void>;
  setEditorMode: (mode: any) => void;
  setActiveTab: (tab: string) => void;
  setAssetTab: (tab: AssetTab) => void;
  setMethodologyTranslateModalOpen: (open: boolean) => void;
  showMarkdownGuide: boolean;
  setShowMarkdownGuide: (show: boolean) => void;
  updateBilingualItem: any;
  updateBilingualSkillSvg: any;
  bilingualEducation: any;
  bilingualPersonality: any;
  bilingualHobbies: any;
  bilingualCareerGoals: any;
  bilingualProjects: any;
  bilingualExperiences: any;
  itemHandlers: any;
  setSubpageTranslateModalState: (state: any) => void;
  setExpTranslateModalState: (state: any) => void;
  setJobAiModalState: (state: any) => void;
}

export const DrawerBodyRouter: React.FC<DrawerBodyRouterProps> = ({
  editorMode,
  assetTab,
  socialCvSubTab,
  currentCategory,
  localData,
  activeBgSection,
  setActiveBgSection,
  isDark,
  theme,
  editLang,
  cardBg,
  inputClass,
  textareaClass,
  appliedAllNotice,
  setAppliedAllNotice,
  activeDeviceMode,
  handleSetDeviceMode,
  handleUpdate,
  getWebText,
  handleWebTextChange,
  renderColorControls,
  renderAiButton,
  assetHandlers,
  uploadFileToStorage,
  handleImageFileUpload,
  handleWebTextImageUpload,
  setEditorMode,
  setActiveTab,
  setAssetTab,
  setMethodologyTranslateModalOpen,
  showMarkdownGuide,
  setShowMarkdownGuide,
  updateBilingualItem,
  updateBilingualSkillSvg,
  bilingualEducation,
  bilingualPersonality,
  bilingualHobbies,
  bilingualCareerGoals,
  bilingualProjects,
  bilingualExperiences,
  itemHandlers,
  setSubpageTranslateModalState,
  setExpTranslateModalState,
  setJobAiModalState,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
      {editorMode === 'assets' && (
        <DrawerAssetsBody
          assetTab={assetTab}
          localData={localData}
          activeBgSection={activeBgSection}
          setActiveBgSection={setActiveBgSection}
          isDark={isDark}
          theme={theme}
          editLang={editLang}
          cardBg={cardBg}
          inputClass={inputClass}
          appliedAllNotice={appliedAllNotice}
          setAppliedAllNotice={setAppliedAllNotice}
          activeDeviceMode={activeDeviceMode}
          handleSetDeviceMode={handleSetDeviceMode}
          handleUpdate={handleUpdate}
          handleWebTextChange={handleWebTextChange}
          renderColorControls={renderColorControls}
          assetHandlers={assetHandlers}
          uploadFileToStorage={uploadFileToStorage}
          handleImageFileUpload={handleImageFileUpload}
          handleWebTextImageUpload={handleWebTextImageUpload}
          setEditorMode={setEditorMode}
          setActiveTab={setActiveTab}
          setAssetTab={setAssetTab}
        />
      )}

      {editorMode === 'social' && (
        <DrawerSocialBody
          socialCvSubTab={socialCvSubTab}
          localData={localData}
          handleUpdate={handleUpdate}
          handleWebTextChange={handleWebTextChange}
          renderAiButton={renderAiButton}
          renderColorControls={renderColorControls}
          editLang={editLang}
          cardBg={cardBg}
          inputClass={inputClass}
          textareaClass={textareaClass}
          isDark={isDark}
          setMethodologyTranslateModalOpen={setMethodologyTranslateModalOpen}
        />
      )}

      {(editorMode === 'id' || editorMode === 'en') && (
        <>
          <DrawerMarkdownGuide
            showMarkdownGuide={showMarkdownGuide}
            setShowMarkdownGuide={setShowMarkdownGuide}
            editLang={editLang}
            isDark={isDark}
          />

          <DrawerContentBody
            currentCategory={currentCategory}
            localData={localData}
            handleUpdate={handleUpdate}
            editLang={editLang}
            getWebText={getWebText}
            handleWebTextChange={handleWebTextChange}
            renderAiButton={renderAiButton}
            renderColorControls={renderColorControls}
            inputClass={inputClass}
            textareaClass={textareaClass}
            cardBg={cardBg}
            isDark={isDark}
            theme={theme}
            showMarkdownGuide={showMarkdownGuide}
            setShowMarkdownGuide={setShowMarkdownGuide}
            setActiveTab={setActiveTab}
            updateBilingualItem={updateBilingualItem}
            updateBilingualSkillSvg={updateBilingualSkillSvg}
            bilingualEducation={bilingualEducation}
            bilingualPersonality={bilingualPersonality}
            bilingualHobbies={bilingualHobbies}
            bilingualCareerGoals={bilingualCareerGoals}
            bilingualProjects={bilingualProjects}
            bilingualExperiences={bilingualExperiences}
            itemHandlers={itemHandlers}
            setSubpageTranslateModalState={setSubpageTranslateModalState}
            setExpTranslateModalState={setExpTranslateModalState}
            setJobAiModalState={setJobAiModalState}
          />
        </>
      )}

      {/* Live Context Tip */}
      <div
        className={`p-3 rounded-lg border flex items-start gap-2.5 text-[11px] ${
          isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}
      >
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          {editorMode === 'assets' ? (
            <span>
              Perubahan pola background, warna tema, foto avatar, dan aset visual akan langsung ter-render secara real-time di layar. Klik <strong>"Simpan Draft"</strong> untuk menyimpan permanen.
            </span>
          ) : editorMode === 'social' ? (
            <span>
              Kelola tautan sosial media, narahubung utama, dan visibilitas di Web serta Header/Footer CV. Klik <strong>"Simpan Draft"</strong> untuk menyimpan permanen.
            </span>
          ) : (
            <span>
              Teks tersinkronisasi otomatis secara bilingual ({editLang.toUpperCase()}) dengan struktur database Admin Panel. Klik <strong>"Simpan Draft"</strong> untuk menyimpan permanen ke browser.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
