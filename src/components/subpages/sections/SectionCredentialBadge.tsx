import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface SectionCredentialBadgeProps {
  displayBadge: string;
  isDark: boolean;
}

export const SectionCredentialBadge: React.FC<SectionCredentialBadgeProps> = ({
  displayBadge,
  isDark
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mt-4 px-4 py-2 rounded-full border text-left flex items-center justify-between gap-3 transition-colors w-fit ${
        isDark 
          ? 'bg-slate-955/60 border-emerald-500/20 hover:border-emerald-500/40' 
          : 'bg-emerald-50/50 border-emerald-100 shadow-xs hover:border-emerald-200'
      }`}
    >
      <div className="flex items-center gap-2 text-emerald-500 font-mono text-[9px] font-extrabold uppercase tracking-widest">
        <Check className="w-3.5 h-3.5 animate-pulse" />
        <span>Verifikasi Kredensial Resmi • {displayBadge}</span>
      </div>
    </motion.div>
  );
};

export default SectionCredentialBadge;
