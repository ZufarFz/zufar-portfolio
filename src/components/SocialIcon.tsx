import React from 'react';

interface SocialIconProps {
  platform: string;
  className?: string;
  size?: number;
  useBrandColor?: boolean;
}

export default function SocialIcon({ platform, className = "w-4 h-4", size = 16, useBrandColor = false }: SocialIconProps) {
  const norm = platform.toLowerCase().trim().replace(/\s+/g, '');

  // Map platform names to their respective brand colors for optional high-contrast rendering
  const brandColors: Record<string, string> = {
    github: '#181717',
    email: '#EA4335',
    facebook: '#1877F2',
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

  const color = useBrandColor ? (brandColors[norm] || 'currentColor') : 'currentColor';
  const finalStyle = useBrandColor && color !== 'currentColor' ? { color } : undefined;

  // SVGs of all the requested platforms
  switch (norm) {
    case 'github':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      );
    case 'email':
    case 'mailto':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} style={finalStyle} className={className} width={size} height={size} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.53 12 3.53 12 3.53s-7.53 0-9.388.525A3.003 3.003 0 0 0 .502 6.163C0 8.02 0 12 0 12s0 3.98.502 5.837a3.003 3.003 0 0 0 2.11 2.108c1.858.525 9.388.525 9.388.525s7.53 0 9.388-.525a3.003 3.003 0 0 0 2.11-2.108C24 15.98 24 12 24 12s0-3.98-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case 'pinterest':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.663.967-2.902 2.162-2.902 1.02 0 1.512.765 1.512 1.682 0 1.025-.653 2.56-1.02 3.983-.284 1.197.6 2.172 1.78 2.172 2.137 0 3.78-2.257 3.78-5.51 0-2.881-2.07-4.896-5.043-4.896-3.435 0-5.452 2.577-5.452 5.24 0 1.04.4 2.15.898 2.75.1.12.11.23.08.36-.1.39-.31 1.28-.35 1.46-.05.2-.18.27-.41.16-1.55-.724-2.516-3-2.516-4.836 0-3.931 2.856-7.544 8.236-7.544 4.324 0 7.684 3.081 7.684 7.2 0 4.298-2.711 7.76-6.477 7.76-1.265 0-2.459-.659-2.864-1.442 0 0-.627 2.384-.779 2.97-.282 1.085-1.044 2.446-1.554 3.284 1.124.348 2.316.537 3.551.537 6.62 0 11.988-5.369 11.988-11.988C23.988 5.367 18.618 0 12.017 0z"/>
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08.77.41 1.5.94 2.07.67.7 1.55 1.1 2.49 1.19v3.02c-1.18-.04-2.32-.54-3.19-1.35-.1-.1-.18-.19-.26-.29v8.32a6.972 6.972 0 0 1-5.18 6.78 6.96 6.96 0 0 1-7.79-4.22 6.91 6.91 0 0 1 .49-6c1.13-1.9 3.19-3.07 5.39-3.04.04 1-.03 1.99-.02 3-.56-.03-1.12.11-1.61.38A3.877 3.877 0 0 0 6.13 13.5a3.84 3.84 0 0 0 4.09 3.57c1.78-.14 3.2-1.57 3.31-3.35.03-1.25-.01-2.5-.01-3.75V0l.01.02z"/>
        </svg>
      );
    case 'whatsapp':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.8.983 3.834 1.502 5.913 1.503h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      );
    case 'telegram':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M11.944 0C5.344 0 0 5.344 0 11.944c0 6.6 5.344 11.944 11.944 11.944 6.6 0 11.944-5.344 11.944-11.944C23.888 5.344 18.544 0 11.944 0zm5.82 8.358l-1.921 9.06c-.143.646-.525.805-1.066.5l-2.93-2.16-1.411 1.36c-.156.156-.288.288-.59.288l.21-2.973 5.413-4.887c.235-.208-.052-.324-.366-.115L8.41 13.916l-2.88-.9c-.626-.196-.639-.626.13-.93l11.264-4.34c.522-.196.978.115.748.91l.272-.298z"/>
        </svg>
      );
    case 'snapchat':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12.015 2.1c-.846 0-1.896.115-3.084.577C7.545 3.197 6.36 4.75 6.36 6.36c0 .415.093.856.3 1.258.12.242.12.392-.045.543-.377.347-1.07.844-1.356 1.423-.332.663.075 1.5.83 1.32.181-.045.362-.12.543-.226.15-.09.286-.06.392.09.21.317.558.648.966.9.15.09.21.196.196.377-.045.694-.256 1.95-.256 2.072 0 1.22 1.332 2.11 3.513 2.11s3.513-.89 3.513-2.11c0-.12-.21-1.378-.256-2.072-.015-.181.045-.286.196-.377.408-.256.755-.583.966-.9.106-.15.241-.181.392-.09.181.106.362.181.543.226.755.181 1.162-.657.83-1.32-.286-.579-.979-1.076-1.356-1.423-.166-.15-.166-.3-.045-.543.207-.402.3-.843.3-1.258 0-1.61-1.185-3.163-2.57-3.683C13.911 2.215 12.861 2.1 12.015 2.1z"/>
        </svg>
      );
    case 'reddit':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.23-1.72l1.24-3.92 4.09.88c.05 1.02.89 1.83 1.92 1.83 1.05 0 1.9-1.01 1.9-1.9s-.85-1.9-1.9-1.9c-.83 0-1.54.54-1.8 1.29l-4.51-.97c-.24-.05-.48.09-.55.33l-1.44 4.54c-2.43.06-4.68.7-6.34 1.72C5.86 9.98 4.96 9.5 4 9.5c-1.65 0-3 1.35-3 3 0 1.12.63 2.1 1.56 2.62-.03.25-.06.5-.06.76 0 4.14 4.93 7.5 11 7.5s11-3.36 11-7.5c0-.26-.03-.51-.06-.76.93-.52 1.56-1.5 1.56-2.62zm-18 2c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm11 3.5c-1.81 1.81-5.18 1.81-7 0-.19-.19-.19-.51 0-.7.19-.19.51-.19.7 0 1.43 1.43 4.18 1.43 5.6 0 .19-.19.51-.19.7 0 .19.19.19.51 0 .7zm-.5-1.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
        </svg>
      );
    case 'wechat':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M8.57 2C3.96 2 0 5.43 0 9.77c0 2.45 1.26 4.67 3.25 6.13-.19.56-.68 1.93-.72 2.05-.09.28.04.28.23.19.19-.09 2.52-1.55 3.19-1.96.84.23 1.73.35 2.62.35 1.15 0 2.25-.2 3.25-.56A8.19 8.19 0 0 1 11.5 12c0-4.42 4.03-8 9-8c.4 0 .8 0 1.2.06C19.7 4.3 14.5 2 8.57 2zm-3 5.3a1.1 1.1 0 1 0 0 2.2a1.1 1.1 0 0 0 0-2.2zm6.2 0a1.1 1.1 0 1 0 0 2.2a1.1 1.1 0 0 0 0-2.2zm9.73 4.7c-4.14 0-7.5 3.09-7.5 6.9c0 2.2 1.12 4.18 2.87 5.45-.17.51-.62 1.74-.65 1.84-.08.24.03.24.2.16.17-.08 2.25-1.39 2.85-1.75.75.2 1.54.3 2.33.3 4.14 0 7.5-3.09 7.5-6.9c0-3.81-3.36-6.9-7.5-6.9zm-2.8 3.5a1 1 0 1 1 0 2a1 1 0 0 1 0-2zm5.6 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2z"/>
        </svg>
      );
    case 'kuaishou':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.61 14.36L10.3 18.2a.53.53 0 0 1-.77-.42l-.12-4.13a1.04 1.04 0 0 1 .47-.85l2.45-1.54a.52.52 0 0 1 .79.43l-.11 4c-.01.32-.17.61-.4.81zM14.6 11c-.44 1.34-1.79 2-3.13 1.56L9 11.75V11a3 3 0 0 1 3-3h1.75l.85 3z"/>
        </svg>
      );
    case 'weibo':
    case 'sinaweibo':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M9.98 18.6c-4.14 0-7.52-1.92-7.52-4.3 0-2.45 3.5-4.22 7.74-4.22 4.12 0 7.37 1.83 7.37 4.25-.01 2.39-3.45 4.27-7.59 4.27zm6.75-9.33c-.7-.34-.94-1.12-.55-1.73a1.4 1.4 0 0 1 1.85-.45c.71.36.93 1.16.52 1.76a1.41 1.41 0 0 1-1.82.42zm2.13-2.92A7.32 7.32 0 0 0 14.5 4.38a1 1 0 1 1 .62-1.9 9.3 9.3 0 0 1 5.56 2.5a1 1 0 1 1-1.35 1.51zm3.1 3.12a10.9 10.9 0 0 0-8.91-4.72a1 1 0 1 1 .1-1.99c4.32.22 8 2.65 10.15 6.1a1 1 0 0 1-1.34.61zM11.23 12.3a1.6 1.6 0 1 0 0 3.2c.98 0 1.6-1.1 1.6-1.6s-.62-1.6-1.6-1.6z"/>
        </svg>
      );
    case 'qq':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.74 14.76c-.4 0-.82-.12-1.16-.38a2.53 2.53 0 0 1-.96-1.91c0-.13.01-.26.04-.38a3.11 3.11 0 0 1-1.18.25c-1.35 0-2.43-1.1-2.43-2.43s1.1-2.43 2.43-2.43c.4 0 .78.1 1.11.27a2.52 2.52 0 0 1 1.7-1.18c1.32-.23 2.54.67 2.76 2a2.5 2.5 0 0 1-.6 1.95c.44.45.69 1.05.69 1.7a2.53 2.53 0 0 1-2.4 2.46z"/>
        </svg>
      );
    case 'line':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M24 10.3c0-4.9-5.37-8.9-12-8.9s-12 4-12 8.9c0 4.4 4.26 8.08 10 8.75.39.08.92.26 1.06.6.12.3.08.77.04 1.08-.13.73-.42 2.94-.47 3.33-.06.34.12.5.39.33.24-.14 3.8-2.52 5.31-3.66 1.25-.94 2.18-.8 3.84-.2h.01c2.11-1.32 3.82-3.15 3.82-5.43zM6.66 13h-2a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 .5.5V11.5h1a.5.5 0 0 1 0 1zm2.34-.5a.5.5 0 0 1-.5.5h-.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 .5.5v5zm6 .5h-2.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5h2.5a.5.5 0 0 1 0 1H13v1h1.5a.5.5 0 0 1 0 1H13V11.5h1.5a.5.5 0 0 1 0 1zm-4.34 0a.5.5 0 0 1-.5-.5v-3.5l-1.5 2.5a.5.5 0 0 1-.84 0l-1.5-2.5v3.5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .84-.38L9.5 9.76l1.66-2.64A.5.5 0 0 1 12 7.5v5a.5.5 0 0 1-.34.5z"/>
        </svg>
      );
    case 'discord':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.46-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.1825 0-2.1569-1.085-2.1569-2.419 0-1.3332.9556-2.4192 2.1569-2.4192s2.175 1.086 2.157 2.419c0 1.334-.9556 2.4192-2.157 2.4192zm7.975 0c-1.1825 0-2.1569-1.085-2.1569-2.419 0-1.3332.9556-2.4192 2.1569-2.4192s2.175 1.086 2.157 2.419c0 1.334-.9556 2.4192-2.157 2.4192z"/>
        </svg>
      );
    case 'twitch':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
        </svg>
      );
    case 'x':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case 'threads':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M13.42 2.22c-5.83 0-10.22 4.15-10.22 10.04 0 5.48 4.17 9.53 9.4 9.53 2.93 0 5.25-.97 6.64-2.58l-1.39-1.25c-.94 1.15-2.6 1.83-5.06 1.83-3.9 0-7.05-2.88-7.05-7.53 0-4.8 3.03-7.57 7.78-7.57 3.32 0 5.56 1.7 5.56 4.75 0 2.1-.96 3.46-2.57 3.46-1.02 0-1.76-.75-1.76-1.92V6.92h-2.18v4.11c0 1.25-.66 1.94-1.63 1.94-.95 0-1.58-.69-1.58-1.94V6.92H8.56V11c0 3.2 1.63 4.54 4.09 4.54 1.72 0 3.1-.79 3.82-2.14.73 1.35 2.14 2.14 4.11 2.14 2.87 0 4.88-2.22 4.88-5.74 0-4.9-3.79-7.58-7.85-7.58H13.42z"/>
        </svg>
      );
    case 'tumblr':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V10h-2V7.19c2.44-.813 3.514-2.922 3.739-4.91h2.723v4.91h3.428V10h-3.428v6.71c0 1.488.665 2.505 2.15 2.505.743 0 1.554-.239 2.052-.511l.93 2.742C16.85 22.954 15.65 24 14.563 24z"/>
        </svg>
      );
    case 'mastodon':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-4.96C14.99.003 11.996 0 11.996 0h-.01s-3.003 0-5.97.352c-2.686.35-4.953 2.38-5.304 4.96C.351 7.9-.004 11.066.001 13.748c-.004 2.682.35 5.85.711 8.435.35 2.579 2.618 4.612 5.305 4.962 1.638.214 3.321.319 5.02.164 1.7-.155 3.38-.1 5.011-.157 2.687-.35 4.954-2.383 5.305-4.962.361-2.585.715-5.753.715-8.435 0-2.682-.354-5.848-.711-8.435zM12 18.52h-2.5v-6.25h-2.5v-2.5h7.5v2.5h-2.5v6.25z"/>
        </svg>
      );
    case 'bluesky':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12 10.8c-1.33-1.89-3.6-3.8-6.1-3.8C2.65 7 0 9.15 0 12.3c0 3.33 2.5 7.15 5.9 7.15 2.5 0 4.77-1.9 6.1-3.8 1.33 1.9 3.6 3.8 6.1 3.8 3.4 0 5.9-3.82 5.9-7.15C24 9.15 21.35 7 18.1 7c-2.5 0-4.77 1.91-6.1 3.8z"/>
        </svg>
      );
    case 'viber':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.5 11.5 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8zm-11.5 2.1c-.2.2-.4.1-.7-.1s-.6-.7-.8-1-.5-.5-.4-.8c.1-.2.3-.4.5-.6l.7-.7c.2-.2.5-.2.7 0l1.2 1.2c.2.2.2.5 0 .7l-.7.7z"/>
        </svg>
      );
    case 'signal':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      );
    case 'skype':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M23.3 12.1a11.16 11.16 0 0 0-1.4-5.4 6 6 0 0 0-4.6-4.6A11.16 11.16 0 0 0 11.9.7 6 6 0 0 0 4.7 4.7 11.16 11.16 0 0 0 .7 11.9a6 6 0 0 0 4 7.2 11.16 11.16 0 0 0 5.4 1.4c3 0 5.4-1.2 7.2-2.8a6 6 0 0 0 6-5.6zm-11.4 4c-3.1 0-4.6-1.7-4.6-3.2s1.3-2 2.3-2 1.6.8 2.3 1.2c.5.3.8.4 1.1.4s.8-.3.8-.8c0-.7-1-1.3-2-1.3-2.1 0-3.3 1.4-3.3 2.7 0 1.8 1.8 2.6 3.6 2.6V16.1z"/>
        </svg>
      );
    case 'imo':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm2.15 13h-4.3l-.75-2h5.8zm.75-3.5H9.1l-.81-2.2H15.7z"/>
        </svg>
      );
    case 'quora':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12.2 2C6.57 2 2 6.57 2 12.2s4.57 10.2 10.2 10.2c2.46 0 4.72-.88 6.5-2.35l2.67 2.67a1 1 0 0 0 1.41-1.41l-2.67-2.67c1.47-1.78 2.35-4.04 2.35-6.5C22.4 6.57 17.83 2 12.2 2zm0 18.2c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8c0 1.93-.68 3.7-1.81 5.1l-2.09-2.09c.56-.84.9-1.84.9-2.91 0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4c1.07 0 2.07-.34 2.91-.9l2.09 2.09c-1.4 1.13-3.17 1.81-5.1 1.81z"/>
        </svg>
      );
    case 'nextdoor':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M19.5 3H4.5A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3zM12 17H9v-5H8V9h1V8h3v1h1v3h1v5H12z"/>
        </svg>
      );
    case 'bereal':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2zm0-4h-2V7h2z"/>
        </svg>
      );
    case 'lemon8':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5a3.5 3.5 0 1 1 3.5-3.5 3.5 3.5 0 0 1-3.5 3.5z"/>
        </svg>
      );
    case 'younow':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.3 6.3l-2.4 2.4-1.9-1.9 4.3-4.3a8.1 8.1 0 0 1 0 3.8z"/>
        </svg>
      );
    case 'likee':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      );
    case 'triller':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3.5 13H11v-1.5h4.5zm0-3H11V10.5h4.5z"/>
        </svg>
      );
    case 'kakaotalk':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12 3c-5.52 0-10 3.58-10 8 0 2.9 1.91 5.43 4.8 6.8-.2.7-.8 2.6-.9 2.9-.1.3-.01.3.2.14l3.5-2.3c.7.1 1.5.2 2.4.2 5.52 0 10-3.58 10-8s-4.48-8-10-8zm0 11.5c-.3 0-.6-.1-.8-.3l-.7-.7-.8.7c-.2.2-.5.3-.8.3s-.6-.1-.8-.3l-.3-.3c-.4-.4-.4-1.1 0-1.5l1.9-1.9c.4-.4 1.1-.4 1.5 0l1.9 1.9c.4.4.4 1.1 0 1.5l-.3.3c-.2.2-.5.3-.8.3z"/>
        </svg>
      );
    case 'teams':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm5 10v1H7v-1.2A3.8 3.8 0 0 1 10.8 8h2.4a3.8 3.8 0 0 1 3.8 3.8V12zm-5 1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
        </svg>
      );
    case 'zoom':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.3 11.5c0 .3-.1.6-.3.8l-1.5 1.5c-.4.4-1.1.4-1.5 0l-.7-.7c-.4-.4-.4-1.1 0-1.5l.7-.7a1.1 1.1 0 0 1 1.5 0l1.5 1.5c.2.2.3.5.3.8z"/>
        </svg>
      );
    case 'slack':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h2.52v7.56a2.528 2.528 0 0 1-2.52 2.52 2.528 2.528 0 0 1-2.52-2.52v-5.06zM8.823 5.043a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v2.52H3.783a2.528 2.528 0 0 1-2.522-2.52 2.528 2.528 0 0 1 2.522-2.52h5.04zm10.135 3.782a2.528 2.528 0 0 1 2.52-2.52h2.522a2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.52h-2.522v-2.52zm-1.261 0a2.528 2.528 0 0 1-2.52 2.52h-2.52V5.043a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.52 2.522v5.06zm-3.782 10.135a2.528 2.528 0 0 1-2.52 2.522 2.528 2.528 0 0 1-2.522-2.522v-2.52h2.522a2.528 2.528 0 0 1 2.52 2.52zm0-1.261a2.528 2.528 0 0 1-2.52-2.52v-2.52h7.56a2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.52h-5.06z"/>
        </svg>
      );
    case 'clubhouse':
      return (
        <svg viewBox="0 0 24 24" fill={color} style={finalStyle} className={className} width={size} height={size}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-5h2v5zm0-7h-2V7h2v2z"/>
        </svg>
      );
    default:
      // Fallback global earth network icon
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} style={finalStyle} className={className} width={size} height={size} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      );
  }
}

