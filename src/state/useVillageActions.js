import { useCallback } from 'react';
import { DAY_SLOTS } from '../data/gameData';

export function useVillageActions(setVillage) {
  const advanceTime = useCallback(() => {
    setVillage(current => {
      const maxSlots = DAY_SLOTS[current.day] || 8;
      return { ...current, time: Math.min(current.time + 1, maxSlots) };
    });
  }, [setVillage]);

  const nextDay = useCallback(() => {
    setVillage(current => ({
      ...current,
      day: Math.min(current.day + 1, 7),
      time: 0
    }));
  }, [setVillage]);

  const updateProgress = useCallback((track, value) => {
    setVillage(current => ({ ...current, [track]: value }));
  }, [setVillage]);

  return { advanceTime, nextDay, updateProgress };
}
