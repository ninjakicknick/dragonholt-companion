import { useCallback } from 'react';

export function usePartyActions(setParty, setAchievements) {
  const toggleStoryPoint = useCallback(point => {
    setParty(current => ({
      ...current,
      storyPoints: current.storyPoints.includes(point)
        ? current.storyPoints.filter(value => value !== point)
        : [...current.storyPoints, point]
    }));
  }, [setParty]);

  const toggleAchievement = useCallback(achievement => {
    setAchievements(current => current.includes(achievement)
      ? current.filter(value => value !== achievement)
      : [...current, achievement]);
  }, [setAchievements]);

  return { toggleStoryPoint, toggleAchievement };
}
