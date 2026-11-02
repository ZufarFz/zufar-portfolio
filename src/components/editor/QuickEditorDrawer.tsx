import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CVData } from '../../types';
import { getBilingualPairs } from './editorUtils';
import { QuickEditorDrawerProps, EditorMode, AssetTab, SocialCvSubTab } from './types';
import { useFloatingWindow } from './drawer/useFloatingWindow';
import { DrawerHeader } from './drawer/DrawerHeader';
import { DrawerTabBar } from './drawer/DrawerTabBar';
import { DrawerAssetTabBar } from './drawer/DrawerAssetTabBar';
import { DrawerFooter } from './drawer/DrawerFooter';
import { DrawerBodyRouter } from './drawer/DrawerBodyRouter';
import { useDrawerRouting } from './drawer/useDrawerRouting';
import { useDrawerModalsManager } from './drawer/useDrawerModalsManager';
import { createDrawerItemHandlers } from './drawer/drawerItemHandlers';
import { createDrawerAssetHandlers } from './drawer/drawerAssetHandlers';
import { createDrawerWebTextHelpers } from './drawer/drawerWebTextHandlers';
import { uploadFileToStorage } from '../../lib/storage';

export const QuickEditorDrawer: React.FC<QuickEditorDrawerProps> = ({
  isOpen,
  onClose,
  cvData,
  onUpdateCV,
  currentLang,
  activeSection,
  aboutSubPage,
  isStoryView,
  activeProjectPresentationId,
  theme,
  previewDevice = 'desktop',
  onTogglePreviewDevice,
}) => {
  const isDark = theme === 'dark';
  const [localData, setLocalData] = useState<CVData>(cvData);
  const [editLang, setEditLang] = useState<'id' | 'en'>(currentLang);
  const [editorMode, setEditorMode] = useState<EditorMode>('id');
  const [assetTab, setAssetTab] = useState<AssetTab>('templates');
  const [activeBgSection, setActiveBgSection] = useState<string>('home');
  const [activeDeviceMode, setActiveDeviceMode] = useState<'desktop' | 'mobile'>(() => {
    if (previewDevice === 'mobile') return 'mobile';
    if (typeof window !== 'undefined' && window.innerWidth < 768) return 'mobile';
    return 'desktop';
  });
  const [appliedAllNotice, setAppliedAllNotice] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [activeTab, setActiveTab] = useState('auto');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMarkdownGuide, setShowMarkdownGuide] = useState(false);
  const [socialCvSubTab, setSocialCvSubTab] = useState<SocialCvSubTab>('socials');

  const {
    isFloating,
    setIsFloating,
    isMinimizedFloating,
    setIsMinimizedFloating,
    floatingPos,
    setFloatingPos,
    handleHeaderMouseDown,
  } = useFloatingWindow();

  const localDataRef = useRef<CVData>(cvData);
  useEffect(() => {
    localDataRef.current = cvData;
    setLocalData(cvData);
  }, [cvData]);

  useEffect(() => {
    if (previewDevice && previewDevice !== activeDeviceMode) {
      setActiveDeviceMode(previewDevice);
    }
  }, [previewDevice]);

  useEffect(() => {
    if (isOpen) {
      setEditLang(currentLang);
      if (editorMode !== 'assets') {
        setEditorMode(currentLang);
      }
    }
  }, [isOpen, currentLang]);

  const handleUpdate = (updater: (prev: CVData) => CVData) => {
    const updated = updater(localDataRef.current);
    localDataRef.current = updated;
    setLocalData(updated);
    onUpdateCV(updated);
  };

  const handleSetDeviceMode = (device: 'desktop' | 'mobile') => {
    setActiveDeviceMode(device);
    if (onTogglePreviewDevice) onTogglePreviewDevice(device);
  };

  const {
    getWebText,
    handleWebTextChange,
    renderColorControls,
    updateBilingualSkillSvg,
    updateBilingualItem,
  } = createDrawerWebTextHelpers(localData, handleUpdate, editLang);

  const modalsManager = useDrawerModalsManager({
    localData,
    handleUpdate,
    updateBilingualItem,
    editLang,
    theme,
  });

  const itemHandlers = createDrawerItemHandlers(localData, handleUpdate, editLang);
  const assetHandlers = createDrawerAssetHandlers(localData, handleUpdate, activeBgSection, editLang, setAppliedAllNotice);

  const {
    detectedCategory,
    currentCategory,
    getBgSectionForCategory,
    handleImageFileUpload,
    handleWebTextImageUpload,
    handleSave,
  } = useDrawerRouting({
    activeProjectPresentationId,
    aboutSubPage,
    isStoryView,
    activeSection,
    activeTab,
    isOpen,
    setActiveBgSection,
    localData,
    handleUpdate,
    handleWebTextChange,
    editLang,
    setSaveStatus,
  });

  const inputClass = `w-full text-xs font-medium px-3 py-2 rounded-lg border outline-none transition-all ${
    isDark
      ? 'bg-slate-800/90 border-slate-700 focus:border-emerald-500 text-white placeholder-slate-500'
      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-800 placeholder-slate-400'
  }`;

  const textareaClass = `w-full text-xs font-medium px-3 py-2 rounded-lg border outline-none transition-all resize-y leading-relaxed ${
    isDark
      ? 'bg-slate-800/90 border-slate-700 focus:border-emerald-500 text-white placeholder-slate-500'
      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-800 placeholder-slate-400'
  }`;

  const cardBg = isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={isFloating ? { opacity: 0, scale: 0.95 } : { opacity: 0, x: 420 }}
          animate={isFloating ? { opacity: 1, scale: 1 } : { opacity: 1, x: 0 }}
          exit={isFloating ? { opacity: 0, scale: 0.95 } : { opacity: 0, x: 440 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          style={
            isFloating
              ? {
                  position: 'fixed',
                  top: `${floatingPos.y}px`,
                  left: `${floatingPos.x}px`,
                  width: isMinimizedFloating ? '340px' : isExpanded ? '720px' : '520px',
                  maxHeight: isMinimizedFloating ? '56px' : '88vh',
                  height: isMinimizedFloating ? '56px' : '720px',
                  zIndex: 100,
                }
              : undefined
          }
          className={`${
            isFloating
              ? 'fixed z-[100] shadow-2xl rounded-2xl border flex flex-col backdrop-blur-2xl transition-all duration-200 overflow-hidden ring-2 ring-emerald-500/40 shadow-emerald-950/60'
              : `fixed top-0 right-0 h-full z-[100] shadow-2xl flex flex-col border-l backdrop-blur-xl transition-all duration-200 ${
                  isExpanded ? 'w-full md:w-[720px]' : 'w-full sm:w-[480px]'
                }`
          } ${isDark ? 'bg-slate-900/95 border-slate-800 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-800'}`}
        >
          <DrawerHeader
            isFloating={isFloating}
            isMinimizedFloating={isMinimizedFloating}
            isExpanded={isExpanded}
            isDark={isDark}
            editLang={editLang}
            resetNotice={resetNotice}
            showResetConfirm={showResetConfirm}
            setShowResetConfirm={setShowResetConfirm}
            setResetNotice={setResetNotice}
            setIsFloating={setIsFloating}
            setIsMinimizedFloating={setIsMinimizedFloating}
            setIsExpanded={setIsExpanded}
            setFloatingPos={setFloatingPos}
            handleHeaderMouseDown={handleHeaderMouseDown}
            onClose={onClose}
            setLocalData={setLocalData}
            onUpdateCV={onUpdateCV}
          />

          {!isMinimizedFloating && (
            <>
              <DrawerTabBar
                editorMode={editorMode}
                setEditorMode={setEditorMode}
                editLang={editLang}
                setEditLang={setEditLang}
                socialCvSubTab={socialCvSubTab}
                setSocialCvSubTab={setSocialCvSubTab}
                activeBgSection={activeBgSection}
                setActiveBgSection={setActiveBgSection}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                detectedCategory={detectedCategory}
                getBgSectionForCategory={getBgSectionForCategory}
                localData={localData}
                isDark={isDark}
              />

              {editorMode === 'assets' && (
                <DrawerAssetTabBar
                  assetTab={assetTab}
                  setAssetTab={setAssetTab}
                  isDark={isDark}
                />
              )}

              <DrawerBodyRouter
                editorMode={editorMode}
                assetTab={assetTab}
                socialCvSubTab={socialCvSubTab}
                currentCategory={currentCategory}
                localData={localData}
                activeBgSection={activeBgSection}
                setActiveBgSection={setActiveBgSection}
                isDark={isDark}
                theme={theme}
                editLang={editLang}
                cardBg={cardBg}
                inputClass={inputClass}
                textareaClass={textareaClass}
                appliedAllNotice={appliedAllNotice}
                setAppliedAllNotice={setAppliedAllNotice}
                activeDeviceMode={activeDeviceMode}
                handleSetDeviceMode={handleSetDeviceMode}
                handleUpdate={handleUpdate}
                getWebText={getWebText}
                handleWebTextChange={handleWebTextChange}
                renderColorControls={renderColorControls}
                renderAiButton={modalsManager.renderAiButton}
                assetHandlers={assetHandlers}
                uploadFileToStorage={uploadFileToStorage}
                handleImageFileUpload={handleImageFileUpload}
                handleWebTextImageUpload={handleWebTextImageUpload}
                setEditorMode={setEditorMode}
                setActiveTab={setActiveTab}
                setAssetTab={setAssetTab}
                setMethodologyTranslateModalOpen={modalsManager.setMethodologyTranslateModalOpen}
                showMarkdownGuide={showMarkdownGuide}
                setShowMarkdownGuide={setShowMarkdownGuide}
                updateBilingualItem={updateBilingualItem}
                updateBilingualSkillSvg={updateBilingualSkillSvg}
                bilingualEducation={getBilingualPairs(localData.education)}
                bilingualPersonality={getBilingualPairs(localData.personality)}
                bilingualHobbies={getBilingualPairs(localData.hobbies)}
                bilingualCareerGoals={getBilingualPairs(localData.careerGoals)}
                bilingualProjects={getBilingualPairs(localData.caseStudies)}
                bilingualExperiences={getBilingualPairs(localData.experiences)}
                itemHandlers={itemHandlers}
                setSubpageTranslateModalState={modalsManager.setSubpageTranslateModalState}
                setExpTranslateModalState={modalsManager.setExpTranslateModalState}
                setJobAiModalState={modalsManager.setJobAiModalState}
              />

              <DrawerFooter
                onClose={onClose}
                handleSave={handleSave}
                saveStatus={saveStatus}
                isDark={isDark}
              />
            </>
          )}
        </motion.div>
      )}

      {modalsManager.renderModals()}
    </AnimatePresence>
  );
};

export default QuickEditorDrawer;
