import { DAY_SLOTS } from '../data/gameData';

export function getVillageTimeSummary(village) {
  const slots = DAY_SLOTS[village.day] || 8;
  return {
    day: village.day,
    elapsed: village.time,
    total: slots,
    remaining: Math.max(0, slots - village.time),
    complete: village.time >= slots
  };
}

export function getPartySummary(campaign) {
  return {
    fame: campaign.party.fame,
    gold: campaign.party.gold,
    storyPointCount: campaign.party.storyPoints.length,
    heroCount: campaign.heroes.length,
    achievementCount: campaign.achievements.length
  };
}

export function getHeroById(heroes, id) {
  return heroes.find(hero => hero.id === id) || null;
}