export function getAbsoluteSocialUrl(value: string | undefined, platformName: string): string {
  if (!value) return '';
  const trimmed = value.trim();
  
  // If it's already a full URL or mailto or tel link, return it directly.
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
      return `https://facebook.com/${trimmed}`;
    
    case 'linkedin':
      if (trimmed.includes('linkedin.com')) {
        return `https://${trimmed}`;
      }
      return `https://linkedin.com/in/${trimmed}`;

    case 'instagram':
      if (trimmed.includes('instagram.com')) {
        return `https://${trimmed}`;
      }
      return `https://instagram.com/${trimmed}`;

    case 'youtube':
      const cleanYt = trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
      return `https://youtube.com/${cleanYt}`;

    case 'pinterest':
      return `https://pinterest.com/${trimmed}`;

    case 'tiktok':
      const cleanTk = trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
      return `https://tiktok.com/${cleanTk}`;

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
      const cleanTg = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
      return `https://t.me/${cleanTg}`;

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
      const cleanX = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
      return `https://x.com/${cleanX}`;

    case 'threads':
      const cleanThr = trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
      return `https://threads.net/${cleanThr}`;

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
      const cleanLk = trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
      return `https://likee.video/${cleanLk}`;

    case 'triller':
      const cleanTr = trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
      return `https://triller.co/${cleanTr}`;

    case 'kakaotalk':
      return `https://pf.kakao.com/_${trimmed}`;

    case 'teams':
      return `https://teams.microsoft.com`;

    case 'zoom':
      return `https://zoom.us/j/${trimmed}`;

    case 'slack':
      if (trimmed.includes('.slack.com')) {
        return `https://${trimmed}`;
      }
      return `https://${trimmed}.slack.com`;

    case 'clubhouse':
      const cleanCh = trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
      return `https://clubhouse.com/${cleanCh}`;

    case 'github':
      if (trimmed.includes('github.com')) {
        return `https://${trimmed}`;
      }
      return `https://github.com/${trimmed}`;

    default:
      return `https://${trimmed}`;
  }
}

