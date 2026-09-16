export const HEROISM_MILESTONES = [
  { value: 8, xp: 1, fame: 1, stamina: 0 },
  { value: 16, xp: 1, fame: 1, stamina: 2 },
  { value: 24, xp: 1, fame: 1, stamina: 0 }
];

export const TRAINING_TRACKS = {
  academic: {
    label: 'Academic Study',
    max: 6,
    skills: ['Alchemy', 'Arcana', 'History', 'Reasoning', 'Runes', 'Survival']
  },
  combat: {
    label: 'Combat Training',
    max: 6,
    skills: ['Archery', 'Brawling', 'Dueling', 'Military']
  },
  physical: {
    label: 'Physical Training',
    max: 6,
    skills: ['Agility', 'Athletics', 'Endurance', 'Stealth']
  },
  social: {
    label: 'Social Practice',
    max: 6,
    skills: ['Deception', 'Empathy', 'Performance', 'Persuasion', 'Streetwise']
  },
  spiritual: {
    label: 'Spiritual Meditation',
    max: 5,
    skills: ['Awareness', 'Devotion', 'Willpower']
  }
};

export const unlockedTrainingSkills = village => Object.entries(TRAINING_TRACKS)
  .filter(([key, track]) => (village[key] || 0) >= track.max)
  .flatMap(([, track]) => track.skills);
