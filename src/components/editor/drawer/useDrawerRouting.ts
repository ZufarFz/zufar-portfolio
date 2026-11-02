import { useEffect } from 'react';
import { CVData } from '../../../types';
import { saveCVData, uploadFileToStorage } from '../../../lib/storage';

interface UseDrawerRoutingProps {
  activeProjectPresentationId?: string | null;
  aboutSubPage?: string;
  isStoryView?: boolean;
  activeSection: string;
  activeTab: string;
  isOpen: boolean;
  setActiveBgSection: (sec: string) => void;
  localData: CVData;
  handleUpdate: (updater: (prev: CVData) => CVData) => void;
  handleWebTextChange: (key: string, value: string, targetLang?: 'id' | 'en') => void;
  editLang: 'id' | 'en';
  setSaveStatus: (status: 'idle' | 'saving' | 'saved') => void;
}

export function useDrawerRouting({
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
}: UseDrawerRoutingProps) {
  const getDetectedCategory = (): string => {
    if (activeProjectPresentationId) return 'projects';
    if (aboutSubPage) {
      if (aboutSubPage === 'education') return 'subpage_education';
      if (aboutSubPage === 'projects') return 'subpage_projects';
      if (aboutSubPage === 'experiences' || aboutSubPage === 'career-journey') return 'subpage_career_journey';
      if (aboutSubPage === 'personality') return 'subpage_personality';
      if (aboutSubPage === 'hobbies') return 'subpage_hobbies';
      if (aboutSubPage === 'career-goals') return 'subpage_career_goals';
      if (aboutSubPage === 'skills') return 'skills';
      return `subpage_${aboutSubPage}`;
    }
    if (isStoryView) return 'about_story';
    if (activeSection === 'projects') return 'projects';
    if (activeSection === 'skills') return 'skills';
    if (activeSection === 'experience') return 'experiences';
    if (activeSection === 'contact') return 'contact';
    return 'hero';
  };

  const detectedCategory = getDetectedCategory();
  const currentCategory = activeTab === 'auto' ? detectedCategory : activeTab;

  const getBgSectionForCategory = (cat: string): string => {
    if (cat.startsWith('subpage_')) {
      if (['subpage_education', 'subpage_personality', 'subpage_hobbies', 'subpage_career_goals'].includes(cat)) {
        return cat.replace('subpage_', 'about_subpage_');
      }
      return cat;
    }
    switch (cat) {
      case 'subpage_career_journey':
      case 'experiences':
        return 'experience';
      case 'subpage_projects':
      case 'projects':
        return 'projects';
      case 'about_story':
        return 'about_story';
      case 'skills':
        return 'skills';
      case 'contact':
        return 'contact';
      case 'hero':
      default:
        return 'home';
    }
  };

  useEffect(() => {
    const targetCat = activeTab === 'auto' ? detectedCategory : activeTab;
    setActiveBgSection(getBgSectionForCategory(targetCat));
  }, [detectedCategory, activeTab, isOpen]);

  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: keyof CVData
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await uploadFileToStorage(file);
      handleUpdate((prev) => ({ ...prev, [targetField]: base64 }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleWebTextImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetKey: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await uploadFileToStorage(file);
      handleWebTextChange(targetKey, base64, editLang);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      saveCVData(localData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (err) {
      console.error(err);
      setSaveStatus('idle');
    }
  };

  return {
    detectedCategory,
    currentCategory,
    getBgSectionForCategory,
    handleImageFileUpload,
    handleWebTextImageUpload,
    handleSave,
  };
}

