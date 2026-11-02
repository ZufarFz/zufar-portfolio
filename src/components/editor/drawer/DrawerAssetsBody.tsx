import React from 'react';
import { CVData } from '../../../types';
import { AssetTab } from '../types';
import ThemeTemplateStudio from '../ThemeTemplateStudio';
import {
  BackgroundPatternPanel,
  FloatingAssetsPanel,
  ThemeColorsPanel,
  ThemeShadowsPanel,
  ImagesBannersPanel,
  IdCardPhysicsPanel,
  GooeyCursorPanel,
} from '../panels/design';

interface DrawerAssetsBodyProps {
  assetTab: AssetTab;
  localData: CVData;
  activeBgSection: string;
  setActiveBgSection: (sec: string) => void;
  isDark: boolean;
  theme: 'light' | 'dark';
  editLang: 'id' | 'en';
  cardBg: string;
  inputClass: string;
  appliedAllNotice: boolean;
  setAppliedAllNotice: (notice: boolean) => void;
  activeDeviceMode: 'desktop' | 'mobile';
  handleSetDeviceMode: (mode: 'desktop' | 'mobile') => void;
  handleUpdate: (updater: (prev: CVData) => CVData) => void;
  handleWebTextChange: (key: string, value: string, targetLang?: 'id' | 'en') => void;
  renderColorControls: (
    lightKey: string,
    darkKey: string,
    label?: string,
    defaultLightHex?: string,
    defaultDarkHex?: string
  ) => React.ReactNode;
  assetHandlers: {
    handleApplyBgPatternToAll: () => void;
    handleApplyThemeTemplate: (patch: Record<string, string>, themeAccent?: string) => void;
    handleApplyLayoutTemplate: (layout: any) => void;
    handleApplyFullZenPreset: () => void;
    handleAddSingleAsset: (asset: any) => void;
    handleAddFloatingAsset: (preset?: any) => void;
    handleUpdateFloatingAsset: (id: string, field: any, value: any) => void;
    handleCopyFromDesktop: (id: string) => void;
    handleRemoveFloatingAsset: (id: string) => void;
  };
  uploadFileToStorage: (file: File) => Promise<string>;
  handleImageFileUpload: (e: React.ChangeEvent<HTMLInputElement>, field: keyof CVData) => Promise<void>;
  handleWebTextImageUpload: (e: React.ChangeEvent<HTMLInputElement>, key: string) => Promise<void>;
  setEditorMode: (mode: any) => void;
  setActiveTab: (tab: string) => void;
  setAssetTab: (tab: AssetTab) => void;
}

export const DrawerAssetsBody: React.FC<DrawerAssetsBodyProps> = ({
  assetTab,
  localData,
  activeBgSection,
  setActiveBgSection,
  isDark,
  theme,
  editLang,
  cardBg,
  inputClass,
  appliedAllNotice,
  setAppliedAllNotice,
  activeDeviceMode,
  handleSetDeviceMode,
  handleUpdate,
  handleWebTextChange,
  renderColorControls,
  assetHandlers,
  uploadFileToStorage,
  handleImageFileUpload,
  handleWebTextImageUpload,
  setEditorMode,
  setActiveTab,
  setAssetTab,
}) => {
  return (
    <div className="space-y-6">
      {assetTab === 'templates' && (
        <ThemeTemplateStudio
          cvData={localData}
          activeSection={activeBgSection}
          isDark={isDark}
          onApplyTheme={assetHandlers.handleApplyThemeTemplate}
          onApplyLayout={assetHandlers.handleApplyLayoutTemplate}
          onApplyFullZenPreset={assetHandlers.handleApplyFullZenPreset}
          onAddSingleAsset={assetHandlers.handleAddSingleAsset}
        />
      )}
      {assetTab === 'bg_patterns' && (
        <BackgroundPatternPanel
          localData={localData}
          activeBgSection={activeBgSection}
          setActiveBgSection={setActiveBgSection}
          handleApplyBgPatternToAll={assetHandlers.handleApplyBgPatternToAll}
          appliedAllNotice={appliedAllNotice}
          handleWebTextChange={handleWebTextChange}
          editLang={editLang}
          isDark={isDark}
          cardBg={cardBg}
          theme={theme}
        />
      )}
      {assetTab === 'floating_assets' && (
        <FloatingAssetsPanel
          localData={localData}
          activeDeviceMode={activeDeviceMode}
          handleSetDeviceMode={handleSetDeviceMode}
          handleAddFloatingAsset={assetHandlers.handleAddFloatingAsset}
          handleUpdateFloatingAsset={assetHandlers.handleUpdateFloatingAsset}
          handleRemoveFloatingAsset={assetHandlers.handleRemoveFloatingAsset}
          handleCopyFromDesktop={assetHandlers.handleCopyFromDesktop}
          uploadFileToStorage={uploadFileToStorage}
          cardBg={cardBg}
          inputClass={inputClass}
        />
      )}
      {assetTab === 'bg_colors' && (
        <ThemeColorsPanel
          localData={localData}
          activeBgSection={activeBgSection}
          setActiveBgSection={setActiveBgSection}
          handleUpdate={handleUpdate}
          handleWebTextChange={handleWebTextChange}
          appliedAllNotice={appliedAllNotice}
          setAppliedAllNotice={setAppliedAllNotice}
          editLang={editLang}
          isDark={isDark}
          cardBg={cardBg}
          inputClass={inputClass}
        />
      )}
      {assetTab === 'bg_shadows' && (
        <ThemeShadowsPanel
          localData={localData}
          activeBgSection={activeBgSection}
          setActiveBgSection={setActiveBgSection}
          handleUpdate={handleUpdate}
          handleWebTextChange={handleWebTextChange}
          appliedAllNotice={appliedAllNotice}
          setAppliedAllNotice={setAppliedAllNotice}
          editLang={editLang}
          cardBg={cardBg}
          inputClass={inputClass}
        />
      )}
      {assetTab === 'images' && (
        <ImagesBannersPanel
          localData={localData}
          activeBgSection={activeBgSection}
          setActiveBgSection={setActiveBgSection}
          handleUpdate={handleUpdate}
          handleWebTextChange={handleWebTextChange}
          handleWebTextImageUpload={handleWebTextImageUpload}
          handleImageFileUpload={handleImageFileUpload}
          uploadFileToStorage={uploadFileToStorage}
          setEditorMode={setEditorMode}
          setActiveTab={setActiveTab}
          setAssetTab={setAssetTab}
          editLang={editLang}
          isDark={isDark}
          cardBg={cardBg}
          inputClass={inputClass}
        />
      )}
      {assetTab === 'idcard' && (
        <IdCardPhysicsPanel
          localData={localData}
          handleUpdate={handleUpdate}
          cardBg={cardBg}
          inputClass={inputClass}
        />
      )}
      {assetTab === 'gooey_cursor' && (
        <GooeyCursorPanel
          localData={localData}
          handleWebTextChange={handleWebTextChange}
          editLang={editLang}
          cardBg={cardBg}
          renderColorControls={renderColorControls}
        />
      )}
    </div>
  );
};

