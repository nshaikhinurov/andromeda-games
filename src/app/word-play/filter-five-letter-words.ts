import { shuffle } from "@/lib/shuffle";
import * as fs from "fs";

const filepath = "top_english_nouns_lower_10000.txt";

function getFiveLetterWords(): string[] {
  const fileContent = fs.readFileSync(filepath, "utf-8");
  const words = fileContent.split("\n").map((word) => word.trim());
  const fiveLetterWords = words.filter(
    (word) => word.length === 5 && /^[a-z]+$/.test(word),
  );
  return fiveLetterWords;
}

const letterStraightness: Record<string, number> = {
  A: 1,
  B: 0,
  C: 0,
  D: 0,
  E: 1,
  F: 1,
  G: 0,
  H: 1,
  I: 1,
  J: 0,
  K: 1,
  L: 1,
  M: 1,
  N: 1,
  O: 0,
  P: 0,
  Q: 0,
  R: 0,
  S: 0,
  T: 1,
  U: 0,
  V: 1,
  W: 1,
  X: 1,
  Y: 1,
  Z: 1,
};

function wordToStraightnessBits(word: string): string {
  return word
    .toUpperCase()
    .split("")
    .map((char) => letterStraightness[char].toString())
    .join("");
}

function straightnessBitsToNumber(bits: string): number {
  return parseInt(bits, 2);
}

const fiveLetterWords = getFiveLetterWords();
const straightnessWordMap: Record<number, string[]> = {};

for (const word of fiveLetterWords) {
  const bits = wordToStraightnessBits(word);
  const bitsNumber = straightnessBitsToNumber(bits);

  if (!straightnessWordMap[bitsNumber]) {
    straightnessWordMap[bitsNumber] = [];
  }
  straightnessWordMap[bitsNumber].push(word);
}

const plaintext = "Revelation".toUpperCase();

function findCipherWithBacktracking(
  plaintextIndex: number,
  currentCiphertext: string,
): string {
  // Базовый случай - все символы зашифрованы
  if (plaintextIndex === plaintext.length) {
    return currentCiphertext;
  }

  const char = plaintext[plaintextIndex];

  // Найти все подходящие слова
  const goodWords = shuffle(
    fiveLetterWords.filter((word) => {
      const bits = wordToStraightnessBits(word);
      const bitsNumber = straightnessBitsToNumber(bits);
      const letterIndex = bitsNumber - 1;
      const newCiphertext = currentCiphertext + word.toUpperCase();

      return newCiphertext[letterIndex] === char;
    }),
  );

  if (goodWords.length === 0) {
    throw new Error(
      `No suitable word found for character: ${char}, ciphertext so far: ${currentCiphertext.match(/.{1,5}/g)?.join(" ")}`,
    );
  }

  // Проверить каждое подходящее слово с бэктрекингом
  for (const word of goodWords) {
    try {
      const newCiphertext = currentCiphertext + word.toUpperCase();
      return findCipherWithBacktracking(plaintextIndex + 1, newCiphertext);
    } catch (error) {
      // Это слово не подходит, пробуем следующее
      continue;
    }
  }

  // Все варианты исчерпаны
  throw new Error(
    `surely No suitable word found for character: ${char}, ciphertext so far: ${currentCiphertext}`,
  );
}

const ciphertext = findCipherWithBacktracking(0, "");

console.log("Plaintext: ", plaintext);
console.log("Ciphertext:", ciphertext.match(/.{1,5}/g)?.join(" "));
console.log(
  "Ciphertext:",
  ciphertext
    .split("")
    .map((char) => letterStraightness[char].toString())
    .join("")
    .match(/.{1,5}/g)
    ?.join(" "),
);
console.log(
  "Ciphertext:",
  ciphertext
    .split("")
    .map((char) => letterStraightness[char].toString())
    .join("")
    .match(/.{1,5}/g)
    ?.join(" ")
    .split(" ")
    .map((bits) => parseInt(bits, 2).toString().padStart(5, " "))
    .join(" "),
);
console.log(
  "Ciphertext:",
  ciphertext
    .split("")
    .map((char) => letterStraightness[char].toString())
    .join("")
    .match(/.{1,5}/g)
    ?.join(" ")
    .split(" ")
    .map((bits) => ciphertext[parseInt(bits, 2) - 1].padStart(5, " "))
    .join(" "),
);
