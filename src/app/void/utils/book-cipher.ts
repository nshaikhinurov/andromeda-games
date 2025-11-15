export function bookCipherEncode(
  plainText: string,
  messageText: string,
): string | null {
  // Нормализуем текст для поиска
  const normalizedMessage = messageText.toLowerCase();

  // Разбиваем plainText на строки и слова
  const lines = plainText.split("\n");

  // Для каждой буквы сообщения найдем случайную кодировку
  const letterCodes: string[] = [];

  for (const letter of normalizedMessage) {
    const lineCandidateIndexes: number[] = [];

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(letter)) {
        lineCandidateIndexes.push(i);
      }
    }

    if (lineCandidateIndexes.length === 0) {
      return null;
    }

    const randomLineIndex = pickRandom(lineCandidateIndexes);
    const pickedLine = lines[randomLineIndex];

    const words = pickedLine.split(/\s+/).filter((word) => word.length > 0);

    const wordCandidateIndexes: number[] = [];

    for (let j = 0; j < words.length; j++) {
      if (words[j].toLowerCase().includes(letter)) {
        wordCandidateIndexes.push(j);
      }
    }

    if (wordCandidateIndexes.length === 0) {
      return null;
    }

    const randomWordIndex = pickRandom(wordCandidateIndexes);
    const pickedWord = words[randomWordIndex];

    const charCandidateIndexes: number[] = [];

    for (let k = 0; k < pickedWord.length; k++) {
      if (pickedWord[k].toLowerCase() === letter) {
        charCandidateIndexes.push(k);
      }
    }

    if (charCandidateIndexes.length === 0) {
      return null;
    }

    const randomCharIndex = pickRandom(charCandidateIndexes);
    const code = `${randomLineIndex + 1}-${randomWordIndex + 1}-${randomCharIndex + 1}`;
    letterCodes.push(code);
  }

  return letterCodes.join(" ");
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const test = `i know a bank where the
wild thyme blows,
where oxlips and the
nodding violet grows`;
// Пример использования
const message = "theatre";
const encoded = bookCipherEncode(test, message);
console.log(encoded);
