import React from 'react';
import { CVData } from '../../../types';
import { SocialCvSubTab } from '../types';
import {
  SocialLinksPanel,
  CvMethodologyPanel,
  CvLayoutEditorPanel,
} from '../panels/social';

interface DrawerSocialBodyProps {
  socialCvSubTab: SocialCvSubTab;
  localData: CVData;
  handleUpdate: (updater: (prev: CVData) => CVData) => void;
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
  editLang: 'id' | 'en';
  cardBg: string;
  inputClass: string;
  textareaClass: string;
  isDark: boolean;
  setMethodologyTranslateModalOpen: (open: boolean) => void;
}

export const DrawerSocialBody: React.FC<DrawerSocialBodyProps> = ({
  socialCvSubTab,
  localData,
  handleUpdate,
  handleWebTextChange,
  renderAiButton,
  renderColorControls,
  editLang,
  cardBg,
  inputClass,
  textareaClass,
  isDark,
  setMethodologyTranslateModalOpen,
}) => {
  return (
    <div className="space-y-6">
      {socialCvSubTab === 'socials' && (
        <SocialLinksPanel
          localData={localData}
          handleUpdate={handleUpdate}
          cardBg={cardBg}
          inputClass={inputClass}
          isDark={isDark}
        />
      )}
      {socialCvSubTab === 'methodology_cv' && (
        <CvMethodologyPanel
          localData={localData}
          handleUpdate={handleUpdate}
          handleWebTextChange={handleWebTextChange}
          renderAiButton={renderAiButton}
          renderColorControls={renderColorControls}
          editLang={editLang}
          cardBg={cardBg}
          inputClass={inputClass}
          textareaClass={textareaClass}
          setMethodologyTranslateModalOpen={setMethodologyTranslateModalOpen}
        />
      )}
      {socialCvSubTab === 'cv_layout' && (
        <CvLayoutEditorPanel
          localData={localData}
          handleUpdate={handleUpdate}
          cardBg={cardBg}
          isDark={isDark}
        />
      )}
    </div>
  );
};

