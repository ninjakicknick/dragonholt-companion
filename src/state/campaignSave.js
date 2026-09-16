export const STORAGE_KEY = 'dragonholt-companion-save-v1';
export const SAVE_VERSION = 3;

export const DEFAULT_STATE = {
  party: { fame: 2, gold: 100, storyPoints: [], notes: '' },
  heroes: [],
  village: {
    day: 1,
    time: 0,
    heroism: 0,
    academic: 0,
    combat: 0,
    physical: 0,
    social: 0,
    spiritual: 0,
    claimedHeroismMilestones: []
  },
  achievements: []
};

const cloneDefaults = () => JSON.parse(JSON.stringify(DEFAULT_STATE));

export function normalizeCampaign(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const defaults = cloneDefaults();
  const village = { ...defaults.village, ...(source.village || {}) };
  village.claimedHeroismMilestones = Array.isArray(village.claimedHeroismMilestones) ? village.claimedHeroismMilestones : [];

  return {
    party: { ...defaults.party, ...(source.party || {}) },
    heroes: Array.isArray(source.heroes) ? source.heroes : [],
    village,
    achievements: Array.isArray(source.achievements) ? source.achievements : []
  };
}

export function migrateSave(raw) {
  return normalizeCampaign(raw);
}

export function loadCampaign() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? migrateSave(JSON.parse(raw)) : cloneDefaults();
  } catch (error) {
    console.warn('Could not load Dragonholt save:', error);
    return cloneDefaults();
  }
}

export function persistCampaign(campaign) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeCampaign(campaign)));
}

export function makeExport(campaign) {
  return {
    version: SAVE_VERSION,
    exportedAt: new Date().toISOString(),
    ...normalizeCampaign(campaign)
  };
}

export function importCampaign(raw) {
  return migrateSave(raw);
}
