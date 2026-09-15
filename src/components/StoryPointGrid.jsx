import { Check } from 'lucide-react';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function StoryPointGrid({ storyPoints, onToggle }) {
  return (
    <div className="overflow-x-auto bg-[#f8f4e6] p-4 rounded-lg shadow-inner border border-[#d2c2a5]">
      <div className="min-w-max">
        <div className="grid grid-cols-9 gap-1 mb-1">
          <div className="w-8 h-8" />
          {NUMBERS.map(number => (
            <div key={number} className="w-8 h-8 flex items-center justify-center font-bold text-[#5c4a3d]">{number}</div>
          ))}
        </div>
        {LETTERS.map(letter => (
          <div key={letter} className="grid grid-cols-9 gap-1 mb-1">
            <div className="w-8 h-8 flex items-center justify-center font-bold text-[#5c4a3d]">{letter}</div>
            {NUMBERS.map(number => {
              const point = `${letter}${number}`;
              const active = storyPoints.includes(point);
              return (
                <button key={point} type="button" onClick={() => onToggle(point)} aria-pressed={active} aria-label={`${active ? 'Remove' : 'Add'} story point ${point}`} className={`w-8 h-8 text-xs rounded border transition-colors ${active ? 'bg-[#8c2a2a] text-white border-[#5c1a1a]' : 'bg-white text-[#8c8c8c] border-[#d2c2a5] hover:bg-[#e8e0cc]'}`}>
                  {active ? <Check size={14} className="mx-auto" /> : point}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
