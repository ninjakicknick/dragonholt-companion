import { useCampaign } from './useCampaign';
import { useCampaignActions } from './useCampaignActions';

export function useCampaignFacade() {
  const campaign = useCampaign();
  const actions = useCampaignActions(campaign);

  return { campaign, actions };
}
