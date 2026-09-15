export function getStaminaStatus(hero) {
  const maximum = Math.max(0, Number(hero.maxStamina || 0));
  const current = Math.min(maximum, Math.max(0, Number(hero.currentStamina || 0)));
  return {
    current,
    maximum,
    lost: Math.max(0, maximum - current),
    exhausted: maximum > 0 && current === 0
  };
}

export function hasSkill(hero, skill) {
  return Array.isArray(hero.skills) && hero.skills.includes(skill);
}

export function isSkillDisabled(hero, skill) {
  return Array.isArray(hero.disabledSkills) && hero.disabledSkills.includes(skill);
}
