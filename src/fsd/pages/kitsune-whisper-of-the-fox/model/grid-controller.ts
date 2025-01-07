import { sleep } from "~/fsd/shared/utils/sleep";
import { ANIMATION_DURATIONS } from "../ui/tile";
import { generateRandomTile } from "./tile-generator";
import { GameGrid, Tile } from "./types";
import { create } from "zustand";

type GameStore = {
  grid: GameGrid;
  score: number;
  setGrid: (grid: GameGrid) => void;
  moveTile: (from: Tile, to: Tile) => void;
  processMatches: () => Promise<void>;
};

export const useGameStore = create<GameStore>()((set, get) => ({
  grid: [],
  score: 0,
  setGrid: (grid) => set({ grid }),

  moveTile: async (from, to) => {
    const { grid } = get();
    const newGrid = grid.map((row) =>
      row.map((tile) =>
        tile.id === from.id ? { ...to } : tile.id === to.id ? { ...from } : tile
      )
    );

    set({ grid: newGrid });
    await sleep(ANIMATION_DURATIONS.layout);

    const matches = findMatches(newGrid);
    if (matches.length === 0) {
      set({ grid: grid });
      await sleep(ANIMATION_DURATIONS.layout);
    }
  },

  processMatches: async () => {
    while (true) {
      const { grid } = get();
      const matches = findMatches(grid);
      if (matches.length === 0) break;

      // Увеличиваем счет
      set((state) => ({ score: state.score + matches.length }));

      // Удаляем совпадения
      const gridAfterRemoval = removeMatches(matches, grid);
      set({ grid: gridAfterRemoval });
      await sleep(ANIMATION_DURATIONS.exit);

      // Заполняем пустоты
      const filledGrid = fillEmptyTiles(gridAfterRemoval);
      set({ grid: filledGrid });
      await sleep(ANIMATION_DURATIONS.layout);
    }
  },
}));

export function generateInitialGrid(size: number): GameGrid {
  function generateRandomGrid(size: number): GameGrid {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, generateRandomTile)
    ) satisfies GameGrid;
  }

  while (true) {
    const grid = generateRandomGrid(size);
    const matches = findMatches(grid);

    if (matches.length === 0) {
      return grid;
    }
  }
}

function findMatches(grid: GameGrid): Tile[] {
  const matches: Tile[] = [];

  const numRows = grid.length;
  const numCols = grid[0].length;

  // Проверка горизонтальных совпадений
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols - 2; col++) {
      const tileType = grid[row][col].type;

      if (
        grid[row][col + 1]?.type === tileType &&
        grid[row][col + 2]?.type === tileType
      ) {
        matches.push(grid[row][col]);
        matches.push(grid[row][col + 1]);
        matches.push(grid[row][col + 2]);
      }
    }
  }

  // Проверка вертикальных совпадений
  for (let col = 0; col < numCols; col++) {
    for (let row = 0; row < numRows - 2; row++) {
      const tileType = grid[row][col].type;

      if (
        grid[row + 1]?.[col]?.type === tileType &&
        grid[row + 2]?.[col]?.type === tileType
      ) {
        matches.push(grid[row][col]);
        matches.push(grid[row + 1][col]);
        matches.push(grid[row + 2][col]);
      }
    }
  }

  const uniqueMatches = Array.from(new Set(matches));

  return uniqueMatches;
}

function removeMatches(matches: Tile[], grid: GameGrid): GameGrid {
  const newGrid = grid.map((row) =>
    row.map<Tile>((tile) =>
      matches.some((match) => match.id === tile.id)
        ? { ...tile, isRemoved: true }
        : tile
    )
  );

  return newGrid;
}

function fillEmptyTiles(grid: GameGrid): GameGrid {
  const gridCopy = grid.map((row) => row.map((tile) => ({ ...tile })));
  const numCols = gridCopy[0].length;

  for (let col = 0; col < numCols; col++) {
    const emptyRows = gridCopy
      .map((row, rowIndex) => (row[col].isRemoved ? rowIndex : null))
      .filter((rowIndex) => rowIndex !== null) as number[];

    for (const emptyRow of emptyRows) {
      for (let row = emptyRow; row > 0; row--) {
        gridCopy[row][col] = { ...gridCopy[row - 1][col] };
      }

      gridCopy[0][col] = generateRandomTile();
    }
  }

  return gridCopy;
}
