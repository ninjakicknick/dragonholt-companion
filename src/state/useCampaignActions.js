import { useHeroActions } from './useHeroActions';
import { usePartyActions } from './usePartyActions';
import { useVillageActions } from './useVillageActions';

export function useCampaignActions(campaign) {
  const hero = useHeroActions(campaign.heroes, campaign.setHeroes);
  const party = usePartyActions(campaign.setParty, campaign.setAchievements);
  const village = useVillageActions(campaign.setVillage);

  return { ...party, ...hero, ...village };
}
