import React from 'react';
import {
  CVData,
  EducationItem,
  Experience,
  CaseStudy,
  PersonalityItem,
  HobbyItem,
  CareerGoalItem,
} from '../../../types';
import {
  ProfileEditorPanel,
  AboutStoryEditorPanel,
  ProjectsEditorPanel,
  SkillsEditorPanel,
  ExperienceEditorPanel,
  ContactEditorPanel,
  SubpagesEditorPanel,
} from '../panels/content';

interface DrawerContentBodyProps {
  currentCategory: string;
  localData: CVData;
  handleUpdate: (updater: (prev: CVData) => CVData) => void;
  editLang: 'id' | 'en';
  getWebText: (key: string, targetLang: 'id' | 'en') => string;
  handleWebTextChange: (key: string, value: string, targetLang?: 'id' | 'en') => void;
  renderAiButton: (
    fieldLabel: string,
    currentValue: string,
    onApply: (text: string) => void,
    contextHint?: string
  ) => React.ReactNode;
  renderColorControls: (
    lightKey: string,
    darkKey: string,
    label?: string,
    defaultLightHex?: string,
    defaultDarkHex?: string
  ) => React.ReactNode;
  inputClass: string;
  textareaClass: string;
  cardBg: string;
  isDark: boolean;
  theme: 'light' | 'dark';
  showMarkdownGuide: boolean;
  setShowMarkdownGuide: (show: boolean) => void;
  setActiveTab: (tab: string) => void;
  updateBilingualItem: <T extends { id?: string | number }>(
    listKey: keyof CVData,
    baseId: string,
    targetLang: 'id' | 'en',
    field: string,
    value: any
  ) => void;
  updateBilingualSkillSvg: (baseId: string, customSvg: string, svgUrl: string) => void;
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

export const DrawerContentBody: React.FC<DrawerContentBodyProps> = ({
  currentCategory,
  localData,
  handleUpdate,
  editLang,
  getWebText,
  handleWebTextChange,
  renderAiButton,
  renderColorControls,
  inputClass,
  textareaClass,
  cardBg,
  isDark,
  theme,
  showMarkdownGuide,
  setShowMarkdownGuide,
  setActiveTab,
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
    <>
      {currentCategory.startsWith('subpage_') && (
        <SubpagesEditorPanel
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
          getSubpageSections={itemHandlers.getSubpageSections}
          handleAddSubpageSection={itemHandlers.handleAddSubpageSection}
          handleRemoveSubpageSection={itemHandlers.handleRemoveSubpageSection}
          bilingualEducation={bilingualEducation}
          bilingualPersonality={bilingualPersonality}
          bilingualHobbies={bilingualHobbies}
          bilingualCareerGoals={bilingualCareerGoals}
          updateBilingualItem={updateBilingualItem}
          handleAddEducation={itemHandlers.handleAddEdu}
          handleRemoveEducation={itemHandlers.handleRemoveEdu}
          handleAddPersonality={itemHandlers.handleAddPersonality}
          handleRemovePersonality={itemHandlers.handleRemovePersonality}
          handleAddHobby={itemHandlers.handleAddHobby}
          handleRemoveHobby={itemHandlers.handleRemoveHobby}
          handleAddCareerGoal={itemHandlers.handleAddCareerGoal}
          handleRemoveCareerGoal={itemHandlers.handleRemoveCareerGoal}
          handleRemoveCustomSubPage={itemHandlers.handleRemoveCustomSubPage}
          setSubpageTranslateModalState={setSubpageTranslateModalState}
        />
      )}

      {currentCategory === 'about_story' && (
        <AboutStoryEditorPanel
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
          handleAddCustomSubPage={itemHandlers.handleAddCustomSubPage}
          handleRemoveCustomSubPage={itemHandlers.handleRemoveCustomSubPage}
          setActiveTab={setActiveTab}
        />
      )}

      {currentCategory === 'projects' && (
        <ProjectsEditorPanel
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
          bilingualProjects={bilingualProjects}
          updateBilingualItem={updateBilingualItem}
        />
      )}

      {currentCategory === 'skills' && (
        <SkillsEditorPanel
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
          updateBilingualItem={updateBilingualItem}
          updateBilingualSkillSvg={updateBilingualSkillSvg}
        />
      )}

      {currentCategory === 'experiences' && (
        <ExperienceEditorPanel
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
          bilingualExperiences={bilingualExperiences}
          handleAddExperience={itemHandlers.handleAddExperience}
          handleMoveExperience={itemHandlers.handleMoveExperience}
          handleDuplicateExperience={itemHandlers.handleDuplicateExperience}
          handleRemoveExperience={itemHandlers.handleRemoveExperience}
          handleUpdateExperienceDates={itemHandlers.handleUpdateExperienceDates}
          handleManualExperiencePeriodChange={itemHandlers.handleManualExperiencePeriodChange}
          handleAddBulletPoint={itemHandlers.handleAddBulletPoint}
          handleRemoveBulletPoint={itemHandlers.handleRemoveBulletPoint}
          handleUpdateBulletPoint={itemHandlers.handleUpdateBulletPoint}
          updateBilingualItem={updateBilingualItem}
          setExpTranslateModalState={setExpTranslateModalState}
          setJobAiModalState={setJobAiModalState}
        />
      )}

      {currentCategory === 'contact' && (
        <ContactEditorPanel
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
        />
      )}

      {(currentCategory === 'hero' || currentCategory === 'general_identity') && (
        <ProfileEditorPanel
          category={currentCategory as 'hero' | 'general_identity'}
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
        />
      )}
    </>
  );
};
