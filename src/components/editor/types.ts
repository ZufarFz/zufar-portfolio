import React from 'react';
import { CVData } from '../../types';

export const SOCIAL_PLATFORM_PRESETS = [
  { id: 'linkedin', name: 'LinkedIn', placeholder: 'muhammad-zufar-fauzi', urlPrefix: 'linkedin.com/in/' },
  { id: 'github', name: 'GitHub', placeholder: 'ZufarFz', urlPrefix: 'github.com/' },
  { id: 'whatsapp', name: 'WhatsApp', placeholder: '085123333230 / 6285...', urlPrefix: 'wa.me/' },
  { id: 'instagram', name: 'Instagram', placeholder: 'Zuf.Fz_', urlPrefix: 'instagram.com/' },
  { id: 'email', name: 'Email', placeholder: 'contact@domain.com', urlPrefix: 'mailto:' },
  { id: 'website', name: 'Website / Portfolio', placeholder: 'https://portfolio-zufar.netlify.app', urlPrefix: '' },
  { id: 'x', name: 'X / Twitter', placeholder: '@username', urlPrefix: 'x.com/' },
  { id: 'youtube', name: 'YouTube', placeholder: '@channel', urlPrefix: 'youtube.com/' },
  { id: 'tiktok', name: 'TikTok', placeholder: '@username', urlPrefix: 'tiktok.com/@' },
  { id: 'telegram', name: 'Telegram', placeholder: 'username', urlPrefix: 't.me/' },
  { id: 'discord', name: 'Discord', placeholder: 'discord.gg/invite', urlPrefix: 'discord.gg/' },
  { id: 'medium', name: 'Medium', placeholder: '@username', urlPrefix: 'medium.com/@' },
  { id: 'threads', name: 'Threads', placeholder: 'username', urlPrefix: 'threads.net/@' },
  { id: 'facebook', name: 'Facebook', placeholder: 'profile_name', urlPrefix: 'facebook.com/' },
  { id: 'dribbble', name: 'Dribbble', placeholder: 'username', urlPrefix: 'dribbble.com/' },
  { id: 'behance', name: 'Behance', placeholder: 'username', urlPrefix: 'behance.net/' },
  { id: 'gitlab', name: 'GitLab', placeholder: 'username', urlPrefix: 'gitlab.com/' },
  { id: 'stackoverflow', name: 'Stack Overflow', placeholder: 'users/12345/name', urlPrefix: 'stackoverflow.com/' },
  { id: 'bluesky', name: 'Bluesky', placeholder: 'username.bsky.social', urlPrefix: 'bsky.app/profile/' },
  { id: 'slack', name: 'Slack', placeholder: 'workspace-name', urlPrefix: 'slack.com/' },
  { id: 'custom', name: 'Platform Lainnya', placeholder: 'https://...', urlPrefix: '' }
];

export type EditorMode = 'id' | 'en' | 'assets' | 'social';
export type AssetTab = 'templates' | 'bg_patterns' | 'floating_assets' | 'bg_shadows' | 'bg_colors' | 'images' | 'idcard' | 'gooey_cursor';
export type SocialCvSubTab = 'socials' | 'methodology_cv' | 'cv_layout';

export interface QuickEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  onUpdateCV: (updated: CVData) => void;
  currentLang: 'id' | 'en';
  activeSection: string;
  aboutSubPage?: string;
  isStoryView?: boolean;
  activeProjectPresentationId?: string | null;
  theme: 'light' | 'dark';
  previewDevice?: 'desktop' | 'mobile';
  onTogglePreviewDevice?: (device: 'desktop' | 'mobile') => void;
}

export interface ContentPanelBaseProps {
  localData: CVData;
  setLocalData: React.Dispatch<React.SetStateAction<CVData>>;
  handleUpdate: (updater: (prev: CVData) => CVData) => void;
  editLang: 'id' | 'en';
  isDark: boolean;
  getWebText: (key: string, targetLang: 'id' | 'en') => string;
  handleWebTextChange: (key: string, value: string, targetLang: 'id' | 'en') => void;
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
}
