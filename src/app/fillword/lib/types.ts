// Core types for the Word Search (Fillword) application

export type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export type Point = {
  x: number;
  y: number;
}; // 0-based, x across, y down

export type WordItem = {
  id: string; // uuid
  text: string; // uppercase, no spaces by default
  length: number;
};

export type PlacedWord = {
  wordId: string;
  start: Point;
  direction: Direction;
  positions: Point[]; // computed cells
};

export type GridCell = {
  char: string; // letter
  placedWordIds: string[]; // one or more words using this cell
};

export type Grid = {
  width: number;
  height: number;
  cells: GridCell[]; // length = width*height, row-major
};

export type PlacementOptions = {
  allowOverlap: boolean; // overlaps allowed only if letters match
  requireAllWords: boolean; // fail if not all placed
  directions: Direction[];
  timeLimitMs?: number; // algorithm time limit
};

// Additional utility types
export type PlacementCandidate = {
  wordId: string;
  start: Point;
  direction: Direction;
  positions: Point[];
  overlapScore: number; // higher is better
};

export type PlacementResult = {
  placedWords: PlacedWord[];
  grid: Grid;
  unplacedWords: WordItem[];
  score: number;
  generationTime: number;
};

export type GenerationStats = {
  totalWords: number;
  placedWords: number;
  totalOverlaps: number;
  boundingBoxArea: number;
  score: number;
};
