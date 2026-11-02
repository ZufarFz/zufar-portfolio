import {
  CVData,
  EducationItem,
  Experience,
  PersonalityItem,
  HobbyItem,
  CareerGoalItem,
  CustomSubPage,
} from '../../../types';
import { getBilingualPairs } from '../editorUtils';

export function createDrawerItemHandlers(
  localData: CVData,
  handleUpdate: (updater: (prev: CVData) => CVData) => void,
  editLang: 'id' | 'en'
) {
  const getSubpageSections = (pageKey: string) => {
    const rawList = localData.educationSections || [];
    const prefix = `${pageKey}-`;
    const filtered = rawList.filter((item) => {
      const strId = String(item.id || '');
      return strId.startsWith(prefix) || item.pageId === pageKey;
    });

    return getBilingualPairs(filtered);
  };

  const handleAddSubpageSection = (pageKey: string) => {
    const newBaseId = `${pageKey}-sec-${Date.now()}`;
    const newEnItem = {
      id: `${newBaseId}-en`,
      pageId: pageKey,
      title: 'New Section Block',
      content: 'Write detailed content for this section...',
      order: 99,
    };
    const newIdItem = {
      id: `${newBaseId}-id`,
      pageId: pageKey,
      title: 'Blok Seksi Baru',
      content: 'Tuliskan rincian konten untuk seksi ini...',
      order: 99,
    };

    handleUpdate((prev) => ({
      ...prev,
      educationSections: [...(prev.educationSections || []), newEnItem, newIdItem],
    }));
  };

  const handleRemoveSubpageSection = (baseId: string) => {
    handleUpdate((prev) => {
      const filtered = (prev.educationSections || []).filter((item) => {
        const strId = String(item.id || '');
        return strId !== baseId && strId !== `${baseId}-en` && strId !== `${baseId}-id`;
      });
      return {
        ...prev,
        educationSections: filtered,
      };
    });
  };

  const handleAddEdu = () => {
    const newBaseId = `edu-${Date.now()}`;
    const newEn: EducationItem = {
      id: `${newBaseId}-en`,
      degree: 'Bachelor of Science',
      institution: 'University Name',
      period: '2020 - 2024',
      description: 'Major and achievements description...',
    };
    const newId: EducationItem = {
      id: `${newBaseId}-id`,
      degree: 'Sarjana Sains',
      institution: 'Nama Universitas',
      period: '2020 - 2024',
      description: 'Deskripsi jurusan dan capaian akademik...',
    };

    handleUpdate((prev) => ({
      ...prev,
      education: [...(prev.education || []), newEn, newId],
    }));
  };

  const handleRemoveEdu = (baseId: string) => {
    handleUpdate((prev) => {
      const filtered = (prev.education || []).filter((item) => {
        const strId = String(item.id || '');
        return strId !== baseId && strId !== `${baseId}-en` && strId !== `${baseId}-id`;
      });
      return { ...prev, education: filtered };
    });
  };

  const handleAddExperience = () => {
    const newBaseId = `exp-${Date.now()}`;
    const newEn: Experience = {
      id: `${newBaseId}-en`,
      role: 'Job Role / Title',
      company: 'Company / Organization',
      period: 'Jan 2023 - Present',
      bulletPoints: ['Spearheaded strategic data initiatives.', 'Optimized workflow performance by 35%.'],
    };
    const newId: Experience = {
      id: `${newBaseId}-id`,
      role: 'Posisi / Jabatan',
      company: 'Nama Perusahaan / Organisasi',
      period: 'Jan 2023 - Sekarang',
      bulletPoints: ['Memimpin inisiatif data strategis.', 'Mengoptimalkan performa alur kerja hingga 35%.'],
    };

    handleUpdate((prev) => ({
      ...prev,
      experiences: [...(prev.experiences || []), newEn, newId],
    }));
  };

  const handleUpdateExperienceDates = (baseId: string, updates: any) => {
    handleUpdate((prev) => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs<Experience>(currentList);
      const updatedPairs = pairs.map((pair) => {
        if (pair.baseId === baseId) {
          return {
            ...pair,
            en: { ...pair.en, ...updates },
            id: { ...pair.id, ...updates },
          };
        }
        return pair;
      });

      const flatList: Experience[] = [];
      updatedPairs.forEach((p) => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return { ...prev, experiences: flatList };
    });
  };

  const handleManualExperiencePeriodChange = (baseId: string, text: string) => {
    handleUpdate((prev) => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs<Experience>(currentList);
      const updatedPairs = pairs.map((pair) => {
        if (pair.baseId === baseId) {
          return {
            ...pair,
            [editLang]: {
              ...pair[editLang],
              period: text,
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

      return { ...prev, experiences: flatList };
    });
  };

  const handleMoveExperience = (baseId: string, direction: 'up' | 'down') => {
    handleUpdate((prev) => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs<Experience>(currentList);
      const idx = pairs.findIndex((p) => p.baseId === baseId);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === pairs.length - 1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const updatedPairs = [...pairs];
      const temp = updatedPairs[idx];
      updatedPairs[idx] = updatedPairs[targetIdx];
      updatedPairs[targetIdx] = temp;

      const flatList: Experience[] = [];
      updatedPairs.forEach((p) => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return { ...prev, experiences: flatList };
    });
  };

  const handleRemoveExperience = (baseId: string) => {
    handleUpdate((prev) => {
      const filtered = (prev.experiences || []).filter((item) => {
        const strId = String(item.id || '');
        return strId !== baseId && strId !== `${baseId}-en` && strId !== `${baseId}-id`;
      });
      return { ...prev, experiences: filtered };
    });
  };

  const handleDuplicateExperience = (baseId: string) => {
    const pairs = getBilingualPairs<Experience>(localData.experiences);
    const pair = pairs.find((p) => p.baseId === baseId);
    if (!pair) return;
    const newBaseId = `exp-${Date.now()}`;
    const dupEn: Experience = {
      ...pair.en,
      id: `${newBaseId}-en`,
      role: `${pair.en.role} (Copy)`,
    };
    const dupId: Experience = {
      ...pair.id,
      id: `${newBaseId}-id`,
      role: `${pair.id.role} (Salinan)`,
    };

    handleUpdate((prev) => ({
      ...prev,
      experiences: [...(prev.experiences || []), dupEn, dupId],
    }));
  };

  const handleAddBulletPoint = (baseId: string, targetLang: 'id' | 'en') => {
    handleUpdate((prev) => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs<Experience>(currentList);
      const updatedPairs = pairs.map((pair) => {
        if (pair.baseId === baseId) {
          const currentBullets = pair[targetLang].bulletPoints || [];
          return {
            ...pair,
            [targetLang]: {
              ...pair[targetLang],
              bulletPoints: [...currentBullets, 'Poin pencapaian baru...'],
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

      return { ...prev, experiences: flatList };
    });
  };

  const handleUpdateBulletPoint = (
    baseId: string,
    targetLang: 'id' | 'en',
    bulletIndex: number,
    text: string
  ) => {
    handleUpdate((prev) => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs<Experience>(currentList);
      const updatedPairs = pairs.map((pair) => {
        if (pair.baseId === baseId) {
          const currentBullets = [...(pair[targetLang].bulletPoints || [])];
          currentBullets[bulletIndex] = text;
          return {
            ...pair,
            [targetLang]: {
              ...pair[targetLang],
              bulletPoints: currentBullets,
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

      return { ...prev, experiences: flatList };
    });
  };

  const handleRemoveBulletPoint = (
    baseId: string,
    targetLang: 'id' | 'en',
    bulletIndex: number
  ) => {
    handleUpdate((prev) => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs<Experience>(currentList);
      const updatedPairs = pairs.map((pair) => {
        if (pair.baseId === baseId) {
          const currentBullets = (pair[targetLang].bulletPoints || []).filter((_, i) => i !== bulletIndex);
          return {
            ...pair,
            [targetLang]: {
              ...pair[targetLang],
              bulletPoints: currentBullets,
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

      return { ...prev, experiences: flatList };
    });
  };

  const handleAddPersonality = () => {
    const newBaseId = `pers-${Date.now()}`;
    const newEn: PersonalityItem = {
      id: `${newBaseId}-en`,
      title: 'Analytical Thinker',
      description: 'Strong foundation in critical analysis.',
      icon: '🧠',
    };
    const newId: PersonalityItem = {
      id: `${newBaseId}-id`,
      title: 'Pemikir Analitis',
      description: 'Pondasi kuat dalam analisa kritis.',
      icon: '🧠',
    };

    handleUpdate((prev) => ({
      ...prev,
      personality: [...(prev.personality || []), newEn, newId],
    }));
  };

  const handleRemovePersonality = (baseId: string) => {
    handleUpdate((prev) => {
      const filtered = (prev.personality || []).filter((item) => {
        const strId = String(item.id || '');
        return strId !== baseId && strId !== `${baseId}-en` && strId !== `${baseId}-id`;
      });
      return { ...prev, personality: filtered };
    });
  };

  const handleAddHobby = () => {
    const newBaseId = `hobby-${Date.now()}`;
    const newEn: HobbyItem = {
      id: `${newBaseId}-en`,
      title: 'Photography & Exploration',
      description: 'Capturing moments and exploring landscapes.',
      icon: '📷',
    };
    const newId: HobbyItem = {
      id: `${newBaseId}-id`,
      title: 'Fotografi & Eksplorasi',
      description: 'Mengabadikan momen dan menjelajah alam.',
      icon: '📷',
    };

    handleUpdate((prev) => ({
      ...prev,
      hobbies: [...(prev.hobbies || []), newEn, newId],
    }));
  };

  const handleRemoveHobby = (baseId: string) => {
    handleUpdate((prev) => {
      const filtered = (prev.hobbies || []).filter((item) => {
        const strId = String(item.id || '');
        return strId !== baseId && strId !== `${baseId}-en` && strId !== `${baseId}-id`;
      });
      return { ...prev, hobbies: filtered };
    });
  };

  const handleAddCareerGoal = () => {
    const newBaseId = `goal-${Date.now()}`;
    const newEn: CareerGoalItem = {
      id: `${newBaseId}-en`,
      title: 'Strategic Leadership Target',
      description: 'Directing impactful technological solutions.',
    };
    const newId: CareerGoalItem = {
      id: `${newBaseId}-id`,
      title: 'Target Kepemimpinan Strategis',
      description: 'Mengarahkan solusi teknologi berbobot tinggi.',
    };

    handleUpdate((prev) => ({
      ...prev,
      careerGoals: [...(prev.careerGoals || []), newEn, newId],
    }));
  };

  const handleRemoveCareerGoal = (baseId: string) => {
    handleUpdate((prev) => {
      const filtered = (prev.careerGoals || []).filter((item) => {
        const strId = String(item.id || '');
        return strId !== baseId && strId !== `${baseId}-en` && strId !== `${baseId}-id`;
      });
      return { ...prev, careerGoals: filtered };
    });
  };

  const handleAddCustomSubPage = () => {
    const id = `page-${Date.now()}`;
    const newPage: CustomSubPage = {
      id,
      title: 'Halaman Kustom Baru',
      titleId: 'Halaman Kustom Baru',
      titleEn: 'New Custom Page',
      descriptionId: 'Tuliskan deskripsi subhalaman kustom Anda di sini.',
      descriptionEn: 'Write your custom subpage description here.',
      icon: 'Sparkles',
      order: (localData.customSubPages || []).length + 1,
      sections: [],
    };
    handleUpdate((prev) => ({
      ...prev,
      customSubPages: [...(prev.customSubPages || []), newPage],
    }));
  };

  const handleRemoveCustomSubPage = (pageId: string) => {
    handleUpdate((prev) => ({
      ...prev,
      customSubPages: (prev.customSubPages || []).filter((p) => p.id !== pageId),
    }));
  };

  return {
    getSubpageSections,
    handleAddSubpageSection,
    handleRemoveSubpageSection,
    handleAddEdu,
    handleRemoveEdu,
    handleAddExperience,
    handleUpdateExperienceDates,
    handleManualExperiencePeriodChange,
    handleMoveExperience,
    handleRemoveExperience,
    handleDuplicateExperience,
    handleAddBulletPoint,
    handleUpdateBulletPoint,
    handleRemoveBulletPoint,
    handleAddPersonality,
    handleRemovePersonality,
    handleAddHobby,
    handleRemoveHobby,
    handleAddCareerGoal,
    handleRemoveCareerGoal,
    handleAddCustomSubPage,
    handleRemoveCustomSubPage,
  };
}
