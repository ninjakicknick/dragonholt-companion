import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Feather, Shield, Sparkles } from 'lucide-react';
import { SKILLS } from '../data/gameData';
import { CLASSES, RACES, staminaForSkillCount } from '../data/characterCreation';

const STEPS = ['Race', 'Class', 'Describe', 'Skills', 'Review'];

export default function CharacterCreator({ onCancel, onComplete }) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({
    race: '', class: '', name: '', age: '', gender: '', physicalDescription: '', personality: '', background: '', skills: []
  });

  const raceSkills = RACES[draft.race]?.skills || [];
  const classSkills = CLASSES[draft.class]?.skills || [];
  const maxStamina = staminaForSkillCount(draft.skills.length);
  const raceCount = draft.skills.filter(skill => raceSkills.includes(skill)).length;
  const classCount = draft.skills.filter(skill => classSkills.includes(skill)).length;
  const skillsValid = draft.skills.length >= 5 && draft.skills.length <= 8 && raceCount >= 2 && classCount >= 2;

  const canContinue = [Boolean(draft.race), Boolean(draft.class), Boolean(draft.name.trim()), skillsValid, true][step];

  const toggleSkill = skill => setDraft(current => {
    const selected = current.skills.includes(skill);
    if (!selected && current.skills.length >= 8) return current;
    return { ...current, skills: selected ? current.skills.filter(item => item !== skill) : [...current.skills, skill] };
  });

  const notes = useMemo(() => [
    draft.physicalDescription && `Physical Description\n${draft.physicalDescription}`,
    draft.personality && `Personality & Ideals\n${draft.personality}`,
    draft.background && `Background\n${draft.background}`
  ].filter(Boolean).join('\n\n'), [draft]);

  const finish = () => onComplete({
    name: draft.name.trim(), race: draft.race, class: draft.class,
    age: draft.age, gender: draft.gender,
    maxStamina, currentStamina: maxStamina, exp: 0,
    skills: draft.skills, disabledSkills: [], items: '', notes,
    physicalDescription: draft.physicalDescription, personality: draft.personality, background: draft.background
  });

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
      <button onClick={onCancel} className="flex items-center gap-1 text-[#8c2a2a] font-bold mb-4"><ArrowLeft size={18}/> Cancel</button>
      <div className="bg-[#f8f4e6] border border-[#d2c2a5] rounded-xl shadow-md overflow-hidden">
        <div className="px-5 py-5 border-b border-[#d2c2a5] bg-[#efe6d1]">
          <div className="flex items-center gap-2 text-[#8c2a2a] text-xs font-bold uppercase tracking-[0.18em]"><Feather size={15}/> Create a Hero</div>
          <h2 className="font-bold text-2xl text-[#3f3028] mt-1">{STEPS[step]}</h2>
          <div className="flex gap-1.5 mt-4">{STEPS.map((label, index) => <div key={label} className={`h-1.5 flex-1 rounded-full ${index <= step ? 'bg-[#8c2a2a]' : 'bg-[#d2c2a5]'}`}/>)}</div>
          <div className="text-xs text-[#75665b] mt-2">Step {step + 1} of {STEPS.length}</div>
        </div>

        <div className="p-5 sm:p-7">
          {step === 0 && <ChoiceGrid title="Choose a race" intro="Your race helps establish your hero's identity and suggests natural talents." choices={RACES} value={draft.race} onChange={race => setDraft({...draft, race})}/>} 
          {step === 1 && <ChoiceGrid title="Choose a class" intro="Your class describes your training, talents, and the approaches your hero is likely to take." choices={CLASSES} value={draft.class} onChange={value => setDraft({...draft, class: value})}/>} 
          {step === 2 && <DescribeStep draft={draft} setDraft={setDraft}/>} 
          {step === 3 && <SkillsStep draft={draft} toggleSkill={toggleSkill} raceSkills={raceSkills} classSkills={classSkills} raceCount={raceCount} classCount={classCount} maxStamina={maxStamina}/>} 
          {step === 4 && <Review draft={draft} maxStamina={maxStamina}/>} 
        </div>

        <div className="p-4 border-t border-[#d2c2a5] bg-[#efe6d1] flex justify-between gap-3">
          <button disabled={step === 0} onClick={() => setStep(step - 1)} className="px-4 py-2 rounded-lg font-bold text-[#5c4a3d] disabled:opacity-30 flex items-center gap-1"><ArrowLeft size={17}/> Back</button>
          {step < 4 ? <button disabled={!canContinue} onClick={() => setStep(step + 1)} className="px-5 py-2.5 rounded-lg bg-[#8c2a2a] text-white font-bold disabled:opacity-40 flex items-center gap-2">Continue <ArrowRight size={17}/></button> : <button onClick={finish} className="px-5 py-2.5 rounded-lg bg-[#8c2a2a] text-white font-bold flex items-center gap-2"><Check size={18}/> Add Hero</button>}
        </div>
      </div>
    </div>
  );
}

