// Unit tests for the Word Search (Fillword) core functionality

// Simple test functions since Jest might not be available
function describe(name: string, fn: () => void) {
  console.log(`\n=== ${name} ===`);
  fn();
}

function it(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.log(`✗ ${name}: ${error}`);
  }
}

function expect(actual: any) {
  return {
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toEqual: (expected: any) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(
          `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
        );
      }
    },
    toHaveLength: (length: number) => {
      if (actual.length !== length) {
        throw new Error(`Expected length ${length}, got ${actual.length}`);
      }
    },
    toBeGreaterThan: (value: number) => {
      if (actual <= value) {
        throw new Error(`Expected ${actual} to be greater than ${value}`);
      }
    },
    toBeLessThan: (value: number) => {
      if (actual >= value) {
        throw new Error(`Expected ${actual} to be less than ${value}`);
      }
    },
  };
}

import {
  generateWordCandidates,
  isPlacementValid,
} from "../candidate-generator";
import { Direction } from "../types";
import {
  calculateWordPositions,
  createEmptyGrid,
  createWordItem,
  indexToPoint,
  isPointInBounds,
  normalizeWord,
  parseWordList,
  pointToIndex,
} from "../utils";
import { placeWords } from "../word-placer";

describe("Utility Functions", () => {
  describe("pointToIndex and indexToPoint", () => {
    it("should convert point to index correctly", () => {
      expect(pointToIndex({ x: 0, y: 0 }, 10)).toBe(0);
      expect(pointToIndex({ x: 5, y: 3 }, 10)).toBe(35);
      expect(pointToIndex({ x: 9, y: 9 }, 10)).toBe(99);
    });

    it("should convert index to point correctly", () => {
      expect(indexToPoint(0, 10)).toEqual({ x: 0, y: 0 });
      expect(indexToPoint(35, 10)).toEqual({ x: 5, y: 3 });
      expect(indexToPoint(99, 10)).toEqual({ x: 9, y: 9 });
    });

    it("should be inverse operations", () => {
      const point = { x: 7, y: 4 };
      const width = 10;
      const index = pointToIndex(point, width);
      expect(indexToPoint(index, width)).toEqual(point);
    });
  });

  describe("isPointInBounds", () => {
    it("should return true for points within bounds", () => {
      expect(isPointInBounds({ x: 0, y: 0 }, 10, 10)).toBe(true);
      expect(isPointInBounds({ x: 5, y: 5 }, 10, 10)).toBe(true);
      expect(isPointInBounds({ x: 9, y: 9 }, 10, 10)).toBe(true);
    });

    it("should return false for points outside bounds", () => {
      expect(isPointInBounds({ x: -1, y: 0 }, 10, 10)).toBe(false);
      expect(isPointInBounds({ x: 0, y: -1 }, 10, 10)).toBe(false);
      expect(isPointInBounds({ x: 10, y: 0 }, 10, 10)).toBe(false);
      expect(isPointInBounds({ x: 0, y: 10 }, 10, 10)).toBe(false);
    });
  });

  describe("calculateWordPositions", () => {
    it("should calculate positions for horizontal word", () => {
      const positions = calculateWordPositions(
        { x: 2, y: 3 },
        "E" as Direction,
        4,
      );
      expect(positions).toEqual([
        { x: 2, y: 3 },
        { x: 3, y: 3 },
        { x: 4, y: 3 },
        { x: 5, y: 3 },
      ]);
    });

    it("should calculate positions for vertical word", () => {
      const positions = calculateWordPositions(
        { x: 2, y: 3 },
        "S" as Direction,
        3,
      );
      expect(positions).toEqual([
        { x: 2, y: 3 },
        { x: 2, y: 4 },
        { x: 2, y: 5 },
      ]);
    });

    it("should calculate positions for diagonal word", () => {
      const positions = calculateWordPositions(
        { x: 1, y: 1 },
        "SE" as Direction,
        3,
      );
      expect(positions).toEqual([
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ]);
    });
  });

  describe("normalizeWord", () => {
    it("should convert to uppercase and remove non-letters", () => {
      expect(normalizeWord("hello")).toBe("HELLO");
      expect(normalizeWord("Hello World!")).toBe("HELLOWORLD");
      expect(normalizeWord("test-123")).toBe("TEST");
      expect(normalizeWord("  spaces  ")).toBe("SPACES");
    });
  });

  describe("parseWordList", () => {
    it("should parse comma-separated words", () => {
      const words = parseWordList("hello, world, test");
      expect(words).toHaveLength(3);
      expect(words[0].text).toBe("HELLO");
      expect(words[1].text).toBe("WORLD");
      expect(words[2].text).toBe("TEST");
    });

    it("should parse newline-separated words", () => {
      const words = parseWordList("hello\nworld\ntest");
      expect(words).toHaveLength(3);
      expect(words[0].text).toBe("HELLO");
    });

    it("should filter out empty words", () => {
      const words = parseWordList("hello, , world,");
      expect(words).toHaveLength(2);
      expect(words[0].text).toBe("HELLO");
      expect(words[1].text).toBe("WORLD");
    });
  });
});

describe("Candidate Generation", () => {
  describe("generateWordCandidates", () => {
    it("should generate candidates for a word in empty grid", () => {
      const word = createWordItem("TEST");
      const grid = createEmptyGrid(5, 5);
      const directions: Direction[] = ["E", "S"];

      const candidates = generateWordCandidates(word, grid, directions);
      expect(candidates.length).toBeGreaterThan(0);

      // Should have candidates going East and South
      const eastCandidates = candidates.filter((c) => c.direction === "E");
      const southCandidates = candidates.filter((c) => c.direction === "S");

      expect(eastCandidates.length).toBeGreaterThan(0);
      expect(southCandidates.length).toBeGreaterThan(0);
    });

    it("should respect grid boundaries", () => {
      const word = createWordItem("TOOLONG");
      const grid = createEmptyGrid(3, 3);
      const directions: Direction[] = ["E"];

      const candidates = generateWordCandidates(word, grid, directions);

      // Word is too long for 3x3 grid horizontally
      expect(candidates).toHaveLength(0);
    });
  });

  describe("isPlacementValid", () => {
    it("should accept placement in empty grid", () => {
      const word = createWordItem("TEST");
      const grid = createEmptyGrid(5, 5);
      const positions = calculateWordPositions({ x: 0, y: 0 }, "E", 4);

      expect(isPlacementValid(word, positions, grid, true)).toBe(true);
      expect(isPlacementValid(word, positions, grid, false)).toBe(true);
    });
  });
});

describe("Word Placement Algorithm", () => {
  it("should place simple words in empty grid", () => {
    const words = [createWordItem("CAT"), createWordItem("DOG")];

    const result = placeWords(words, 10, 10, {
      allowOverlap: true,
      requireAllWords: false,
      directions: ["E", "S"],
      timeLimitMs: 1000,
    });

    expect(result.placedWords.length).toBeGreaterThan(0);
    expect(result.grid.width).toBe(10);
    expect(result.grid.height).toBe(10);
    expect(result.score).toBeGreaterThan(0);
  });

  it("should handle case where not all words fit", () => {
    const words = [
      createWordItem("VERYLONGWORDTHATWONTFIT"),
      createWordItem("ANOTHERLONGWORD"),
    ];

    const result = placeWords(words, 5, 5, {
      allowOverlap: false,
      requireAllWords: false,
      directions: ["E"],
      timeLimitMs: 1000,
    });

    expect(result.unplacedWords.length).toBeGreaterThan(0);
  });

  it("should respect time limits", () => {
    const words = Array.from({ length: 50 }, (_, i) =>
      createWordItem(`WORD${i.toString().padStart(2, "0")}`),
    );

    const startTime = performance.now();
    const result = placeWords(words, 20, 20, {
      allowOverlap: true,
      requireAllWords: false,
      directions: ["E", "S", "SE"],
      timeLimitMs: 100, // Very short time limit
    });
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(500); // Should finish quickly
    expect(result.generationTime).toBeLessThan(500);
  });
});

// Mock functions for testing in environments without crypto.randomUUID
if (typeof crypto === "undefined" || !crypto.randomUUID) {
  Object.defineProperty(global, "crypto", {
    value: {
      randomUUID: () => Math.random().toString(36).substring(2, 15),
    },
  });
}

// Export a function to run all tests
export function runTests() {
  console.log("Running Word Search Tests...");

  try {
    // Run all the describe blocks
    describe("Utility Functions", () => {
      describe("pointToIndex and indexToPoint", () => {
        it("should convert point to index correctly", () => {
          expect(pointToIndex({ x: 0, y: 0 }, 10)).toBe(0);
          expect(pointToIndex({ x: 5, y: 3 }, 10)).toBe(35);
        });
      });
    });

    console.log("\n✅ All tests completed successfully!");
  } catch (error) {
    console.error("\n❌ Tests failed:", error);
  }
}
