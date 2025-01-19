import { sleep } from "~/fsd/shared/utils/sleep";
import { generateRandomTile } from "./tile-generator";
import { GameGrid, Tile } from "./types";
import { create } from "zustand";
import _ from "lodash";
import { ANIMATION_DURATIONS } from "~/fsd/entities/tile";

type GameStore = {
  grid: GameGrid;
  findTile: (rowIndex: number, colIndex: number) => Tile | undefined;
  score: number;
  gemsCollected: number;
  setGrid: (grid: GameGrid) => void;
  moveTile: (from: Tile, to: Tile) => void;
  processMatches: () => Promise<void>;

  // Управление временем
  timerProgress: number; // Прогресс таймера (от 0 до 1)
  setTimerProgress: (progress: number) => void;
  timerSpeed: number; // Скорость таймера (1 — нормальная, <1 — замедление, 0 — пауза)
  setTimerSpeed: (speed: number) => void;

  // Завершение игры
  isGameOver: boolean;
  endGame: () => void;
};

export const useGameStore = create<GameStore>()((set, get) => ({
  grid: [],
  findTile: (rowIndex, colIndex) => get().grid.at(rowIndex)?.at(colIndex),
  score: 0,
  gemsCollected: 0,
  setGrid: (grid) => set({ grid }),
  isGameOver: false,
  endGame: () => set({ isGameOver: true }),

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
      const { grid, isGameOver } = get();

      if (isGameOver) {
        break;
      }

      const matches = findMatches(grid);
      if (matches.length === 0) {
        break;
      }

      // Увеличиваем счет
      set((state) => ({
        score: state.score + matches.length,
        gemsCollected:
          state.gemsCollected + matches.filter((tile) => tile.hasGem).length,
      }));

      // Удаляем совпадения
      set(({ grid }) => ({ grid: removeMatches(matches, grid) }));
      await sleep(ANIMATION_DURATIONS.exit);

      // Заполняем пустоты
      set(({ grid }) => ({ grid: fillEmptyTiles(grid) }));
      await sleep(ANIMATION_DURATIONS.layout);
    }
  },

  // Управление временем
  timerProgress: 1,
  setTimerProgress: (progress) => {
    set((state) => {
      if (progress <= 0) {
        state.endGame();
        return { timerProgress: 0 };
      }

      return { timerProgress: _.clamp(progress, 0, 1) };
    });
  },

  timerSpeed: 1,
  setTimerSpeed: (speed) => set({ timerSpeed: _.clamp(speed, 0, 1) }),
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