function ChoiceGrid({ title, intro, choices, value, onChange }) {
  return <div><h3 className="text-xl font-bold text-[#3f3028]">{title}</h3><p className="text-sm text-[#75665b] mt-1 mb-5">{intro}</p><div className="grid sm:grid-cols-2 gap-3">{Object.entries(choices).map(([name, info]) => <button key={name} onClick={() => onChange(name)} className={`text-left p-4 rounded-lg border-2 transition-all ${value === name ? 'border-[#8c2a2a] bg-[#f3e5dc] shadow-sm' : 'border-[#d8ccb6] bg-white hover:border-[#bda98a]'}`}><div className="flex justify-between gap-2"><span className="font-bold text-lg text-[#49382f]">{name}</span>{value === name && <Check size={19} className="text-[#8c2a2a]"/>}</div><p className="text-sm text-[#75665b] mt-1">{info.tagline}</p><p className="text-xs text-[#8c2a2a] mt-3"><strong>Suggested skills:</strong> {info.skills.join(', ')}</p></button>)}</div></div>;
}

function DescribeStep({ draft, setDraft }) {
  const field = (key, value) => setDraft(current => ({...current, [key]: value}));
  return <div className="space-y-5"><div><h3 className="text-xl font-bold text-[#3f3028]">Who are you?</h3><p className="text-sm text-[#75665b] mt-1">Give your hero enough detail to make their choices feel like their own. These details are narrative, not mechanical.</p></div><div className="grid sm:grid-cols-3 gap-3"><Input label="Name" value={draft.name} onChange={v=>field('name',v)} placeholder="Hero name"/><Input label="Age" value={draft.age} onChange={v=>field('age',v)} placeholder="Age"/><Input label="Gender" value={draft.gender} onChange={v=>field('gender',v)} placeholder="Gender"/></div><TextArea label="Physical Description" value={draft.physicalDescription} onChange={v=>field('physicalDescription',v)} placeholder="Appearance, clothing, bearing, scars, mannerisms…"/><TextArea label="Personality & Ideals" value={draft.personality} onChange={v=>field('personality',v)} placeholder="A few defining traits, motivations, beliefs, or ideals…"/><TextArea label="Background" value={draft.background} onChange={v=>field('background',v)} placeholder="Where are you from? What shaped you? Why are you a hero?"/></div>;
}

