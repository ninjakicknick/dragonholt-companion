import { useState } from 'react';
import { Plus, UserCircle } from 'lucide-react';
import CharacterCreator from '../components/CharacterCreator';
import HeroSheet from '../components/HeroSheet';

export default function HeroesScreen({ heroes, editingHero, setEditingHero, createHero, updateHero, deleteHero, toggleHeroSkill, toggleDisabledSkill }) {
  const [creating, setCreating] = useState(false);

  if (creating) {
    return <CharacterCreator onCancel={() => setCreating(false)} onComplete={details => {
      const hero = createHero({ ...details, baseMaxStamina: details.maxStamina });
      setCreating(false);
      setEditingHero(hero.id);
    }} />;
  }

  if (editingHero) {
    const hero = heroes.find(item => item.id === editingHero);
    if (!hero) return null;
    return <HeroSheet hero={hero} partySize={heroes.length} onBack={() => setEditingHero(null)} updateHero={updateHero} deleteHero={id => { deleteHero(id); setEditingHero(null); }} toggleHeroSkill={toggleHeroSkill} toggleDisabledSkill={toggleDisabledSkill}/>;
  }

  const bonus = heroes.length === 1 ? 4 : heroes.length === 2 ? 2 : 0;

  return <div className="space-y-4 animate-in fade-in duration-300">
    <button onClick={() => setCreating(true)} className="w-full py-3 bg-[#8c2a2a] hover:bg-[#6b1e1e] text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow"><Plus size={20}/> Create New Hero</button>
    {heroes.length === 0 && <div className="text-center py-12 text-[#8c8c8c]"><UserCircle size={48} className="mx-auto mb-2 opacity-50"/><p>No heroes in your party yet.</p></div>}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{heroes.map(hero => {
      const baseMax = hero.baseMaxStamina ?? hero.maxStamina ?? 14;
      const effectiveMax = baseMax + bonus;
      const current = Math.min(hero.currentStamina ?? effectiveMax, effectiveMax);
      return <button key={hero.id} onClick={() => setEditingHero(hero.id)} className="text-left bg-[#f8f4e6] p-5 rounded-xl shadow border border-[#d2c2a5] hover:border-[#8c2a2a] hover:shadow-md transition-all">
        <div className="flex justify-between items-start gap-4 border-b border-[#d2c2a5] pb-3">
          <div><div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8c2a2a]">Hero</div><h3 className="font-bold text-[#3e3028] text-2xl leading-tight">{hero.name}</h3><p className="text-sm text-[#8c2a2a] mt-1">{hero.race} · {hero.class}</p></div>
          <div className="text-right shrink-0"><div className="text-[10px] font-bold text-[#8c8c8c] uppercase tracking-wider">Stamina</div><div className="font-bold text-xl text-[#8c2a2a]">{current} / {effectiveMax}</div>{bonus>0&&<div className="text-[10px] text-[#8b7b6d]">+{bonus} party bonus</div>}</div>
        </div>
        <div className="mt-3 text-sm text-[#5c4a3d]"><strong>{hero.skills.length} skills</strong><span className="text-[#a18e7d]"> · </span>{hero.skills.slice(0,4).join(', ')}{hero.skills.length>4?'…':''}</div>
        {hero.personality && <p className="mt-3 text-sm italic text-[#75665b] line-clamp-2">“{hero.personality}”</p>}
      </button>;
    })}</div>
  </div>;
}
