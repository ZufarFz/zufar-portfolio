import React from 'react';
import { motion } from 'motion/react';
import { SkillItem } from '../../../types';
import TechLogo from '../../common/TechLogo';
import BorderGlow from '../../effects/BorderGlow';

interface SkillCardItemProps {
  skill: SkillItem;
  isDark: boolean;
}

export const SkillCardItem: React.FC<SkillCardItemProps> = ({ skill, isDark }) => {
  return (
    <motion.div
      key={skill.id || skill.name}
      whileHover="hover"
      initial="rest"
      variants={{
        rest: { y: 0, scale: 1 },
        hover: { 
          y: -2,
          scale: 1.05,
          transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] } 
        }
      }}
      className="group h-full w-full relative transform-gpu"
      title={skill.name}
    >
      <BorderGlow
        edgeSensitivity={18}
        glowColor={isDark ? "160 100 50" : "160 80 60"}
        backgroundColor={isDark ? "#1e293b" : "#ffffff"}
        borderRadius={6}
        glowRadius={22}
        glowIntensity={1.05}
        coneSpread={22}
        animated={false}
        colors={isDark ? ['#10b981', '#06b6d4', '#8b5cf6'] : ['#10b981', '#3b82f6', '#a855f7']}
        fillOpacity={0.4}
        className="h-full w-full"
      >
        <div className="h-full w-full p-0.5 sm:p-1 flex flex-col items-center justify-center gap-0.5 cursor-default aspect-[1/1] min-h-[36px] sm:min-h-[38px] md:min-h-[40px] lg:min-h-[38px] xl:min-h-[40px] 2xl:min-h-[44px]">
          {/* Authentic Vector Logo with Crisp Zoom - Larger & Snug */}
          <motion.div 
            variants={{
              rest: { scale: 1, transformOrigin: 'center center' },
              hover: { 
                scale: 1.1,
                transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
                transformBox: 'fill-box'
              }
            }}
            className="flex items-center justify-center will-change-transform transform-gpu shrink-0"
          >
            <TechLogo
              name={skill.name}
              iconName={skill.icon}
              customSvg={skill.customSvg}
              svgUrl={skill.svgUrl}
              size={28}
              className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] md:w-[24px] md:h-[24px] lg:w-[22px] lg:h-[22px] xl:w-[24px] xl:h-[24px] 2xl:w-[26px] 2xl:h-[26px]"
            />
          </motion.div>

          {/* Skill Name - Larger crisp text */}
          <span className={`font-sans font-bold text-[8.5px] sm:text-[9px] md:text-[9.5px] lg:text-[8.5px] xl:text-[9.5px] 2xl:text-[10.5px] tracking-tight text-center leading-tight truncate w-full px-0.5 transition-colors duration-150 ${
            isDark ? 'text-slate-100 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-950'
          }`}>
            {skill.name}
          </span>
        </div>
      </BorderGlow>
    </motion.div>
  );
};

export default SkillCardItem;
