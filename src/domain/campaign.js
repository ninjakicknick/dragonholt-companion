export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function adjustNonNegative(value, amount) {
  return Math.max(0, Number(value || 0) + amount);
}

export function toggleInList(values, value) {
  return values.includes(value)
    ? values.filter(item => item !== value)
    : [...values, value];
}
