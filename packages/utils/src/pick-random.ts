/**
 *
 * @param array
 * @description Picks a random element from an array
 *
 * @returns {T}
 */
export function pickRandom<T>(array: T[] | readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
