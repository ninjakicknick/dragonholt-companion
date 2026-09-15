import { useEffect, useRef, useState } from 'react';
import { importCampaign, loadCampaign, makeExport, persistCampaign } from './campaignSave';

export function useCampaign() {
  const initial = useRef(loadCampaign()).current;
  const [party, setParty] = useState(initial.party);
  const [heroes, setHeroes] = useState(initial.heroes);
  const [village, setVillage] = useState(initial.village);
  const [achievements, setAchievements] = useState(initial.achievements);

  useEffect(() => {
    persistCampaign({ party, heroes, village, achievements });
  }, [party, heroes, village, achievements]);

  const replaceCampaign = raw => {
    const next = importCampaign(raw);
    setParty(next.party);
    setHeroes(next.heroes);
    setVillage(next.village);
    setAchievements(next.achievements);
    return next;
  };

  const exportCampaign = () => makeExport({ party, heroes, village, achievements });

  return {
    party,
    setParty,
    heroes,
    setHeroes,
    village,
    setVillage,
    achievements,
    setAchievements,
    replaceCampaign,
    exportCampaign
  };
}
