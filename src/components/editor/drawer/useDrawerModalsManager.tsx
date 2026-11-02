import React from 'react';
import { CVData } from '../../../types';
import { useDrawerModalsState } from './useDrawerModalsState';
import { DrawerModals } from './DrawerModals';

interface UseDrawerModalsManagerProps {
  localData: CVData;
  handleUpdate: (updater: (prev: CVData) => CVData) => void;
  updateBilingualItem: <T extends { id?: string | number }>(
    listKey: keyof CVData,
    baseId: string,
    targetLang: 'id' | 'en',
    field: string,
    value: any
  ) => void;
  editLang: 'id' | 'en';
  theme: 'light' | 'dark';
}

export function useDrawerModalsManager({
  localData,
  handleUpdate,
  updateBilingualItem,
  editLang,
  theme,
}: UseDrawerModalsManagerProps) {
  const modalsState = useDrawerModalsState(handleUpdate, updateBilingualItem, editLang);

  const renderModals = () => (
    <DrawerModals
      aiModalState={modalsState.aiModalState}
      setAiModalState={modalsState.setAiModalState}
      jobAiModalState={modalsState.jobAiModalState}
      setJobAiModalState={modalsState.setJobAiModalState}
      expTranslateModalState={modalsState.expTranslateModalState}
      setExpTranslateModalState={modalsState.setExpTranslateModalState}
      subpageTranslateModalState={modalsState.subpageTranslateModalState}
      setSubpageTranslateModalState={modalsState.setSubpageTranslateModalState}
      methodologyTranslateModalOpen={modalsState.methodologyTranslateModalOpen}
      setMethodologyTranslateModalOpen={modalsState.setMethodologyTranslateModalOpen}
      localData={localData}
      editLang={editLang}
      theme={theme}
      updateBilingualItem={updateBilingualItem}
      handleApplyExperienceTranslation={modalsState.handleApplyExperienceTranslation}
      handleApplySubpageTranslation={modalsState.handleApplySubpageTranslation}
      handleApplyMethodologyTranslation={modalsState.handleApplyMethodologyTranslation}
    />
  );

  return {
    ...modalsState,
    renderModals,
  };
}
