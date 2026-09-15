import { useCallback } from 'react';
import { toggleInList } from '../domain/campaign';

export function usePartyActions(setParty, setAchievements) {
  const toggleStoryPoint = useCallback(point => {
    setParty(current => ({
      ...current,
      storyPoints: toggleInList(current.storyPoints, point)
    }));
  }, [setParty]);

  const toggleAchievement = useCallback(achievement => {
    setAchievements(current => toggleInList(current, achievement));
  }, [setAchievements]);

  return { toggleStoryPoint, toggleAchievement };
}
