
import React from 'react';
import { CategoryConfig, Trait } from '../types';
import TraitChip from './TraitChip';
import { HeartIcon, AlertIcon, StarIcon, ScaleIcon } from './Icons';

interface DropZoneProps {
  config: CategoryConfig;
  traits: Trait[];
  onDrop: (e: React.DragEvent, categoryId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, trait: Trait) => void;
  currentCoins: number;
  className?: string;
}

const DropZone: React.FC<DropZoneProps> = ({ config, traits, onDrop, onDragOver, onDragStart, currentCoins, className = '' }) => {
  const getIcon = () => {
    switch(config.id) {
      case 'must_have': return <HeartIcon className={`w-4 h-4 ${config.iconColor}`} />;
      case 'deal_breaker': return <AlertIcon className={`w-4 h-4 ${config.iconColor}`} />;
      case 'bonus': return <StarIcon className={`w-5 h-5 ${config.iconColor}`} />;
      case 'flaw': return <ScaleIcon className={`w-4 h-4 ${config.iconColor}`} />;
      default: return null;
    }
  };

  const getCostText = () => {
    if (config.limit) return `限 ${config.limit} 个`;
    if (config.costMultiplier === 0) return '免费';
    if (config.costMultiplier < 0) return '返币';
    if (config.costMultiplier > 1) return `双倍价`;
    return '原价';
  };

  return (
    <div
      onDrop={(e) => onDrop(e, config.id)}
      onDragOver={onDragOver}
      className={`
        glass-panel relative flex flex-col rounded-2xl p-3
        transition-all duration-300 border
        ${config.borderColor}
        ${config.bgColor}
        ${traits.length > 0 ? 'bg-opacity-90 shadow-lg ring-1 ring-white/10' : 'bg-opacity-40 hover:bg-opacity-60'}
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-900/40 backdrop-blur-sm border border-white/5 shadow-inner">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-display font-bold text-sm leading-none mb-0.5 text-white/90 whitespace-nowrap">{config.title.split(' ')[0]}</h3>
            <p className="text-[10px] text-slate-400 font-medium opacity-80 hidden xl:block">{config.description}</p>
          </div>
        </div>
        <div className={`
          text-[10px] font-bold px-2 py-0.5 rounded border tracking-wide uppercase shrink-0
          ${config.id === 'deal_breaker' ? 'bg-red-500/20 text-red-200 border-red-500/30' : 
            config.costMultiplier > 1 ? 'bg-purple-500/20 text-purple-200 border-purple-500/30' :
            'bg-slate-800/80 text-slate-400 border-slate-700'}
        `}>
          {getCostText()}
        </div>
      </div>

      {/* Drop Area */}
      <div className="flex-1 flex flex-wrap content-start gap-1.5 overflow-y-auto scrollbar-hide min-h-[40px]">
        {traits.length === 0 && (
          <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl gap-1 group-hover:border-white/10 transition-colors py-4 opacity-50">
            <span className="text-xl grayscale">
              {config.acceptsType === 'positive' ? '✨' : '💀'}
            </span>
            <span className="text-[10px] text-slate-500 font-medium text-center">
              拖入此处
            </span>
          </div>
        )}
        {traits.map((trait) => (
          <TraitChip 
            key={trait.id} 
            trait={trait} 
            onDragStart={onDragStart}
            isCompact={true}
            className="shadow-sm hover:shadow-md hover:scale-[1.02]"
          />
        ))}
      </div>
    </div>
  );
};

export default DropZone;
