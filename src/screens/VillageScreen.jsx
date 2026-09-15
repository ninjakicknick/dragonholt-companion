import { Check, Clock, Minus, Plus } from 'lucide-react';
import { DAY_SLOTS } from '../data/gameData';

export default function VillageScreen({ village, advanceTime, nextDay, updateProgress }) {
  const renderTrack = (label, current, max, trackKey) => (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-1">
        <span className="font-bold text-[#4a3b32]">{label}</span>
        <span className="text-xs text-[#8c8c8c] font-bold">{current} / {max}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: max }).map((_, index) => (
          <button key={index} onClick={() => updateProgress(trackKey, current === index + 1 ? index : index + 1)} className={`w-6 h-6 sm:w-8 sm:h-8 rounded border flex items-center justify-center transition-colors ${index < current ? 'bg-[#8c2a2a] border-[#5c1a1a] text-white' : 'bg-white border-[#d2c2a5] hover:bg-[#e8e0cc]'}`}>
            {index < current && <Check size={14} />}
          </button>
        ))}
      </div>
    </div>
  );

  const maxTime = DAY_SLOTS[village.day] || 8;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-[#f8f4e6] p-4 sm:p-6 rounded-lg shadow-md border border-[#d2c2a5]">
        <h3 className="text-xl font-bold text-[#4a3b32] mb-4 flex items-center gap-2 border-b border-[#d2c2a5] pb-2"><Clock size={20} /> Time Tracker (Dragonholt Village)</h3>
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="text-center sm:text-left">
            <div className="text-sm font-bold text-[#8c8c8c] uppercase tracking-wider mb-1">Current Day</div>
            <div className="flex items-center gap-3">
              <button onClick={() => updateProgress('day', Math.max(1, village.day - 1))} className="p-2 bg-[#e8e0cc] rounded-full hover:bg-[#d2c2a5]"><Minus size={16} /></button>
              <span className="text-3xl font-bold text-[#8c2a2a] w-12 text-center">Day {village.day}</span>
              <button onClick={() => updateProgress('day', Math.min(7, village.day + 1))} className="p-2 bg-[#e8e0cc] rounded-full hover:bg-[#d2c2a5]"><Plus size={16} /></button>
            </div>
          </div>
          <div className="flex-1 w-full text-center">
            <div className="text-sm font-bold text-[#8c8c8c] uppercase tracking-wider mb-2">Time Passed</div>
            <div className="flex justify-center flex-wrap gap-2 mb-3">
              {Array.from({ length: maxTime }).map((_, index) => (
                <div key={index} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${index < village.time ? 'bg-[#4a3b32] border-[#2a1b12] text-white scale-110' : 'bg-white border-[#d2c2a5] text-transparent'}`}>
                  {index < village.time && <Check size={14} />}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={() => updateProgress('time', Math.max(0, village.time - 1))} disabled={village.time === 0} className="px-3 py-1 bg-[#e8e0cc] text-[#5c4a3d] rounded hover:bg-[#d2c2a5] disabled:opacity-50">Rewind</button>
              <button onClick={advanceTime} disabled={village.time >= maxTime} className="px-4 py-1 bg-[#8c2a2a] text-white rounded font-bold hover:bg-[#6b1e1e] disabled:opacity-50">Advance Time</button>
              <button onClick={nextDay} className="px-3 py-1 bg-[#5c4a3d] text-white rounded hover:bg-[#4a3b32]">Next Day</button>
            </div>
            {village.time >= maxTime && <div className="mt-2 text-sm text-[#8c2a2a] font-bold animate-pulse">Time to end the day! Read the end-of-day entry.</div>}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#f8f4e6] p-4 rounded-lg shadow border border-[#d2c2a5]">
          {renderTrack('Heroism', village.heroism, 24, 'heroism')}
          <p className="text-xs text-[#5c4a3d] mt-2 italic">Awards Fame and XP at 8, 16, and 24 points.</p>
        </div>
        <div className="bg-[#f8f4e6] p-4 rounded-lg shadow border border-[#d2c2a5]">
          <h4 className="font-bold text-[#4a3b32] border-b border-[#d2c2a5] pb-2 mb-3">Training Progress</h4>
          {renderTrack('Academic Study', village.academic, 6, 'academic')}
          {renderTrack('Combat Training', village.combat, 6, 'combat')}
          {renderTrack('Physical Training', village.physical, 6, 'physical')}
          {renderTrack('Social Practice', village.social, 6, 'social')}
          {renderTrack('Spiritual Meditation', village.spiritual, 5, 'spiritual')}
        </div>
      </div>
    </div>
  );
}
