export const brandColors: Record<string, string> = {
  github: '#181717',
  email: '#EA4335',
  facebook: '#1877F2',
  fb: '#1877F2',
  website: '#0EA5E9',
  linkedin: '#0A66C2',
  instagram: '#E4405F',
  youtube: '#FF0000',
  pinterest: '#BD081C',
  tiktok: '#000000',
  whatsapp: '#25D366',
  telegram: '#26A5E4',
  snapchat: '#FFFC00',
  reddit: '#FF4500',
  wechat: '#07C160',
  kuaishou: '#FF4E00',
  sinaweibo: '#DF242A',
  qq: '#1296DB',
  line: '#06C755',
  discord: '#5865F2',
  twitch: '#9146FF',
  x: '#000000',
  threads: '#000000',
  tumblr: '#36465D',
  mastodon: '#6364FF',
  bluesky: '#0285FF',
  viber: '#7360F2',
  signal: '#3A76F0',
  skype: '#00AFF0',
  imo: '#004EFF',
  quora: '#B92B27',
  nextdoor: '#00B55A',
  bereal: '#000000',
  lemon8: '#FFDD00',
  younow: '#6BC429',
  likee: '#FF2A7A',
  triller: '#000000',
  kakaotalk: '#FFEB00',
  teams: '#464EB8',
  zoom: '#2D8CFF',
  slack: '#4A154B',
  clubhouse: '#F48024'
};

export function getAbsoluteSocialUrl(value: string | undefined, platformName: string): string {
  if (!value) return '';
  const trimmed = value.trim();
  
  if (
    trimmed.startsWith('http://') || 
    trimmed.startsWith('https://') || 
    trimmed.startsWith('mailto:') || 
    trimmed.startsWith('tel:') || 
    trimmed.startsWith('skype:') || 
    trimmed.startsWith('viber:')
  ) {
    return trimmed;
  }

  const norm = platformName.toLowerCase().trim().replace(/\s+/g, '');

  switch (norm) {
    case 'email':
    case 'mailto':
      return `mailto:${trimmed}`;

    case 'facebook':
    case 'fb':
      return `https://facebook.com/${trimmed}`;
    
    case 'linkedin':
      if (trimmed.includes('linkedin.com')) {
        return `https://${trimmed}`;
      }
      return `https://linkedin.com/in/${trimmed}`;

    case 'instagram':
    case 'ig':
      if (trimmed.includes('instagram.com')) {
        return `https://${trimmed}`;
      }
      return `https://instagram.com/${trimmed}`;

    case 'youtube':
    case 'yt':
      return `https://youtube.com/${trimmed.startsWith('@') ? trimmed : `@${trimmed}`}`;

    case 'pinterest':
      return `https://pinterest.com/${trimmed}`;

    case 'tiktok':
      return `https://tiktok.com/${trimmed.startsWith('@') ? trimmed : `@${trimmed}`}`;

    case 'whatsapp':
      if (trimmed.toLowerCase().includes('wa.me') || trimmed.toLowerCase().includes('whatsapp.com')) {
        return `https://${trimmed}`;
      }
      let cleanNum = trimmed.replace(/[^\d]/g, '');
      if (cleanNum.startsWith('0')) {
        cleanNum = '62' + cleanNum.slice(1);
      }
      return `https://wa.me/${cleanNum}`;

    case 'telegram':
      return `https://t.me/${trimmed.startsWith('@') ? trimmed.slice(1) : trimmed}`;

    case 'snapchat':
      return `https://snapchat.com/add/${trimmed}`;

    case 'reddit':
      return `https://reddit.com/user/${trimmed}`;

    case 'wechat':
      return `https://wechat.com`;

    case 'kuaishou':
      return `https://kuaishou.com/profile/${trimmed}`;

    case 'weibo':
    case 'sinaweibo':
      return `https://weibo.com/${trimmed}`;

    case 'qq':
      return `http://wpa.qq.com/msgrd?v=3&uin=${trimmed}&site=qq&menu=yes`;

    case 'line':
      return `https://line.me/ti/p/~${trimmed}`;

    case 'discord':
      return `https://discord.com`;

    case 'twitch':
      return `https://twitch.tv/${trimmed}`;

    case 'x':
      return `https://x.com/${trimmed.startsWith('@') ? trimmed.slice(1) : trimmed}`;

    case 'threads':
      return `https://threads.net/${trimmed.startsWith('@') ? trimmed : `@${trimmed}`}`;

    case 'tumblr':
      return `https://${trimmed}.tumblr.com`;

    case 'mastodon':
      if (trimmed.includes('@')) {
        const parts = trimmed.split('@').filter(Boolean);
        if (parts.length === 2) {
          return `https://${parts[1]}/@${parts[0]}`;
        }
      }
      return `https://mastodon.social/@${trimmed}`;

    case 'bluesky':
      return `https://bsky.app/profile/${trimmed}`;

    case 'viber':
      return `viber://chat?number=${trimmed}`;

    case 'signal':
      return `https://signal.me/#p/${trimmed}`;

    case 'skype':
      return `skype:${trimmed}?chat`;

    case 'imo':
      return `https://imo.im`;

    case 'quora':
      return `https://quora.com/profile/${trimmed}`;

    case 'nextdoor':
      return `https://nextdoor.com`;

    case 'bereal':
      return `https://bereal.app/user/${trimmed}`;

    case 'lemon8':
      return `https://lemon8-app.com/${trimmed}`;

    case 'younow':
      return `https://younow.com/${trimmed}`;

    case 'likee':
      return `https://likee.video/${trimmed.startsWith('@') ? trimmed : `@${trimmed}`}`;

    case 'triller':
      return `https://triller.co/${trimmed.startsWith('@') ? trimmed : `@${trimmed}`}`;

    case 'kakaotalk':
      return `https://pf.kakao.com/_${trimmed}`;

    case 'teams':
      return `https://teams.microsoft.com`;

    case 'zoom':
      return `https://zoom.us/j/${trimmed}`;

    case 'slack':
      return trimmed.includes('.slack.com') ? `https://${trimmed}` : `https://${trimmed}.slack.com`;

    case 'clubhouse':
      return `https://clubhouse.com/${trimmed.startsWith('@') ? trimmed : `@${trimmed}`}`;

    case 'github':
      return trimmed.includes('github.com') ? `https://${trimmed}` : `https://github.com/${trimmed}`;

    default:
      return `https://${trimmed}`;
  }
}
