import { useState } from 'react';
import { ChevronLeft, Edit3, Minus, Plus, Shield, Sparkles, Trash2, X } from 'lucide-react';
import { SKILLS } from '../data/gameData';

const partyBonus = count => count === 1 ? 4 : count === 2 ? 2 : 0;

export default function HeroSheet({ hero, partySize, onBack, updateHero, deleteHero, toggleHeroSkill, toggleDisabledSkill }) {
  const [editing, setEditing] = useState(false);
  const bonus = partyBonus(partySize);
  const baseMax = hero.baseMaxStamina ?? hero.maxStamina ?? 14;
  const effectiveMax = baseMax + bonus;
  const current = Math.min(hero.currentStamina ?? effectiveMax, effectiveMax);

  const adjustStamina = delta => updateHero(hero.id, { currentStamina: Math.max(0, Math.min(effectiveMax, current + delta)) });
  const adjustExp = delta => updateHero(hero.id, { exp: Math.max(0, (hero.exp || 0) + delta) });

  return <div className="max-w-3xl mx-auto animate-in slide-in-from-right-4 duration-300">
    <div className="flex items-center justify-between mb-4">
      <button onClick={onBack} className="flex items-center gap-1 text-[#8c2a2a] font-bold"><ChevronLeft size={20}/> Roster</button>
      <button onClick={() => setEditing(!editing)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#cbb99b] bg-[#f8f4e6] text-[#5b4639] font-bold">{editing ? <X size={16}/> : <Edit3 size={16}/>} {editing ? 'Done' : 'Edit'}</button>
    </div>

    <article className="bg-[#f8f4e6] border border-[#cbb99b] rounded-xl shadow-lg overflow-hidden">
      <header className="relative px-5 py-7 sm:px-8 text-center bg-[#eee3cd] border-b border-[#cbb99b]">
        <div className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#8c2a2a] mb-2">Hero of Terrinoth</div>
        {editing ? <input value={hero.name} onChange={e=>updateHero(hero.id,{name:e.target.value})} className="w-full text-center text-3xl sm:text-4xl font-bold bg-transparent border-b border-[#bda98a] text-[#3e3028] focus:outline-none"/> : <h2 className="text-3xl sm:text-4xl font-bold text-[#3e3028] leading-tight">{hero.name}</h2>}
        <div className="mt-2 text-[#8c2a2a] font-bold">{hero.race} <span className="text-[#a28d77] mx-1">•</span> {hero.class}</div>
        {(hero.age || hero.gender) && <div className="mt-1 text-sm text-[#75665b]">{[hero.age && `Age ${hero.age}`, hero.gender].filter(Boolean).join(' · ')}</div>}
      </header>

      <div className="p-4 sm:p-7 space-y-7">
        <div className="grid grid-cols-2 gap-3">
          <StatPanel icon={<Shield size={18}/>} label="Stamina" value={`${current} / ${effectiveMax}`} sub={bonus ? `${baseMax} base +${bonus} party bonus` : `${baseMax} base`} onMinus={()=>adjustStamina(-1)} onPlus={()=>adjustStamina(1)}/>
          <StatPanel icon={<Sparkles size={18}/>} label="Experience" value={hero.exp || 0} sub="available XP" onMinus={()=>adjustExp(-1)} onPlus={()=>adjustExp(1)}/>
        </div>

        <Section title={`Skills · ${hero.skills.length}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{hero.skills.map(skill => {
            const disabled = (hero.disabledSkills || []).includes(skill);
            return <button key={skill} onClick={()=>toggleDisabledSkill(hero.id,skill)} className={`text-left px-3 py-2 rounded-lg border ${disabled?'border-[#d3aaa4] bg-[#f3e4e1] text-[#9a4b43] line-through':'border-[#d7c8ad] bg-white text-[#49382f]'}`}><span className="font-bold text-sm">{skill}</span>{disabled && <span className="block text-[10px] no-underline uppercase tracking-wide">Disabled</span>}</button>
          })}</div>
          {editing && <SkillEditor hero={hero} toggleHeroSkill={toggleHeroSkill}/>} 
        </Section>

        <NarrativeSection title="Physical Description" value={hero.physicalDescription} fallback="No physical description recorded." editing={editing} onChange={value=>updateHero(hero.id,{physicalDescription:value})}/>
        <NarrativeSection title="Personality & Ideals" value={hero.personality} fallback="No personality or ideals recorded." editing={editing} onChange={value=>updateHero(hero.id,{personality:value})}/>
        <NarrativeSection title="Background" value={hero.background} fallback="No background recorded." editing={editing} onChange={value=>updateHero(hero.id,{background:value})}/>

        <Section title="Items & Potions">
          {editing ? <textarea value={hero.items || ''} onChange={e=>updateHero(hero.id,{items:e.target.value})} className="w-full min-h-28 p-3 bg-white border border-[#d2c2a5] rounded-lg focus:outline-none focus:border-[#8c2a2a]" placeholder="Record carried items and potions…"/> : <p className={`text-sm whitespace-pre-wrap leading-relaxed ${hero.items?'text-[#4e4037]':'text-[#9a8d81] italic'}`}>{hero.items || 'No items recorded.'}</p>}
        </Section>

        {editing && <div className="pt-3 border-t border-[#d2c2a5]"><button onClick={()=>deleteHero(hero.id)} className="text-red-700 flex items-center gap-2 text-sm font-bold"><Trash2 size={16}/> Delete this hero</button></div>}
      </div>
    </article>
  </div>;
}

function StatPanel({icon,label,value,sub,onMinus,onPlus}) { return <div className="bg-white border border-[#d2c2a5] rounded-xl p-3 text-center"><div className="flex justify-center items-center gap-1 text-[#8c2a2a]">{icon}<span className="text-[10px] uppercase tracking-widest font-bold">{label}</span></div><div className="flex items-center justify-center gap-2 mt-2"><button onClick={onMinus} className="p-1.5 rounded-full bg-[#eee6d6] text-[#5c4a3d]"><Minus size={14}/></button><span className="text-2xl font-bold text-[#3e3028] min-w-16">{value}</span><button onClick={onPlus} className="p-1.5 rounded-full bg-[#eee6d6] text-[#5c4a3d]"><Plus size={14}/></button></div><div className="text-[10px] text-[#8b7b6d] mt-1">{sub}</div></div> }
function Section({title,children}) { return <section><div className="flex items-center gap-3 mb-3"><h3 className="font-bold text-[#49382f] whitespace-nowrap">{title}</h3><div className="h-px bg-[#d2c2a5] flex-1"/></div>{children}</section> }
function NarrativeSection({title,value,fallback,editing,onChange}) { return <Section title={title}>{editing?<textarea value={value||''} onChange={e=>onChange(e.target.value)} className="w-full min-h-24 p-3 bg-white border border-[#d2c2a5] rounded-lg focus:outline-none focus:border-[#8c2a2a]"/>:<p className={`text-sm whitespace-pre-wrap leading-relaxed ${value?'text-[#4e4037]':'text-[#9a8d81] italic'}`}>{value||fallback}</p>}</Section> }
function SkillEditor({hero,toggleHeroSkill}) { return <details className="mt-4"><summary className="cursor-pointer text-xs font-bold text-[#8c2a2a]">Edit skill list</summary><div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">{Object.values(SKILLS).flat().map(skill=><label key={skill} className="flex items-center gap-2 text-xs text-[#5c4a3d]"><input type="checkbox" checked={hero.skills.includes(skill)} onChange={()=>toggleHeroSkill(hero.id,skill)}/>{skill}</label>)}</div></details> }
