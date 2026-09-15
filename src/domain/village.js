import { DAY_SLOTS } from '../data/gameData';

export function getDaySlots(day) {
  return DAY_SLOTS[day] || 8;
}

export function canAdvanceTime(village) {
  return village.time < getDaySlots(village.day);
}

export function canAdvanceDay(village) {
  return village.day < 7;
}
