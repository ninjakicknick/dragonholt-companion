export function getPartyScreenProps(campaign, actions) {
  return {
    party: campaign.party,
    setParty: campaign.setParty,
    onToggleStoryPoint: actions.toggleStoryPoint
  };
}
