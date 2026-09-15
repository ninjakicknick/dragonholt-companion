export const STORY_POINT_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const STORY_POINT_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];

export function isStoryPoint(value) {
  return typeof value === 'string' && /^[A-Z](?:[1-8])$/.test(value);
}

export function sortStoryPoints(points) {
  return [...points].filter(isStoryPoint).sort((a, b) => {
    const letterOrder = a.charCodeAt(0) - b.charCodeAt(0);
    return letterOrder || Number(a.slice(1)) - Number(b.slice(1));
  });
}
