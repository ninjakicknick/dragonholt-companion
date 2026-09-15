import { useCallback } from 'react';

export function createHeroDraft() {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return {
    id,
    name: 'New Hero',
    race: 'Human',
    class: 'Wildlander',
    maxStamina: 14,
    currentStamina: 14,
    exp: 0,
    skills: [],
    disabledSkills: [],
    items: '',
    notes: ''
  };
}

export function useHeroActions(heroes, setHeroes) {
  const createHero = useCallback(() => {
    const hero = createHeroDraft();
    setHeroes(current => [...current, hero]);
    return hero;
  }, [setHeroes]);

  const updateHero = useCallback((id, updates) => {
    setHeroes(current => current.map(hero => hero.id === id ? { ...hero, ...updates } : hero));
  }, [setHeroes]);

  const deleteHero = useCallback(id => {
    setHeroes(current => current.filter(hero => hero.id !== id));
  }, [setHeroes]);

  const toggleHeroSkill = useCallback((heroId, skill) => {
    setHeroes(current => current.map(hero => {
      if (hero.id !== heroId) return hero;
      const skills = hero.skills.includes(skill)
        ? hero.skills.filter(value => value !== skill)
        : [...hero.skills, skill];
      return { ...hero, skills };
    }));
  }, [setHeroes]);

  const toggleDisabledSkill = useCallback((heroId, skill) => {
    setHeroes(current => current.map(hero => {
      if (hero.id !== heroId) return hero;
      const disabledSkills = hero.disabledSkills.includes(skill)
        ? hero.disabledSkills.filter(value => value !== skill)
        : [...hero.disabledSkills, skill];
      return { ...hero, disabledSkills };
    }));
  }, [setHeroes]);

  return { createHero, updateHero, deleteHero, toggleHeroSkill, toggleDisabledSkill };
}
