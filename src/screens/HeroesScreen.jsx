import { useState } from 'react';
import { ChevronLeft, Minus, Plus, Trash2, UserCircle } from 'lucide-react';
import { SKILLS } from '../data/gameData';
import CharacterCreator from '../components/CharacterCreator';

export default function HeroesScreen({ heroes, editingHero, setEditingHero, createHero, updateHero, deleteHero, toggleHeroSkill, toggleDisabledSkill }) {
  const [creating, setCreating] = useState(false);

  if (creating) {
    return <CharacterCreator onCancel={() => setCreating(false)} onComplete={details => {
      const hero = createHero(details);
      setCreating(false);
      setEditingHero(hero.id);
    }} />;
  }

  if (editingHero) {
    const hero = heroes.find(item => item.id === editingHero);
    if (!hero) return null;

    return (
      <div className="animate-in slide-in-from-right-4 duration-300">
        <button onClick={() => setEditingHero(null)} className="flex items-center gap-1 text-[#8c2a2a] font-bold mb-4 hover:underline"><ChevronLeft size={20} /> Back to Roster</button>
        <div className="bg-[#f8f4e6] p-4 sm:p-6 rounded-lg shadow-md border border-[#d2c2a5] space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between border-b border-[#d2c2a5] pb-4">
            <div className="w-full sm:w-auto flex-1">
              <input type="text" value={hero.name} onChange={event => updateHero(hero.id, { name: event.target.value })} className="text-3xl font-bold text-[#4a3b32] bg-transparent border-b-2 border-transparent focus:border-[#8c2a2a] focus:outline-none w-full" placeholder="Hero Name" />
              <div className="flex gap-2 mt-2"><span className="text-[#8c2a2a]">{hero.race}</span><span className="text-[#8c2a2a] font-bold">|</span><span className="text-[#8c2a2a]">{hero.class}</span></div>
            </div>
            <button onClick={() => deleteHero(hero.id)} className="text-red-600 hover:bg-red-100 p-2 rounded flex items-center gap-1"><Trash2 size={16} /> Delete</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded border border-[#d2c2a5] text-center"><div className="text-sm font-bold text-[#8c8c8c] uppercase tracking-wider mb-2">Stamina</div><div className="flex justify-center items-center gap-2"><button onClick={() => updateHero(hero.id, { currentStamina: Math.max(0, hero.currentStamina - 1) })} className="p-1 bg-[#e8e0cc] rounded"><Minus size={14} /></button><span className="text-2xl font-bold text-[#8c2a2a] w-12">{hero.currentStamina} <span className="text-sm text-[#8c8c8c]">/ {hero.maxStamina}</span></span><button onClick={() => updateHero(hero.id, { currentStamina: Math.min(hero.maxStamina, hero.currentStamina + 1) })} className="p-1 bg-[#e8e0cc] rounded"><Plus size={14} /></button></div></div>
            <div className="bg-white p-3 rounded border border-[#d2c2a5] text-center"><div className="text-sm font-bold text-[#8c8c8c] uppercase tracking-wider mb-2">Experience</div><div className="flex justify-center items-center gap-2"><button onClick={() => updateHero(hero.id, { exp: Math.max(0, hero.exp - 1) })} className="p-1 bg-[#e8e0cc] rounded"><Minus size={14} /></button><span className="text-2xl font-bold text-[#4a3b32] w-8">{hero.exp}</span><button onClick={() => updateHero(hero.id, { exp: hero.exp + 1 })} className="p-1 bg-[#e8e0cc] rounded"><Plus size={14} /></button></div></div>
          </div>

          <div><h4 className="font-bold text-[#4a3b32] mb-2 border-b border-[#d2c2a5]">Skills ({hero.skills.length})</h4><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">{Object.entries(SKILLS).map(([category, categorySkills]) => <div key={category} className="mb-2"><h5 className="text-xs font-bold text-[#8c8c8c] uppercase mb-1">{category}</h5>{categorySkills.map(skill => { const hasSkill = hero.skills.includes(skill); const disabled = hero.disabledSkills.includes(skill); return <div key={skill} className="flex items-center gap-2 mb-1"><input type="checkbox" checked={hasSkill} onChange={() => toggleHeroSkill(hero.id, skill)} className="w-4 h-4 text-[#8c2a2a] rounded focus:ring-[#8c2a2a]" /><span className={`flex-1 text-sm ${hasSkill ? 'font-bold text-[#4a3b32]' : 'text-gray-500'} ${disabled ? 'line-through text-red-500' : ''}`}>{skill}</span>{hasSkill && <button onClick={() => toggleDisabledSkill(hero.id, skill)} className={`text-[10px] px-1.5 py-0.5 rounded ${disabled ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>{disabled ? 'Disabled' : 'Active'}</button>}</div>})}</div>)}</div></div>

          {(hero.physicalDescription || hero.personality || hero.background) && <div className="space-y-4">{hero.physicalDescription && <div><h4 className="font-bold text-[#4a3b32] border-b border-[#d2c2a5]">Physical Description</h4><p className="text-sm whitespace-pre-wrap mt-2">{hero.physicalDescription}</p></div>}{hero.personality && <div><h4 className="font-bold text-[#4a3b32] border-b border-[#d2c2a5]">Personality & Ideals</h4><p className="text-sm whitespace-pre-wrap mt-2">{hero.personality}</p></div>}{hero.background && <div><h4 className="font-bold text-[#4a3b32] border-b border-[#d2c2a5]">Background</h4><p className="text-sm whitespace-pre-wrap mt-2">{hero.background}</p></div>}</div>}
          <div><h4 className="font-bold text-[#4a3b32] mb-2 border-b border-[#d2c2a5]">Items & Potions</h4><textarea value={hero.items} onChange={event => updateHero(hero.id, { items: event.target.value })} className="w-full h-24 p-2 bg-white border border-[#d2c2a5] rounded text-sm focus:outline-none" placeholder={'Healing Potion x2\nSword...'} /></div>
        </div>
      </div>
    );
  }

  return <div className="space-y-4 animate-in fade-in duration-300"><button onClick={() => setCreating(true)} className="w-full py-3 bg-[#8c2a2a] hover:bg-[#6b1e1e] text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow"><Plus size={20} /> Create New Hero</button>{heroes.length === 0 && <div className="text-center py-12 text-[#8c8c8c]"><UserCircle size={48} className="mx-auto mb-2 opacity-50" /><p>No heroes in your party yet.</p></div>}<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{heroes.map(hero => <div key={hero.id} onClick={() => setEditingHero(hero.id)} className="bg-[#f8f4e6] p-4 rounded-lg shadow border border-[#d2c2a5] cursor-pointer hover:border-[#8c2a2a] hover:shadow-md transition-all flex flex-col"><div className="flex justify-between items-start mb-3 border-b border-[#d2c2a5] pb-2"><div><h3 className="font-bold text-[#4a3b32] text-xl">{hero.name}</h3><p className="text-sm text-[#8c2a2a]">{hero.race} {hero.class}</p></div><div className="text-right"><div className="text-xs font-bold text-[#8c8c8c] uppercase">Stamina</div><div className="font-bold text-[#8c2a2a]">{hero.currentStamina} / {hero.maxStamina}</div></div></div><div className="text-sm text-[#5c4a3d] mb-2 flex-1"><strong>Skills ({hero.skills.length}):</strong> {hero.skills.join(', ') || 'None'}</div><div className="text-sm text-[#5c4a3d]"><strong>Items:</strong> {hero.items ? hero.items.substring(0, 30) + (hero.items.length > 30 ? '...' : '') : 'None'}</div></div>)}</div></div>;
}
