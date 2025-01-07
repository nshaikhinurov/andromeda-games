import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { useGameStore } from "../model/grid-controller";
import { Direction, Tile } from "../model/types";
import { TileComponent } from "./tile";

export const GameGridComponent = () => {
  const { grid, moveTile, processMatches } = useGameStore(
    useShallow((state) => ({
      grid: state.grid,
      moveTile: state.moveTile,
      processMatches: state.processMatches,
    }))
  );

  const handleSwap = useCallback(
    async (firstTile: Tile, secondTile: Tile) => {
      await moveTile(firstTile, secondTile);
      await processMatches();
    },
    [moveTile, processMatches]
  );

  const handleSwipe = useCallback(
    (tile: Tile, direction: Direction) => {
      const { rowIndex, colIndex } = grid.reduce(
        (acc, row, rowIndex) => {
          const colIndex = row.findIndex((t) => t.id === tile.id);
          if (colIndex !== -1) {
            return { rowIndex, colIndex };
          }

          return acc;
        },
        { rowIndex: -1, colIndex: -1 }
      );

      if (rowIndex === -1 || colIndex === -1) {
        throw new Error("Tile not found");
      }

      let secondTile: Tile | null = null;
      switch (direction) {
        case "up":
          secondTile = grid[rowIndex - 1][colIndex];
          break;
        case "down":
          secondTile = grid[rowIndex + 1][colIndex];
          break;
        case "left":
          secondTile = grid[rowIndex][colIndex - 1];
          break;
        case "right":
          secondTile = grid[rowIndex][colIndex + 1];
          break;
        default:
          throw new Error("Invalid direction");
      }

      handleSwap(tile, secondTile);
    },
    [grid, handleSwap]
  );

  const tiles = useMemo(() => {
    const renderTile = (tile: Tile, rowIndex: number, colIndex: number) => {
      const availableDirections: Direction[] = [];

      if (rowIndex > 0) {
        availableDirections.push("up");
      }
      if (rowIndex < grid.length - 1) {
        availableDirections.push("down");
      }
      if (colIndex > 0) {
        availableDirections.push("left");
      }
      if (colIndex < grid[rowIndex].length - 1) {
        availableDirections.push("right");
      }

      return (
        <TileComponent
          key={tile.id}
          tile={tile}
          availableDirections={availableDirections}
          onSwipe={(direction) => handleSwipe(tile, direction)}
        />
      );
    };

    return grid.flatMap((row, rowIndex) =>
      row.map((tile, colIndex) => renderTile(tile, rowIndex, colIndex))
    );
  }, [grid, handleSwipe]);

  return (
    tiles.length > 0 && (
      <div className="grid grid-rows-8 grid-cols-8 border-8 border-slate-500 bg-slate-700 rounded-lg p-2">
        {tiles}
      </div>
    )
  );
};
