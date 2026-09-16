import { DAY_SLOTS } from '../data/gameData';

const toggleInList = (items, value) => items.includes(value)
  ? items.filter(item => item !== value)
  : [...items, value];

export function useCampaignActions({ heroes, setParty, setHeroes, setVillage, setAchievements }) {
  const toggleStoryPoint = point => {
    setParty(current => ({ ...current, storyPoints: toggleInList(current.storyPoints, point) }));
  };

  const advanceTime = () => {
    setVillage(current => ({ ...current, time: Math.min(current.time + 1, DAY_SLOTS[current.day] || 8) }));
  };

  const nextDay = () => {
    setVillage(current => ({ ...current, day: Math.min(current.day + 1, 7), time: 0 }));
  };

  const updateProgress = (track, value) => {
    setVillage(current => ({ ...current, [track]: value }));
  };

  const toggleAchievement = achievement => {
    setAchievements(current => toggleInList(current, achievement));
  };

  const createHero = (details = {}) => {
    const hero = {
      id: Date.now(),
      name: 'New Hero',
      race: 'Human',
      class: 'Wildlander',
      maxStamina: 14,
      currentStamina: 14,
      exp: 0,
      skills: [],
      disabledSkills: [],
      items: '',
      notes: '',
      ...details
    };
    setHeroes(current => [...current, hero]);
    return hero;
  };

  const updateHero = (id, updates) => {
    setHeroes(current => current.map(hero => hero.id === id ? { ...hero, ...updates } : hero));
  };

  const deleteHero = id => {
    setHeroes(current => current.filter(hero => hero.id !== id));
  };

  const toggleHeroSkill = (heroId, skill) => {
    const hero = heroes.find(item => item.id === heroId);
    if (hero) updateHero(heroId, { skills: toggleInList(hero.skills, skill) });
  };

  const toggleDisabledSkill = (heroId, skill) => {
    const hero = heroes.find(item => item.id === heroId);
    if (hero) updateHero(heroId, { disabledSkills: toggleInList(hero.disabledSkills, skill) });
  };

  return {
    toggleStoryPoint,
    advanceTime,
    nextDay,
    updateProgress,
    toggleAchievement,
    createHero,
    updateHero,
    deleteHero,
    toggleHeroSkill,
    toggleDisabledSkill
  };
}
