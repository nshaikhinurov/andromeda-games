import {
  Direction,
  Grid,
  PlacementCandidate,
  PlacementOptions,
  Point,
  WordItem,
} from "./types";
import {
  arePositionsInBounds,
  calculateWordPositions,
  getGridCell,
} from "./utils";

/**
 * Generate all possible placement candidates for a word
 */
export function generateWordCandidates(
  word: WordItem,
  grid: Grid,
  directions: Direction[],
): PlacementCandidate[] {
  const candidates: PlacementCandidate[] = [];

  // Try every starting position in the grid
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const start: Point = { x, y };

      // Try each allowed direction
      for (const direction of directions) {
        const positions = calculateWordPositions(start, direction, word.length);

        // Check if the word fits within grid bounds
        if (arePositionsInBounds(positions, grid.width, grid.height)) {
          const overlapScore = calculateOverlapScore(word, positions, grid);

          candidates.push({
            wordId: word.id,
            start,
            direction,
            positions,
            overlapScore,
          });
        }
      }
    }
  }

  return candidates;
}

/**
 * Calculate overlap score for a placement candidate
 * Higher score means better overlap with existing letters
 */
function calculateOverlapScore(
  word: WordItem,
  positions: Point[],
  grid: Grid,
): number {
  let score = 0;

  for (let i = 0; i < positions.length; i++) {
    const cell = getGridCell(grid, positions[i]);
    if (cell) {
      if (cell.char === "") {
        // Empty cell - neutral
        score += 0;
      } else if (cell.char === word.text[i]) {
        // Matching letter - good overlap
        score += 10;
      } else {
        // Conflicting letter - bad
        score -= 100;
      }
    }
  }

  return score;
}

/**
 * Check if a word placement is valid (doesn't conflict with existing placements)
 */
export function isPlacementValid(
  word: WordItem,
  positions: Point[],
  grid: Grid,
  allowOverlap: boolean,
): boolean {
  for (let i = 0; i < positions.length; i++) {
    const cell = getGridCell(grid, positions[i]);
    if (!cell) return false;

    if (cell.char !== "") {
      if (!allowOverlap) {
        // No overlap allowed and cell is occupied
        return false;
      } else if (cell.char !== word.text[i]) {
        // Overlap allowed but letters don't match
        return false;
      }
    }
  }

  return true;
}

/**
 * Filter candidates to only include valid placements
 */
export function filterValidCandidates(
  candidates: PlacementCandidate[],
  words: Map<string, WordItem>,
  grid: Grid,
  allowOverlap: boolean,
): PlacementCandidate[] {
  return candidates.filter((candidate) => {
    const word = words.get(candidate.wordId);
    if (!word) return false;

    return isPlacementValid(word, candidate.positions, grid, allowOverlap);
  });
}

/**
 * Sort candidates by their desirability (overlap score, then proximity to center)
 */
export function sortCandidatesByScore(
  candidates: PlacementCandidate[],
  grid: Grid,
): PlacementCandidate[] {
  const centerX = grid.width / 2;
  const centerY = grid.height / 2;

  return [...candidates].sort((a, b) => {
    // Primary sort: overlap score (higher is better)
    if (a.overlapScore !== b.overlapScore) {
      return b.overlapScore - a.overlapScore;
    }

    // Secondary sort: distance from center (closer is better)
    const distA = Math.sqrt(
      Math.pow(a.start.x - centerX, 2) + Math.pow(a.start.y - centerY, 2),
    );
    const distB = Math.sqrt(
      Math.pow(b.start.x - centerX, 2) + Math.pow(b.start.y - centerY, 2),
    );

    return distA - distB;
  });
}

/**
 * Generate all candidates for all words
 */
export function generateAllCandidates(
  words: WordItem[],
  grid: Grid,
  options: PlacementOptions,
): Map<string, PlacementCandidate[]> {
  const candidateMap = new Map<string, PlacementCandidate[]>();
  const wordMap = new Map(words.map((word) => [word.id, word]));

  for (const word of words) {
    let candidates = generateWordCandidates(word, grid, options.directions);
    candidates = filterValidCandidates(
      candidates,
      wordMap,
      grid,
      options.allowOverlap,
    );
    candidates = sortCandidatesByScore(candidates, grid);

    candidateMap.set(word.id, candidates);
  }

  return candidateMap;
}
