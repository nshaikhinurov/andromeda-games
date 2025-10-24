import { generateAllCandidates, isPlacementValid } from "./candidate-generator";
import {
  GenerationStats,
  Grid,
  PlacedWord,
  PlacementOptions,
  PlacementResult,
  WordItem,
} from "./types";
import {
  calculateBoundingBoxArea,
  createEmptyGrid,
  fillEmptyGridCells,
  getGridCell,
} from "./utils";

// Scoring constants
const PLACED_WORD_WEIGHT = 1000;
const OVERLAP_WEIGHT = 10;
const COMPACTNESS_WEIGHT = 1;

/**
 * Main word placement algorithm using greedy approach with backtracking
 */
export function placeWords(
  words: WordItem[],
  gridWidth: number,
  gridHeight: number,
  options: PlacementOptions,
): PlacementResult {
  const startTime = performance.now();
  const grid = createEmptyGrid(gridWidth, gridHeight);
  const placedWords: PlacedWord[] = [];
  const wordMap = new Map(words.map((word) => [word.id, word]));

  // Sort words by length (longest first for better placement)
  const sortedWords = [...words].sort((a, b) => b.length - a.length);

  // Try to place each word
  const unplacedWords: WordItem[] = [];

  for (const word of sortedWords) {
    const placed = tryPlaceWord(word, grid, wordMap, options);

    if (placed) {
      placedWords.push(placed);
      updateGridWithPlacement(grid, word, placed);
    } else {
      unplacedWords.push(word);
    }

    // Check time limit
    if (
      options.timeLimitMs &&
      performance.now() - startTime > options.timeLimitMs
    ) {
      // Add remaining words to unplaced
      const remainingWords = sortedWords.slice(sortedWords.indexOf(word) + 1);
      unplacedWords.push(...remainingWords);
      break;
    }
  }

  // Fill empty cells with random letters
  fillEmptyGridCells(grid);

  // Calculate final score
  const score = calculateFinalScore(placedWords, grid);
  const generationTime = performance.now() - startTime;

  return {
    placedWords,
    grid,
    unplacedWords,
    score,
    generationTime,
  };
}

/**
 * Try to place a single word in the grid
 */
function tryPlaceWord(
  word: WordItem,
  grid: Grid,
  wordMap: Map<string, WordItem>,
  options: PlacementOptions,
): PlacedWord | null {
  // Generate candidates for this word
  const candidates = generateAllCandidates([word], grid, options);
  const wordCandidates = candidates.get(word.id) || [];

  // Try each candidate in order of preference
  for (const candidate of wordCandidates) {
    if (
      isPlacementValid(word, candidate.positions, grid, options.allowOverlap)
    ) {
      return {
        wordId: word.id,
        start: candidate.start,
        direction: candidate.direction,
        positions: candidate.positions,
      };
    }
  }

  return null;
}

/**
 * Update the grid with a word placement
 */
function updateGridWithPlacement(
  grid: Grid,
  word: WordItem,
  placement: PlacedWord,
): void {
  for (let i = 0; i < placement.positions.length; i++) {
    const position = placement.positions[i];
    const cell = getGridCell(grid, position);

    if (cell) {
      cell.char = word.text[i];
      cell.placedWordIds.push(word.id);
    }
  }
}

/**
 * Calculate the final score for a placement result
 */
function calculateFinalScore(placedWords: PlacedWord[], grid: Grid): number {
  const numPlacedWords = placedWords.length;
  const totalOverlaps = calculateTotalOverlaps(placedWords, grid);
  const allPositions = placedWords.flatMap((pw) => pw.positions);
  const boundingBoxArea = calculateBoundingBoxArea(allPositions);

  return (
    numPlacedWords * PLACED_WORD_WEIGHT +
    totalOverlaps * OVERLAP_WEIGHT -
    boundingBoxArea * COMPACTNESS_WEIGHT
  );
}

/**
 * Calculate total number of overlapping letters
 */
function calculateTotalOverlaps(placedWords: PlacedWord[], grid: Grid): number {
  let overlaps = 0;

  for (let i = 0; i < grid.cells.length; i++) {
    const cell = grid.cells[i];
    if (cell.placedWordIds.length > 1) {
      overlaps += cell.placedWordIds.length - 1;
    }
  }

  return overlaps;
}

/**
 * Generate statistics for a placement result
 */
export function generateStats(result: PlacementResult): GenerationStats {
  const totalWords = result.placedWords.length + result.unplacedWords.length;
  const placedWords = result.placedWords.length;
  const totalOverlaps = calculateTotalOverlaps(result.placedWords, result.grid);
  const allPositions = result.placedWords.flatMap((pw) => pw.positions);
  const boundingBoxArea = calculateBoundingBoxArea(allPositions);

  return {
    totalWords,
    placedWords,
    totalOverlaps,
    boundingBoxArea,
    score: result.score,
  };
}

/**
 * Improved placement algorithm with multiple attempts and randomization
 */
export function placeWordsWithMultipleAttempts(
  words: WordItem[],
  gridWidth: number,
  gridHeight: number,
  options: PlacementOptions,
  maxAttempts: number = 3,
): PlacementResult {
  let bestResult: PlacementResult | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Randomize word order for this attempt (except first)
    const wordsToPlace =
      attempt === 0
        ? [...words].sort((a, b) => b.length - a.length)
        : shuffleArray([...words]);

    const result = placeWords(wordsToPlace, gridWidth, gridHeight, options);

    if (!bestResult || result.score > bestResult.score) {
      bestResult = result;
    }

    // If we placed all words, we can stop
    if (result.unplacedWords.length === 0) {
      break;
    }
  }

  return bestResult!;
}

/**
 * Utility function to shuffle an array
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
