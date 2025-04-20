export function shuffle<T>(array: T[]): T[] {
  const elementsToShuffle = [...array];
  const shuffledArray: T[] = [];

  while (elementsToShuffle.length > 0) {
    const randomIndex = Math.floor(Math.random() * elementsToShuffle.length);
    const [element] = elementsToShuffle.splice(randomIndex, 1);
    shuffledArray.push(element);
  }

  return shuffledArray;
}