function Input({label,value,onChange,placeholder}) { return <label className="block"><span className="text-xs uppercase tracking-wider font-bold text-[#75665b]">{label}</span><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full bg-white border border-[#d2c2a5] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#8c2a2a]"/></label> }
function TextArea({label,value,onChange,placeholder}) { return <label className="block"><span className="text-sm font-bold text-[#49382f]">{label}</span><textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full min-h-24 bg-white border border-[#d2c2a5] rounded-lg p-3 focus:outline-none focus:border-[#8c2a2a]"/></label> }

function SkillsStep({ draft, toggleSkill, raceSkills, classSkills, raceCount, classCount, maxStamina }) {
  return <div><div className="flex items-start justify-between gap-4 mb-4"><div><h3 className="text-xl font-bold text-[#3f3028]">Choose 5–8 skills</h3><p className="text-sm text-[#75665b] mt-1">Choose at least two skills suggested by your race and at least two suggested by your class.</p></div><div className="shrink-0 text-center bg-white border border-[#d2c2a5] rounded-lg px-3 py-2"><div className="text-xs uppercase font-bold text-[#75665b]">Stamina</div><div className="text-2xl font-bold text-[#8c2a2a]">{maxStamina}</div></div></div><div className="grid grid-cols-3 gap-2 mb-5 text-center text-xs"><RuleStatus label="Skills" value={`${draft.skills.length}/5–8`} ok={draft.skills.length>=5&&draft.skills.length<=8}/><RuleStatus label="Race" value={`${raceCount}/2`} ok={raceCount>=2}/><RuleStatus label="Class" value={`${classCount}/2`} ok={classCount>=2}/></div><div className="space-y-4">{Object.entries(SKILLS).map(([category, skills])=><div key={category}><h4 className="text-xs uppercase tracking-wider font-bold text-[#75665b] mb-2">{category}</h4><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{skills.map(skill=>{const selected=draft.skills.includes(skill);const race=raceSkills.includes(skill);const cls=classSkills.includes(skill);return <button key={skill} onClick={()=>toggleSkill(skill)} className={`p-2.5 rounded-lg border text-left ${selected?'border-[#8c2a2a] bg-[#f3e5dc]':'border-[#d8ccb6] bg-white'}`}><div className="flex items-center justify-between"><span className="font-bold text-sm text-[#49382f]">{skill}</span>{selected&&<Check size={15} className="text-[#8c2a2a]"/>}</div>{(race||cls)&&<div className="text-[10px] text-[#8c2a2a] mt-1">{[race&&draft.race,cls&&draft.class].filter(Boolean).join(' · ')}</div>}</button>})}</div></div>)}</div></div>;
}
function RuleStatus({label,value,ok}) { return <div className={`rounded-lg p-2 border ${ok?'bg-[#edf1e7] border-[#b9c6aa]':'bg-white border-[#d2c2a5]'}`}><div className="font-bold text-[#49382f]">{label}</div><div className={ok?'text-[#516346]':'text-[#8c2a2a]'}>{value}</div></div> }

function Review({draft,maxStamina}) { return <div><div className="text-center pb-5 border-b border-[#d2c2a5]"><Sparkles size={22} className="mx-auto text-[#8c2a2a] mb-2"/><h3 className="text-3xl font-bold text-[#3f3028]">{draft.name}</h3><p className="text-[#8c2a2a] font-bold">{draft.race} {draft.class}</p>{(draft.age||draft.gender)&&<p className="text-sm text-[#75665b] mt-1">{[draft.age&&`Age: ${draft.age}`,draft.gender].filter(Boolean).join(' · ')}</p>}</div><div className="grid grid-cols-2 gap-3 my-5"><div className="bg-white border border-[#d2c2a5] rounded-lg p-3 text-center"><Shield className="mx-auto text-[#8c2a2a]" size={18}/><div className="text-xs uppercase font-bold text-[#75665b] mt-1">Stamina</div><div className="text-2xl font-bold text-[#49382f]">{maxStamina}</div></div><div className="bg-white border border-[#d2c2a5] rounded-lg p-3 text-center"><div className="text-xs uppercase font-bold text-[#75665b]">Skills</div><div className="text-2xl font-bold text-[#49382f] mt-1">{draft.skills.length}</div></div></div><section><h4 className="font-bold text-[#49382f]">Skills</h4><p className="text-sm text-[#75665b] mt-1">{draft.skills.join(' · ')}</p></section>{draft.personality&&<section className="mt-4"><h4 className="font-bold text-[#49382f]">Personality & Ideals</h4><p className="text-sm text-[#75665b] whitespace-pre-wrap mt-1">{draft.personality}</p></section>}{draft.background&&<section className="mt-4"><h4 className="font-bold text-[#49382f]">Background</h4><p className="text-sm text-[#75665b] whitespace-pre-wrap mt-1">{draft.background}</p></section>}</div> }
