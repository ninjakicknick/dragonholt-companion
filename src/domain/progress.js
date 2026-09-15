export function getProgressStatus(value, maximum) {
  const safeMaximum = Math.max(0, Number(maximum || 0));
  const safeValue = Math.max(0, Number(value || 0));
  const current = safeMaximum ? Math.min(safeValue, safeMaximum) : safeValue;

  return {
    current,
    maximum: safeMaximum,
    remaining: Math.max(0, safeMaximum - current),
    complete: safeMaximum > 0 && current >= safeMaximum,
    ratio: safeMaximum > 0 ? current / safeMaximum : 0
  };
}
