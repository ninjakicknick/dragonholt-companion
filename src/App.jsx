import React, { useEffect, useRef, useState } from 'react';
import { Award, Book, Map, Save, Users } from 'lucide-react';
import { DAY_SLOTS } from './data/gameData';
import AchievementsScreen from './screens/AchievementsScreen';
import HeroesScreen from './screens/HeroesScreen';
import PartyScreen from './screens/PartyScreen';
import VillageScreen from './screens/VillageScreen';

const STORAGE_KEY = 'dragonholt-companion-save-v1';
const DEFAULT_STATE = {
  party: { fame: 2, gold: 100, storyPoints: [], notes: '' },
  heroes: [],
  village: { day: 1, time: 0, heroism: 0, academic: 0, combat: 0, physical: 0, social: 0, spiritual: 0 },
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

  const toggleStoryPoint = point => setParty(current => ({ ...current, storyPoints: current.storyPoints.includes(point) ? current.storyPoints.filter(value => value !== point) : [...current.storyPoints, point] }));
  const advanceTime = () => setVillage(current => ({ ...current, time: Math.min(current.time + 1, DAY_SLOTS[current.day] || 8) }));
  const nextDay = () => setVillage(current => ({ ...current, day: Math.min(current.day + 1, 7), time: 0 }));
  const updateProgress = (track, value) => setVillage(current => ({ ...current, [track]: value }));
  const toggleAchievement = achievement => setAchievements(current => current.includes(achievement) ? current.filter(value => value !== achievement) : [...current, achievement]);

  const createHero = () => {
    const newHero = { id: Date.now(), name: 'New Hero', race: 'Human', class: 'Wildlander', maxStamina: 14, currentStamina: 14, exp: 0, skills: [], disabledSkills: [], items: '', notes: '' };
    setHeroes(current => [...current, newHero]);
    setEditingHero(newHero.id);
  };
  const updateHero = (id, updates) => setHeroes(current => current.map(hero => hero.id === id ? { ...hero, ...updates } : hero));
  const deleteHero = id => { setHeroes(current => current.filter(hero => hero.id !== id)); setEditingHero(null); };
  const toggleHeroSkill = (heroId, skill) => {
    const hero = heroes.find(item => item.id === heroId);
    if (hero) updateHero(heroId, { skills: hero.skills.includes(skill) ? hero.skills.filter(value => value !== skill) : [...hero.skills, skill] });
  };
  const toggleDisabledSkill = (heroId, skill) => {
    const hero = heroes.find(item => item.id === heroId);
    if (hero) updateHero(heroId, { disabledSkills: hero.disabledSkills.includes(skill) ? hero.disabledSkills.filter(value => value !== skill) : [...hero.disabledSkills, skill] });
  };

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
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-bold transition-all ${activeTab === tab.id ? 'bg-[#f8f4e6] text-[#8c2a2a] border border-b-0 border-[#d2c2a5] translate-y-[1px]' : 'text-[#5c4a3d] hover:bg-[#d2c2a5] border border-transparent'}`}><tab.icon size={18} />{tab.desktop}</button>
          ))}
        </div>
        <div>
          {activeTab === 'party' && <PartyScreen party={party} setParty={setParty} onToggleStoryPoint={toggleStoryPoint} />}
          {activeTab === 'heroes' && <HeroesScreen {...heroScreenProps} />}
          {activeTab === 'village' && <VillageScreen village={village} advanceTime={advanceTime} nextDay={nextDay} updateProgress={updateProgress} />}
          {activeTab === 'achievements' && <AchievementsScreen achievements={achievements} toggleAchievement={toggleAchievement} />}
        </div>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#2a1b12] text-[#d2c2a5] shadow-[0_-4px_6px_rgba(0,0,0,0.3)] z-50 flex justify-around p-2 pb-safe border-t border-[#8c2a2a]">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center p-2 min-w-[4rem] rounded-xl transition-colors ${activeTab === tab.id ? 'text-[#f8f4e6] bg-[#8c2a2a]' : 'hover:text-white hover:bg-[#4a3b32]'}`}><tab.icon size={22} className="mb-1" /><span className="text-[10px] font-bold uppercase tracking-wider">{tab.mobile}</span></button>
        ))}
      </div>
    </div>
  );
}
