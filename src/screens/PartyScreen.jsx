import { Award, Map, Minus, Plus } from 'lucide-react';
import StoryPointGrid from '../components/StoryPointGrid';

export default function PartyScreen({ party, setParty, onToggleStoryPoint }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="bg-[#f8f4e6] p-4 rounded-lg shadow border border-[#d2c2a5] flex-1 flex items-center justify-between">
          <div className="flex items-center gap-2"><Award className="text-[#c49a45]" /><span className="font-bold text-[#5c4a3d] text-lg">Fame</span></div>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Decrease fame" onClick={() => setParty(current => ({ ...current, fame: Math.max(0, current.fame - 1) }))} className="p-1 bg-[#e8e0cc] rounded text-[#5c4a3d] hover:bg-[#d2c2a5]"><Minus size={18} /></button>
            <span className="text-xl font-bold text-[#8c2a2a] w-8 text-center">{party.fame}</span>
            <button type="button" aria-label="Increase fame" onClick={() => setParty(current => ({ ...current, fame: current.fame + 1 }))} className="p-1 bg-[#e8e0cc] rounded text-[#5c4a3d] hover:bg-[#d2c2a5]"><Plus size={18} /></button>
          </div>
        </div>
        <div className="bg-[#f8f4e6] p-4 rounded-lg shadow border border-[#d2c2a5] flex-1 flex items-center justify-between">
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-yellow-500 border-2 border-yellow-600 flex items-center justify-center text-[10px] font-bold text-yellow-800">G</div><span className="font-bold text-[#5c4a3d] text-lg">Gold</span></div>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Decrease gold by five" onClick={() => setParty(current => ({ ...current, gold: Math.max(0, current.gold - 5) }))} className="p-1 bg-[#e8e0cc] rounded text-[#5c4a3d] hover:bg-[#d2c2a5]"><Minus size={18} /></button>
            <input type="number" aria-label="Party gold" value={party.gold} onChange={event => setParty(current => ({ ...current, gold: Number.parseInt(event.target.value, 10) || 0 }))} className="w-16 text-center bg-transparent font-bold text-[#8c2a2a] border-b border-[#d2c2a5] focus:outline-none" />
            <button type="button" aria-label="Increase gold by five" onClick={() => setParty(current => ({ ...current, gold: current.gold + 5 }))} className="p-1 bg-[#e8e0cc] rounded text-[#5c4a3d] hover:bg-[#d2c2a5]"><Plus size={18} /></button>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-[#4a3b32] mb-3 flex items-center gap-2"><Map size={20} /> Story Points Tracked: {party.storyPoints.length}</h3>
        <StoryPointGrid storyPoints={party.storyPoints} onToggle={onToggleStoryPoint} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-[#4a3b32] mb-3">Campaign Notes</h3>
        <textarea value={party.notes} onChange={event => setParty(current => ({ ...current, notes: event.target.value }))} className="w-full h-32 p-3 bg-[#f8f4e6] border border-[#d2c2a5] rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8c2a2a] text-[#4a3b32]" placeholder="Jot down hints, locations, and clues here..." />
      </div>
    </div>
  );
}
