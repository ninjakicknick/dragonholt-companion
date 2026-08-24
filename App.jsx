import React, { useEffect, useRef, useState } from 'react';
import { Book, Users, Map, Award, Plus, Minus, Check, Clock, UserCircle, Save, Trash2, ChevronLeft } from 'lucide-react';

const SKILLS = {
  Combat: ['Alchemy', 'Arcana', 'Archery', 'Brawling', 'Dueling', 'Military'],
  Physical: ['Agility', 'Athletics', 'Endurance', 'Stealth'],
  Mental: ['Awareness', 'History', 'Reasoning', 'Survival', 'Willpower'],
  Social: ['Deception', 'Empathy', 'Persuasion', 'Streetwise'],
  Utility: ['Craftsmanship', 'Devotion', 'Performance', 'Runes', 'Thievery']
};

const ACHIEVEMENTS = [
  "Grand Adventure (Complete all six quests)",
  "World Renown (Complete campaign with 6+ fame)",
  "Hero of the Realm (Complete campaign with 24 heroism)",
  "Collector (Find 16+ items)",
  "Patronage (Commission a magical item)",
  "Many Faces (Acquire 3 masquerade masks)",
  "Precious (Acquire a cursed object)",
  "Hoarder (Steal a wooden dragon)",
  "Spirit's Blessing (Receive the blessing)",
  "Celebration! (Attend a bonfire)",
  "Bull's Eye! (Win an archery challenge)",
  "Purple Reign (Jam with purple-clad musician)",
  "Life Saver (Save someone's life)",
  "Congratulations! (Attend 2+ weddings)",
  "Love is in the Air (Romantic date)",
  "Condolences (Attend a memorial)",
  "Recursion (Play a board/card game)",
  "Secret Meeting (Meet pink-haired gnome)",
  "Meow Meow! (Find 2 different cats)",
  "Tavern Brawl! (Get into a bar fight)",
  "My Cabbages! (Overturn a cabbage cart)",
  "Hero or Villain? (Get arrested)",
  "Have I seen you before? (Encounter Descent characters)",
  "There We Were... (Create Nerekhall tale)"
];

const DAY_SLOTS = {
  1: 8, 2: 8, 3: 6, 4: 8, 5: 8, 6: 8, 7: 6
};

const STORAGE_KEY = 'dragonholt-companion-save-v1';

