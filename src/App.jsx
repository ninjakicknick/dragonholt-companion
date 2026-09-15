import React, { useRef, useState } from 'react';
import { Award, Book, Home, Map, Save, Users } from 'lucide-react';
import AchievementsScreen from './screens/AchievementsScreen';
import HeroesScreen from './screens/HeroesScreen';
import PartyScreen from './screens/PartyScreen';
import SessionScreen from './screens/SessionScreen';
import VillageScreen from './screens/VillageScreen';
import { useCampaign } from './state/useCampaign';
import { useCampaignActions } from './state/useCampaignActions';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [editingHero, setEditingHero] = useState(null);
  const importInputRef = useRef(null);
  const campaign = useCampaign();
  const actions = useCampaignActions(campaign);
  const { party, setParty, heroes, village, achievements, replaceCampaign, exportCampaign } = campaign;

  const exportSave = () => {
    const blob = new Blob([JSON.stringify(exportCampaign(), null, 2)], { type: 'application/json' });
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
        replaceCampaign(JSON.parse(reader.result));
        setEditingHero(null);
      } catch {
        alert('That file does not look like a Dragonholt Companion save.');
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  const createHero = () => {
    const hero = actions.createHero();
    setEditingHero(hero.id);
  };

  const deleteHero = id => {
    actions.deleteHero(id);
    setEditingHero(null);
  };

  const heroScreenProps = {
    heroes,
    editingHero,
    setEditingHero,
    createHero,
    updateHero: actions.updateHero,
    deleteHero,
    toggleHeroSkill: actions.toggleHeroSkill,
    toggleDisabledSkill: actions.toggleDisabledSkill
  };

  const tabs = [
    { id: 'home', icon: Home, desktop: 'Session', mobile: 'Session' },
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
          {activeTab === 'home' && <SessionScreen party={party} heroes={heroes} village={village} onAdvanceTime={actions.advanceTime} onOpenParty={() => setActiveTab('party')} onOpenHeroes={() => setActiveTab('heroes')} onOpenVillage={() => setActiveTab('village')} />}
          {activeTab === 'party' && <PartyScreen party={party} setParty={setParty} onToggleStoryPoint={actions.toggleStoryPoint} />}
          {activeTab === 'heroes' && <HeroesScreen {...heroScreenProps} />}
          {activeTab === 'village' && <VillageScreen village={village} advanceTime={actions.advanceTime} nextDay={actions.nextDay} updateProgress={actions.updateProgress} />}
          {activeTab === 'achievements' && <AchievementsScreen achievements={achievements} toggleAchievement={actions.toggleAchievement} />}
        </div>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#2a1b12] text-[#d2c2a5] shadow-[0_-4px_6px_rgba(0,0,0,0.3)] z-50 flex justify-around p-2 pb-safe border-t border-[#8c2a2a]">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center p-2 min-w-[3.5rem] rounded-xl transition-colors ${activeTab === tab.id ? 'text-[#f8f4e6] bg-[#8c2a2a]' : 'hover:text-white hover:bg-[#4a3b32]'}`}><tab.icon size={21} className="mb-1" /><span className="text-[9px] font-bold uppercase tracking-wider">{tab.mobile}</span></button>
        ))}
      </div>
    </div>
  );
}
