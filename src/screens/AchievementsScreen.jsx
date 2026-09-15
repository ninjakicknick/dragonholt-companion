import { Award, Check } from 'lucide-react';
import { ACHIEVEMENTS } from '../data/gameData';

export default function AchievementsScreen({ achievements, toggleAchievement }) {
  return (
    <div className="bg-[#f8f4e6] p-4 sm:p-6 rounded-lg shadow border border-[#d2c2a5] animate-in fade-in duration-300">
      <h3 className="text-xl font-bold text-[#4a3b32] mb-4 flex items-center gap-2 border-b border-[#d2c2a5] pb-2"><Award size={20} /> Campaign Achievements</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ACHIEVEMENTS.map(achievement => {
          const done = achievements.includes(achievement);
          return (
            <div key={achievement} onClick={() => toggleAchievement(achievement)} className={`p-3 rounded border cursor-pointer flex items-start gap-3 transition-colors ${done ? 'bg-[#e8f0e6] border-[#8cb38c]' : 'bg-white border-[#d2c2a5] hover:bg-[#e8e0cc]'}`}>
              <div className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border ${done ? 'bg-[#4a8c4a] border-[#2a5c2a] text-white' : 'bg-gray-50 border-gray-300'}`}>{done && <Check size={14} />}</div>
              <span className={`text-sm ${done ? 'text-[#2a5c2a] font-bold line-through opacity-80' : 'text-[#4a3b32]'}`}>{achievement}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
