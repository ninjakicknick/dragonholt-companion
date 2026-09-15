import React, { useEffect, useRef, useState } from 'react';
import { Award, Book, Check, Clock, Map, Minus, Plus, Save, Users } from 'lucide-react';
import { ACHIEVEMENTS, DAY_SLOTS } from './data/gameData';
import HeroesScreen from './screens/HeroesScreen';
import PartyScreen from './screens/PartyScreen';

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
  const [party, setParty] = useState(initialSave.party);
  const [heroes, setHeroes] = useState(initialSave.heroes);
  const [editingHero, setEditingHero] = useState(null);
  const [village, setVillage] = useState(initialSave.village);
  const [achievements, setAchievements] = useState(initialSave.achievements);
  const importInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ party, heroes, village, achievements }));
  }, [party, heroes, village, achievements]);

  const exportSave = () => {
    const save = { version: 1, exportedAt: new Date().toISOString(), party, heroes, village, achievements };
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `dragonholt-save-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importSave = event => {
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

  const toggleStoryPoint = point => {
    setParty(current => ({
      ...current,
      storyPoints: current.storyPoints.includes(point)
        ? current.storyPoints.filter(value => value !== point)
        : [...current.storyPoints, point]
    }));
  };

  const advanceTime = () => {
    setVillage(current => {
      const maxSlots = DAY_SLOTS[current.day] || 8;
      return { ...current, time: Math.min(current.time + 1, maxSlots) };
    });
  };

  const nextDay = () => {
    setVillage(current => ({ ...current, day: Math.min(current.day + 1, 7), time: 0 }));
  };

  const updateProgress = (track, value) => {
    setVillage(current => ({ ...current, [track]: value }));
  };

  const toggleAchievement = achievement => {
    setAchievements(current => current.includes(achievement)
      ? current.filter(value => value !== achievement)
      : [...current, achievement]);
  };

  const createHero = () => {
    const newHero = {
      id: Date.now(),
      name: 'New Hero', race: 'Human', class: 'Wildlander',
      maxStamina: 14, currentStamina: 14, exp: 0,
      skills: [], disabledSkills: [], items: '', notes: ''
    };
    setHeroes(current => [...current, newHero]);
    setEditingHero(newHero.id);
  };

  const updateHero = (id, updates) => {
    setHeroes(current => current.map(hero => hero.id === id ? { ...hero, ...updates } : hero));
  };

  const deleteHero = id => {
    setHeroes(current => current.filter(hero => hero.id !== id));
    setEditingHero(null);
  };

  const toggleHeroSkill = (heroId, skill) => {
    const hero = heroes.find(item => item.id === heroId);
    if (!hero) return;
    updateHero(heroId, {
      skills: hero.skills.includes(skill) ? hero.skills.filter(value => value !== skill) : [...hero.skills, skill]
    });
  };

  const toggleDisabledSkill = (heroId, skill) => {
    const hero = heroes.find(item => item.id === heroId);
    if (!hero) return;
    updateHero(heroId, {
      disabledSkills: hero.disabledSkills.includes(skill)
        ? hero.disabledSkills.filter(value => value !== skill)
        : [...hero.disabledSkills, skill]
    });
  };

  const renderVillageTab = () => {
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
  };

  const renderAchievementsTab = () => (
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

  const heroScreenProps = { heroes, editingHero, setEditingHero, createHero, updateHero, deleteHero, toggleHeroSkill, toggleDisabledSkill };
  const tabs = [
    { id: 'party', icon: Book, desktop: 'Party & Story', mobile: 'Story' },
    { id: 'heroes', icon: Users, desktop: 'Heroes', mobile: 'Heroes' },
    { id: 'village', icon: Map, desktop: 'Village Progress', mobile: 'Village' },
    { id: 'achievements', icon: Award, desktop: 'Achievements', mobile: 'Awards' }
  ];

  return (
    <div className="min-h-screen bg-[#e8e0cc] text-gray-800 font-sans selection:bg-[#8c2a2a] selection:text-white pb-24 md:pb-8">
      <header className="bg-[#2a1b12] text-[#f8f4e6] shadow-md border-b-4 border-[#8c2a2a]">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Book size={32} className="text-[#c49a45]" />
            <div><h1 className="text-2xl sm:text-3xl font-bold tracking-wider uppercase text-center sm:text-left">Legacy of Dragonholt</h1><p className="text-xs sm:text-sm text-[#d2c2a5] uppercase tracking-[0.2em] text-center sm:text-left">Campaign Companion</p></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportSave} className="px-3 py-2 rounded bg-[#5c4a3d] hover:bg-[#6b5849] text-xs font-bold flex items-center gap-1.5" title="Export a backup save"><Save size={15} /> Backup</button>
            <button onClick={() => importInputRef.current?.click()} className="px-3 py-2 rounded bg-[#8c2a2a] hover:bg-[#a33333] text-xs font-bold" title="Restore a backup save">Restore</button>
            <input ref={importInputRef} type="file" accept="application/json,.json" onChange={importSave} className="hidden" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="hidden md:flex gap-2 mb-6 border-b border-[#c2b29a] pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-bold transition-all ${activeTab === tab.id ? 'bg-[#f8f4e6] text-[#8c2a2a] border border-b-0 border-[#d2c2a5] translate-y-[1px]' : 'text-[#5c4a3d] hover:bg-[#d2c2a5] border border-transparent'}`}>
              <tab.icon size={18} />{tab.desktop}
            </button>
          ))}
        </div>
        <div>
          {activeTab === 'party' && <PartyScreen party={party} setParty={setParty} onToggleStoryPoint={toggleStoryPoint} />}
          {activeTab === 'heroes' && <HeroesScreen {...heroScreenProps} />}
          {activeTab === 'village' && renderVillageTab()}
          {activeTab === 'achievements' && renderAchievementsTab()}
        </div>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#2a1b12] text-[#d2c2a5] shadow-[0_-4px_6px_rgba(0,0,0,0.3)] z-50 flex justify-around p-2 pb-safe border-t border-[#8c2a2a]">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center p-2 min-w-[4rem] rounded-xl transition-colors ${activeTab === tab.id ? 'text-[#f8f4e6] bg-[#8c2a2a]' : 'hover:text-white hover:bg-[#4a3b32]'}`}>
            <tab.icon size={22} className="mb-1" /><span className="text-[10px] font-bold uppercase tracking-wider">{tab.mobile}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
