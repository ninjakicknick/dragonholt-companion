export const RACES = {
  Human: {
    tagline: 'Diverse, resilient, and quick to adapt.',
    skills: ['Deception', 'Empathy', 'Persuasion', 'Streetwise', 'Military', 'Willpower']
  },
  Orc: {
    tagline: 'Powerful, hardy, and at home in the wild.',
    skills: ['Athletics', 'Endurance', 'Brawling', 'Dueling', 'Survival', 'Devotion']
  },
  Dwarf: {
    tagline: 'Stout, steadfast, and proud of craft and history.',
    skills: ['Athletics', 'Endurance', 'Willpower', 'Craftsmanship', 'History', 'Military']
  },
  Elf: {
    tagline: 'Graceful, long-lived, and steeped in ancient knowledge.',
    skills: ['Agility', 'Archery', 'Dueling', 'Arcana', 'History', 'Devotion']
  },
  Gnome: {
    tagline: 'Clever, nimble, sociable, and resourceful.',
    skills: ['Alchemy', 'Craftsmanship', 'Performance', 'Persuasion', 'Streetwise', 'Stealth']
  },
  Catfolk: {
    tagline: 'Agile, perceptive hunters with sharp natural instincts.',
    skills: ['Agility', 'Awareness', 'Survival', 'Athletics', 'Stealth', 'Brawling']
  }
};

export const CLASSES = {
  Apothecary: {
    tagline: 'A brewer, healer, merchant, and seeker of rare ingredients.',
    skills: ['Alchemy', 'Craftsmanship', 'Persuasion', 'Reasoning', 'Survival', 'Arcana']
  },
  Bard: {
    tagline: 'A trained performer, storyteller, traveler, and student of people.',
    skills: ['Performance', 'Deception', 'Empathy', 'Persuasion', 'Streetwise', 'History']
  },
  Brawler: {
    tagline: 'A self-taught fighter forged by hard knocks and experience.',
    skills: ['Brawling', 'Athletics', 'Endurance', 'Dueling', 'Streetwise', 'Willpower']
  },
  Knight: {
    tagline: 'A noble warrior trained in combat, vigilance, and devotion.',
    skills: ['Military', 'Athletics', 'Awareness', 'Dueling', 'Devotion', 'Willpower']
  },
  Sage: {
    tagline: 'A scholar devoted to history, learning, and hidden knowledge.',
    skills: ['History', 'Arcana', 'Runes', 'Reasoning', 'Craftsmanship', 'Devotion']
  },
  Thief: {
    tagline: 'A quick-witted criminal who survives through subtlety and skill.',
    skills: ['Deception', 'Reasoning', 'Agility', 'Stealth', 'Streetwise', 'Thievery']
  },
  Wildlander: {
    tagline: 'An independent wilderness expert who thrives beyond civilization.',
    skills: ['Archery', 'Survival', 'Endurance', 'Awareness', 'Stealth', 'Athletics']
  }
};

export const staminaForSkillCount = skillCount => Math.max(8, 14 - Math.max(0, skillCount - 5) * 2);
