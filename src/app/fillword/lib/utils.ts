import { Direction, Grid, GridCell, Point, WordItem } from "./types";

// Direction vectors for movement
export const DIRECTION_VECTORS: Record<Direction, Point> = {
  N: { x: 0, y: -1 },
  NE: { x: 1, y: -1 },
  E: { x: 1, y: 0 },
  SE: { x: 1, y: 1 },
  S: { x: 0, y: 1 },
  SW: { x: -1, y: 1 },
  W: { x: -1, y: 0 },
  NW: { x: -1, y: -1 },
};

// Direction labels for UI
export const DIRECTION_LABELS: Record<Direction, string> = {
  N: "↑",
  NE: "↗",
  E: "→",
  SE: "↘",
  S: "↓",
  SW: "↙",
  W: "←",
  NW: "↖",
};

// All available directions
export const ALL_DIRECTIONS: Direction[] = [
  "N",
  "NE",
  "E",
  "SE",
  "S",
  "SW",
  "W",
  "NW",
];

/**
 * Convert 2D grid coordinates to 1D array index
 */
export function pointToIndex(point: Point, width: number): number {
  return point.y * width + point.x;
}

/**
 * Convert 1D array index to 2D grid coordinates
 */
export function indexToPoint(index: number, width: number): Point {
  return {
    x: index % width,
    y: Math.floor(index / width),
  };
}

/**
 * Check if a point is within grid bounds
 */
export function isPointInBounds(
  point: Point,
  width: number,
  height: number,
): boolean {
  return point.x >= 0 && point.x < width && point.y >= 0 && point.y < height;
}

/**
 * Calculate all positions a word would occupy given start point and direction
 */
export function calculateWordPositions(
  start: Point,
  direction: Direction,
  wordLength: number,
): Point[] {
  const delta = DIRECTION_VECTORS[direction];
  const positions: Point[] = [];

  for (let i = 0; i < wordLength; i++) {
    positions.push({
      x: start.x + delta.x * i,
      y: start.y + delta.y * i,
    });
  }

  return positions;
}

/**
 * Check if all positions are within grid bounds
 */
export function arePositionsInBounds(
  positions: Point[],
  width: number,
  height: number,
): boolean {
  return positions.every((pos) => isPointInBounds(pos, width, height));
}

/**
 * Create an empty grid with the specified dimensions
 */
export function createEmptyGrid(width: number, height: number): Grid {
  const cells: GridCell[] = [];

  for (let i = 0; i < width * height; i++) {
    cells.push({
      char: "",
      placedWordIds: [],
    });
  }

  return {
    width,
    height,
    cells,
  };
}

/**
 * Get a cell from the grid at the specified position
 */
export function getGridCell(grid: Grid, point: Point): GridCell | null {
  if (!isPointInBounds(point, grid.width, grid.height)) {
    return null;
  }

  const index = pointToIndex(point, grid.width);
  return grid.cells[index];
}

/**
 * Set a cell in the grid at the specified position
 */
export function setGridCell(grid: Grid, point: Point, cell: GridCell): void {
  if (!isPointInBounds(point, grid.width, grid.height)) {
    return;
  }

  const index = pointToIndex(point, grid.width);
  grid.cells[index] = cell;
}

/**
 * Normalize a word for processing (uppercase, trim, etc.)
 */
export function normalizeWord(word: string): string {
  return word
    .trim()
    .toUpperCase()
    .replace(/[^A-ZА-ЯЁ]/g, "");
}

/**
 * Create a WordItem from a string
 */
export function createWordItem(text: string): WordItem {
  const normalizedText = normalizeWord(text);
  return {
    id: crypto.randomUUID(),
    text: normalizedText,
    length: normalizedText.length,
  };
}

/**
 * Parse a string of words (separated by newlines or commas) into WordItems
 */
export function parseWordList(input: string): WordItem[] {
  return input
    .split(/[,\n]/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0)
    .map(createWordItem)
    .filter((item) => item.length > 0);
}

/**
 * Generate random letters for filling empty grid cells
 */
export function getRandomLetter(): string {
  // Bias towards common English letters
  const letters = "AAAAABCCCDEEEEFGGHIIIIJKLMNNNOOOOPQRRRSSSTTTUUUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
}

/**
 * Fill empty cells in the grid with random letters
 */
export function fillEmptyGridCells(grid: Grid): void {
  for (let i = 0; i < grid.cells.length; i++) {
    if (grid.cells[i].char === "") {
      grid.cells[i].char = getRandomLetter();
    }
  }
}

/**
 * Calculate the bounding box area of placed words
 */
export function calculateBoundingBoxArea(placedWords: Point[]): number {
  if (placedWords.length === 0) return 0;

  let minX = placedWords[0].x;
  let maxX = placedWords[0].x;
  let minY = placedWords[0].y;
  let maxY = placedWords[0].y;

  for (const pos of placedWords) {
    minX = Math.min(minX, pos.x);
    maxX = Math.max(maxX, pos.x);
    minY = Math.min(minY, pos.y);
    maxY = Math.max(maxY, pos.y);
  }

  return (maxX - minX + 1) * (maxY - minY + 1);
}
