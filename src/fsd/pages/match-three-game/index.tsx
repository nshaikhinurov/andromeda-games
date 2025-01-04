"use client";

import { useClientState } from "~/fsd/shared/utils/use-client-state";
import { GameGrid, Tile, TILE_TYPES } from "./model/types";
import { GameGridComponent } from "./ui/game-grid";
import pickRandom from "~/fsd/shared/utils/pick-random";

const generateInitialGrid = (size: number): GameGrid => {
  const generateRandomTile = (row: number, col: number): Tile => ({
    id: `${row}-${col}`,
    type: pickRandom(TILE_TYPES),
  });

  return Array.from({ length: size }, (_, rowIndex) =>
    Array.from({ length: size }, (_, colIndex) =>
      generateRandomTile(rowIndex, colIndex)
    )
  ) satisfies GameGrid;
};

export const MatchThreeGamePage = () => {
  const [initialGrid] = useClientState(() => generateInitialGrid(8));

  return initialGrid && <GameGridComponent initialGrid={initialGrid} />;
};
