import { describe, expect, it } from 'vitest';
import { getHeroById, getPartySummary, getVillageTimeSummary } from './campaignSelectors';

describe('campaign selectors', () => {
  it('summarizes village time without allowing negative remaining slots', () => {
    expect(getVillageTimeSummary({ day: 3, time: 4 })).toEqual({
      day: 3, elapsed: 4, total: 6, remaining: 2, complete: false
    });
    expect(getVillageTimeSummary({ day: 3, time: 9 }).remaining).toBe(0);
  });

  it('summarizes party state for overview screens', () => {
    const campaign = {
      party: { fame: 2, gold: 100, storyPoints: ['A1', 'B2'] },
      heroes: [{ id: 'hero-1' }],
      achievements: ['One']
    };
    expect(getPartySummary(campaign)).toEqual({
      fame: 2, gold: 100, storyPointCount: 2, heroCount: 1, achievementCount: 1
    });
  });

  it('finds heroes without leaking lookup logic into screens', () => {
    const heroes = [{ id: 'a' }, { id: 'b' }];
    expect(getHeroById(heroes, 'b')).toEqual({ id: 'b' });
    expect(getHeroById(heroes, 'missing')).toBeNull();
  });
});
