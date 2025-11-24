
import React from 'react';
import { Trait } from '../types';

interface TraitChipProps {
  trait: Trait;
  onDragStart: (e: React.DragEvent, trait: Trait) => void;
  isCompact?: boolean;
  className?: string;
}

const TraitChip: React.FC<TraitChipProps> = ({ trait, onDragStart, isCompact = false, className = '' }) => {
  
  // Determine color based on value and type
  const getBadgeColor = () => {
    if (trait.type === 'positive') {
      return trait.value === 2 ? 'bg-amber-400 text-black' : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600';
    } else {
      return trait.value === 2 ? 'bg-rose-600 text-white' : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600';
    }
  };

  const getValueText = () => {
    if (trait.type === 'positive') return `-${trait.value}`;
    return `+${trait.value}`;
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, trait)}
      className={`
        group cursor-grab active:cursor-grabbing
        bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500
        transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5
        rounded-xl flex items-center justify-between
        select-none animate-in fade-in zoom-in duration-300
        ${isCompact ? 'px-2 py-1 text-xs' : 'px-3 py-2.5 text-sm'}
        ${className}
      `}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <span className="grayscale group-hover:grayscale-0 transition-all text-lg shrink-0">{trait.emoji}</span>
        <span className="font-medium text-slate-300 group-hover:text-white truncate">{trait.label}</span>
      </div>

      {/* Value Badge */}
      <div className={`
        ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono min-w-[24px] text-center shrink-0
        transition-colors duration-200
        ${getBadgeColor()}
      `}>
        {getValueText()}
      </div>
    </div>
  );
};

export default TraitChip;