const DEFAULT_STATE = {
  party: { fame: 2, gold: 100, storyPoints: [], notes: '' },
  heroes: [],
  village: {
    day: 1, time: 0,
    heroism: 0, academic: 0, combat: 0, physical: 0, social: 0, spiritual: 0
  },
  achievements: []
};

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      party: { ...DEFAULT_STATE.party, ...(parsed.party || {}) },
      heroes: Array.isArray(parsed.heroes) ? parsed.heroes : [],
      village: { ...DEFAULT_STATE.village, ...(parsed.village || {}) },
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : []
    };
  } catch (error) {
    console.warn('Could not load Dragonholt save:', error);
    return DEFAULT_STATE;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('party');
  const initialSave = useRef(loadSavedState()).current;

  // App State — automatically persisted on this device.
  const [party, setParty] = useState(initialSave.party);
  const [heroes, setHeroes] = useState(initialSave.heroes);
  const [editingHero, setEditingHero] = useState(null);
  const [village, setVillage] = useState(initialSave.village);
  const [achievements, setAchievements] = useState(initialSave.achievements);
  const importInputRef = useRef(null);

  useEffect(() => {
    const save = { party, heroes, village, achievements };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  }, [party, heroes, village, achievements]);

  const exportSave = () => {
    const save = { version: 1, exportedAt: new Date().toISOString(), party, heroes, village, achievements };
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dragonholt-save-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSave = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        setParty({ ...DEFAULT_STATE.party, ...(parsed.party || {}) });
        setHeroes(Array.isArray(parsed.heroes) ? parsed.heroes : []);
        setVillage({ ...DEFAULT_STATE.village, ...(parsed.village || {}) });
        setAchievements(Array.isArray(parsed.achievements) ? parsed.achievements : []);
        setEditingHero(null);
      } catch {
        alert('That file does not look like a Dragonholt Companion save.');
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  // --- Handlers ---
  const toggleStoryPoint = (point) => {
    setParty(prev => ({
      ...prev,
      storyPoints: prev.storyPoints.includes(point) 
        ? prev.storyPoints.filter(p => p !== point)
        : [...prev.storyPoints, point]
    }));
  };

  const advanceTime = () => {
    setVillage(prev => {
      let { day, time } = prev;
      const maxSlots = DAY_SLOTS[day] || 8;
      if (time < maxSlots) {
        time++;
      }
      return { ...prev, time };
    });
  };

  const nextDay = () => {
    setVillage(prev => ({
      ...prev,
      day: Math.min(prev.day + 1, 7),
      time: 0
    }));
  };

  const updateProgress = (track, value) => {
    setVillage(prev => ({ ...prev, [track]: value }));
  };

  const toggleAchievement = (ach) => {
    setAchievements(prev => 
      prev.includes(ach) ? prev.filter(a => a !== ach) : [...prev, ach]
    );
  };

  // Hero Management
  const createHero = () => {
    const newHero = {
      id: Date.now(),
      name: 'New Hero', race: 'Human', class: 'Wildlander',
      maxStamina: 14, currentStamina: 14, exp: 0,
      skills: [], disabledSkills: [], items: '', notes: ''
    };
    setHeroes([...heroes, newHero]);
    setEditingHero(newHero.id);
  };

  const updateHero = (id, updates) => {
    setHeroes(heroes.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteHero = (id) => {
    setHeroes(heroes.filter(h => h.id !== id));
    setEditingHero(null);
  };

  const toggleHeroSkill = (heroId, skill) => {
    const hero = heroes.find(h => h.id === heroId);
    let newSkills = hero.skills.includes(skill)
      ? hero.skills.filter(s => s !== skill)
      : [...hero.skills, skill];
    
    updateHero(heroId, { skills: newSkills });
  };

  const toggleDisabledSkill = (heroId, skill) => {
    const hero = heroes.find(h => h.id === heroId);
    let newDisabled = hero.disabledSkills.includes(skill)
      ? hero.disabledSkills.filter(s => s !== skill)
      : [...hero.disabledSkills, skill];
    
    updateHero(heroId, { disabledSkills: newDisabled });
  };

  // --- Renderers ---
  const renderStoryPoints = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
    
    return (
      <div className="overflow-x-auto bg-[#f8f4e6] p-4 rounded-lg shadow-inner border border-[#d2c2a5]">
        <div className="min-w-max">
          <div className="grid grid-cols-9 gap-1 mb-1">
            <div className="w-8 h-8"></div>
            {numbers.map(n => (
              <div key={`header-${n}`} className="w-8 h-8 flex items-center justify-center font-bold text-[#5c4a3d]">{n}</div>
            ))}
          </div>
          {letters.map(letter => (
            <div key={`row-${letter}`} className="grid grid-cols-9 gap-1 mb-1">
              <div className="w-8 h-8 flex items-center justify-center font-bold text-[#5c4a3d]">{letter}</div>
              {numbers.map(num => {
                const point = `${letter}${num}`;
                const isActive = party.storyPoints.includes(point);
                return (
                  <button
                    key={point}
                    onClick={() => toggleStoryPoint(point)}
                    className={`w-8 h-8 text-xs rounded border transition-colors ${
                      isActive 
                        ? 'bg-[#8c2a2a] text-white border-[#5c1a1a]' 
                        : 'bg-white text-[#8c8c8c] border-[#d2c2a5] hover:bg-[#e8e0cc]'
                    }`}
                  >
                    {isActive ? <Check size={14} className="mx-auto" /> : point}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPartyTab = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="bg-[#f8f4e6] p-4 rounded-lg shadow border border-[#d2c2a5] flex-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="text-[#c49a45]" />
            <span className="font-bold text-[#5c4a3d] text-lg">Fame</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setParty(p => ({...p, fame: Math.max(0, p.fame - 1)}))} className="p-1 bg-[#e8e0cc] rounded text-[#5c4a3d] hover:bg-[#d2c2a5]"><Minus size={18}/></button>
            <span className="text-xl font-bold text-[#8c2a2a] w-8 text-center">{party.fame}</span>
            <button onClick={() => setParty(p => ({...p, fame: p.fame + 1}))} className="p-1 bg-[#e8e0cc] rounded text-[#5c4a3d] hover:bg-[#d2c2a5]"><Plus size={18}/></button>
          </div>
        </div>
        <div className="bg-[#f8f4e6] p-4 rounded-lg shadow border border-[#d2c2a5] flex-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-yellow-500 border-2 border-yellow-600 flex items-center justify-center text-[10px] font-bold text-yellow-800">G</div>
            <span className="font-bold text-[#5c4a3d] text-lg">Gold</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setParty(p => ({...p, gold: Math.max(0, p.gold - 5)}))} className="p-1 bg-[#e8e0cc] rounded text-[#5c4a3d] hover:bg-[#d2c2a5]"><Minus size={18}/></button>
            <input 
              type="number" 
              value={party.gold} 
              onChange={(e) => setParty(p => ({...p, gold: parseInt(e.target.value) || 0}))}
              className="w-16 text-center bg-transparent font-bold text-[#8c2a2a] border-b border-[#d2c2a5] focus:outline-none"
            />
            <button onClick={() => setParty(p => ({...p, gold: p.gold + 5}))} className="p-1 bg-[#e8e0cc] rounded text-[#5c4a3d] hover:bg-[#d2c2a5]"><Plus size={18}/></button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-[#4a3b32] mb-3 flex items-center gap-2"><Map size={20}/> Story Points Tracked: {party.storyPoints.length}</h3>
        {renderStoryPoints()}
      </div>

      <div>
        <h3 className="text-xl font-bold text-[#4a3b32] mb-3">Campaign Notes</h3>
        <textarea 
          value={party.notes}
          onChange={(e) => setParty({...party, notes: e.target.value})}
          className="w-full h-32 p-3 bg-[#f8f4e6] border border-[#d2c2a5] rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8c2a2a] text-[#4a3b32]"
          placeholder="Jot down hints, locations, and clues here..."
        />
      </div>
    </div>
  );

  const renderHeroesTab = () => {
    if (editingHero) {
      const hero = heroes.find(h => h.id === editingHero);
      if (!hero) return null;
      
      return (
        <div className="animate-in slide-in-from-right-4 duration-300">
          <button onClick={() => setEditingHero(null)} className="flex items-center gap-1 text-[#8c2a2a] font-bold mb-4 hover:underline">
            <ChevronLeft size={20} /> Back to Roster
          </button>
          
          <div className="bg-[#f8f4e6] p-4 sm:p-6 rounded-lg shadow-md border border-[#d2c2a5] space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between border-b border-[#d2c2a5] pb-4">
              <div className="w-full sm:w-auto flex-1">
                <input 
                  type="text" 
                  value={hero.name} 
                  onChange={e => updateHero(hero.id, { name: e.target.value })}
                  className="text-3xl font-bold text-[#4a3b32] bg-transparent border-b-2 border-transparent focus:border-[#8c2a2a] focus:outline-none w-full"
                  placeholder="Hero Name"
                />
                <div className="flex gap-2 mt-2">
                  <input 
                    type="text" value={hero.race} onChange={e => updateHero(hero.id, { race: e.target.value })}
                    className="text-[#8c2a2a] bg-transparent border-b border-[#d2c2a5] focus:outline-none" placeholder="Race"
                  />
                  <span className="text-[#8c2a2a] font-bold">|</span>
                  <input 
                    type="text" value={hero.class} onChange={e => updateHero(hero.id, { class: e.target.value })}
                    className="text-[#8c2a2a] bg-transparent border-b border-[#d2c2a5] focus:outline-none" placeholder="Class"
                  />
                </div>
              </div>
              <button onClick={() => deleteHero(hero.id)} className="text-red-600 hover:bg-red-100 p-2 rounded flex items-center gap-1">
                <Trash2 size={16} /> Delete
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border border-[#d2c2a5] text-center">
                <div className="text-sm font-bold text-[#8c8c8c] uppercase tracking-wider mb-2">Stamina</div>
                <div className="flex justify-center items-center gap-2">
                  <button onClick={() => updateHero(hero.id, { currentStamina: Math.max(0, hero.currentStamina - 1)})} className="p-1 bg-[#e8e0cc] rounded"><Minus size={14}/></button>
                  <span className="text-2xl font-bold text-[#8c2a2a] w-12">{hero.currentStamina} <span className="text-sm text-[#8c8c8c]">/ {hero.maxStamina}</span></span>
                  <button onClick={() => updateHero(hero.id, { currentStamina: Math.min(hero.maxStamina, hero.currentStamina + 1)})} className="p-1 bg-[#e8e0cc] rounded"><Plus size={14}/></button>
                </div>
                <div className="mt-2 text-xs flex justify-center items-center gap-1">
                  <span>Max:</span>
                  <input type="number" value={hero.maxStamina} onChange={e => updateHero(hero.id, { maxStamina: parseInt(e.target.value)||0 })} className="w-10 text-center border-b" />
                </div>
              </div>

              <div className="bg-white p-3 rounded border border-[#d2c2a5] text-center">
                <div className="text-sm font-bold text-[#8c8c8c] uppercase tracking-wider mb-2">Experience</div>
                <div className="flex justify-center items-center gap-2">
                  <button onClick={() => updateHero(hero.id, { exp: Math.max(0, hero.exp - 1)})} className="p-1 bg-[#e8e0cc] rounded"><Minus size={14}/></button>
                  <span className="text-2xl font-bold text-[#4a3b32] w-8">{hero.exp}</span>
                  <button onClick={() => updateHero(hero.id, { exp: hero.exp + 1})} className="p-1 bg-[#e8e0cc] rounded"><Plus size={14}/></button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#4a3b32] mb-2 border-b border-[#d2c2a5]">Skills ({hero.skills.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(SKILLS).map(([category, catSkills]) => (
                  <div key={category} className="mb-2">
                    <h5 className="text-xs font-bold text-[#8c8c8c] uppercase mb-1">{category}</h5>
                    {catSkills.map(skill => {
                      const hasSkill = hero.skills.includes(skill);
                      const isDisabled = hero.disabledSkills.includes(skill);
                      return (
                        <div key={skill} className="flex items-center gap-2 mb-1">
                          <input 
                            type="checkbox" 
                            checked={hasSkill}
                            onChange={() => toggleHeroSkill(hero.id, skill)}
                            className="w-4 h-4 text-[#8c2a2a] rounded focus:ring-[#8c2a2a]"
                          />
                          <span className={`flex-1 text-sm ${hasSkill ? 'font-bold text-[#4a3b32]' : 'text-gray-500'} ${isDisabled ? 'line-through text-red-500' : ''}`}>
                            {skill}
                          </span>
                          {hasSkill && (
                            <button 
                              onClick={() => toggleDisabledSkill(hero.id, skill)}
                              className={`text-[10px] px-1.5 py-0.5 rounded ${isDisabled ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}
                            >
                              {isDisabled ? 'Disabled' : 'Active'}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-[#4a3b32] mb-2 border-b border-[#d2c2a5]">Items & Potions</h4>
                <textarea 
                  value={hero.items} onChange={e => updateHero(hero.id, { items: e.target.value })}
                  className="w-full h-24 p-2 bg-white border border-[#d2c2a5] rounded text-sm focus:outline-none"
                  placeholder="Healing Potion x2&#10;Sword..."
                />
              </div>
              <div>
                <h4 className="font-bold text-[#4a3b32] mb-2 border-b border-[#d2c2a5]">Background / Notes</h4>
                <textarea 
                  value={hero.notes} onChange={e => updateHero(hero.id, { notes: e.target.value })}
                  className="w-full h-24 p-2 bg-white border border-[#d2c2a5] rounded text-sm focus:outline-none"
                  placeholder="Personality, ideals, appearance..."
                />
              </div>
            </div>

          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <button 
          onClick={createHero}
          className="w-full py-3 bg-[#8c2a2a] hover:bg-[#6b1e1e] text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow"
        >
          <Plus size={20} /> Create New Hero
        </button>

        {heroes.length === 0 && (
          <div className="text-center py-12 text-[#8c8c8c]">
            <UserCircle size={48} className="mx-auto mb-2 opacity-50" />
            <p>No heroes in your party yet.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {heroes.map(hero => (
            <div 
              key={hero.id} 
              onClick={() => setEditingHero(hero.id)}
              className="bg-[#f8f4e6] p-4 rounded-lg shadow border border-[#d2c2a5] cursor-pointer hover:border-[#8c2a2a] hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-3 border-b border-[#d2c2a5] pb-2">
                <div>
                  <h3 className="font-bold text-[#4a3b32] text-xl">{hero.name}</h3>
                  <p className="text-sm text-[#8c2a2a]">{hero.race} {hero.class}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#8c8c8c] uppercase">Stamina</div>
                  <div className="font-bold text-[#8c2a2a]">{hero.currentStamina} / {hero.maxStamina}</div>
                </div>
              </div>
              
              <div className="text-sm text-[#5c4a3d] mb-2 flex-1">
                <strong>Skills ({hero.skills.length}):</strong> {hero.skills.join(', ') || 'None'}
              </div>
              
              <div className="text-sm text-[#5c4a3d]">
                <strong>Items:</strong> {hero.items ? hero.items.substring(0, 30) + (hero.items.length > 30 ? '...' : '') : 'None'}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVillageTab = () => {
    const renderTrack = (label, current, max, trackKey) => (
      <div className="mb-4">
        <div className="flex justify-between items-end mb-1">
          <span className="font-bold text-[#4a3b32]">{label}</span>
          <span className="text-xs text-[#8c8c8c] font-bold">{current} / {max}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {Array.from({length: max}).map((_, i) => (
            <button
              key={i}
              onClick={() => updateProgress(trackKey, current === i + 1 ? i : i + 1)}
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded border flex items-center justify-center transition-colors ${
                i < current 
                  ? 'bg-[#8c2a2a] border-[#5c1a1a] text-white' 
                  : 'bg-white border-[#d2c2a5] hover:bg-[#e8e0cc]'
              }`}
            >
              {i < current && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>
    );

    const maxTime = DAY_SLOTS[village.day] || 8;
    const timeLabels = ['Morning', 'Afternoon', 'Evening', 'Night'];

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        
        <div className="bg-[#f8f4e6] p-4 sm:p-6 rounded-lg shadow-md border border-[#d2c2a5]">
          <h3 className="text-xl font-bold text-[#4a3b32] mb-4 flex items-center gap-2 border-b border-[#d2c2a5] pb-2">
            <Clock size={20}/> Time Tracker (Dragonholt Village)
          </h3>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div className="text-center sm:text-left">
              <div className="text-sm font-bold text-[#8c8c8c] uppercase tracking-wider mb-1">Current Day</div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateProgress('day', Math.max(1, village.day - 1))} className="p-2 bg-[#e8e0cc] rounded-full hover:bg-[#d2c2a5]"><Minus size={16}/></button>
                <span className="text-3xl font-bold text-[#8c2a2a] w-12 text-center">Day {village.day}</span>
                <button onClick={() => updateProgress('day', Math.min(7, village.day + 1))} className="p-2 bg-[#e8e0cc] rounded-full hover:bg-[#d2c2a5]"><Plus size={16}/></button>
              </div>
            </div>

            <div className="flex-1 w-full text-center">
              <div className="text-sm font-bold text-[#8c8c8c] uppercase tracking-wider mb-2">Time Passed</div>
              <div className="flex justify-center flex-wrap gap-2 mb-3">
                {Array.from({length: maxTime}).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                      i < village.time 
                        ? 'bg-[#4a3b32] border-[#2a1b12] text-white scale-110' 
                        : 'bg-white border-[#d2c2a5] text-transparent'
                    }`}
                  >
                    {i < village.time && <Check size={14}/>}
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4">
                 <button onClick={() => updateProgress('time', Math.max(0, village.time - 1))} disabled={village.time === 0} className="px-3 py-1 bg-[#e8e0cc] text-[#5c4a3d] rounded hover:bg-[#d2c2a5] disabled:opacity-50">Rewind</button>
                 <button onClick={advanceTime} disabled={village.time >= maxTime} className="px-4 py-1 bg-[#8c2a2a] text-white rounded font-bold hover:bg-[#6b1e1e] disabled:opacity-50">Advance Time</button>
                 <button onClick={nextDay} className="px-3 py-1 bg-[#5c4a3d] text-white rounded hover:bg-[#4a3b32]">Next Day</button>
              </div>
              {village.time >= maxTime && (
                <div className="mt-2 text-sm text-[#8c2a2a] font-bold animate-pulse">
                  Time to end the day! Read the end-of-day entry.
                </div>
              )}
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
  };

  const renderAchievementsTab = () => (
    <div className="bg-[#f8f4e6] p-4 sm:p-6 rounded-lg shadow border border-[#d2c2a5] animate-in fade-in duration-300">
      <h3 className="text-xl font-bold text-[#4a3b32] mb-4 flex items-center gap-2 border-b border-[#d2c2a5] pb-2">
        <Award size={20}/> Campaign Achievements
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ACHIEVEMENTS.map(ach => {
          const isDone = achievements.includes(ach);
          return (
            <div 
              key={ach}
              onClick={() => toggleAchievement(ach)}
              className={`p-3 rounded border cursor-pointer flex items-start gap-3 transition-colors ${
                isDone 
                  ? 'bg-[#e8f0e6] border-[#8cb38c]' 
                  : 'bg-white border-[#d2c2a5] hover:bg-[#e8e0cc]'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border ${
                isDone ? 'bg-[#4a8c4a] border-[#2a5c2a] text-white' : 'bg-gray-50 border-gray-300'
              }`}>
                {isDone && <Check size={14} />}
              </div>
              <span className={`text-sm ${isDone ? 'text-[#2a5c2a] font-bold line-through opacity-80' : 'text-[#4a3b32]'}`}>
                {ach}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e8e0cc] text-gray-800 font-sans selection:bg-[#8c2a2a] selection:text-white pb-24 md:pb-8">
      
      {/* Header */}
      <header className="bg-[#2a1b12] text-[#f8f4e6] shadow-md border-b-4 border-[#8c2a2a]">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Book size={32} className="text-[#c49a45]" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-wider uppercase text-center sm:text-left">Legacy of Dragonholt</h1>
              <p className="text-xs sm:text-sm text-[#d2c2a5] uppercase tracking-[0.2em] text-center sm:text-left">Campaign Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportSave} className="px-3 py-2 rounded bg-[#5c4a3d] hover:bg-[#6b5849] text-xs font-bold flex items-center gap-1.5" title="Export a backup save">
              <Save size={15} /> Backup
            </button>
            <button onClick={() => importInputRef.current?.click()} className="px-3 py-2 rounded bg-[#8c2a2a] hover:bg-[#a33333] text-xs font-bold" title="Restore a backup save">
              Restore
            </button>
            <input ref={importInputRef} type="file" accept="application/json,.json" onChange={importSave} className="hidden" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2 mb-6 border-b border-[#c2b29a] pb-2">
          {[
            { id: 'party', icon: Book, label: 'Party & Story' },
            { id: 'heroes', icon: Users, label: 'Heroes' },
            { id: 'village', icon: Map, label: 'Village Progress' },
            { id: 'achievements', icon: Award, label: 'Achievements' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#f8f4e6] text-[#8c2a2a] border border-b-0 border-[#d2c2a5] translate-y-[1px]' 
                  : 'text-[#5c4a3d] hover:bg-[#d2c2a5] border border-transparent'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'party' && renderPartyTab()}
          {activeTab === 'heroes' && renderHeroesTab()}
          {activeTab === 'village' && renderVillageTab()}
          {activeTab === 'achievements' && renderAchievementsTab()}
        </div>

      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#2a1b12] text-[#d2c2a5] shadow-[0_-4px_6px_rgba(0,0,0,0.3)] z-50 flex justify-around p-2 pb-safe border-t border-[#8c2a2a]">
        {[
          { id: 'party', icon: Book, label: 'Story' },
          { id: 'heroes', icon: Users, label: 'Heroes' },
          { id: 'village', icon: Map, label: 'Village' },
          { id: 'achievements', icon: Award, label: 'Awards' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center p-2 min-w-[4rem] rounded-xl transition-colors ${
              activeTab === tab.id ? 'text-[#f8f4e6] bg-[#8c2a2a]' : 'hover:text-white hover:bg-[#4a3b32]'
            }`}
          >
            <tab.icon size={22} className="mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}