export function getPartyScreenModel(party) {
  return {
    fame: party.fame,
    gold: party.gold,
    notes: party.notes,
    storyPoints: party.storyPoints,
    storyPointCount: party.storyPoints.length
  };
}
