import React from 'react';
import { OptionItem } from '../types';

interface Props {
  title: string;
  options: OptionItem[];
  selected: string[];
  onChange: (value: string[]) => void;
  currentLang: 'en' | 'zh';
}

const OptionSelector: React.FC<Props> = ({ title, options, selected, onChange, currentLang }) => {
  const toggleSelection = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-cyan-500 block"></span>
        {title}
      </h3>
      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggleSelection(opt.value)}
              className={`
                px-3 py-1.5 text-xs rounded border transition-all duration-200 text-left
                ${isSelected 
                  ? 'bg-cyan-900/50 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'}
              `}
            >
              {opt.label[currentLang]}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OptionSelector;
