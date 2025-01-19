import { memo, useCallback, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { useGameStore } from "../model/game-store";
import { Tile } from "../model/types";
import { TileComponent } from "~/fsd/entities/tile";
import { Direction } from "~/fsd/entities/direction";

export const GameGridComponent = () => {
  const { grid } = useGameStore(
    useShallow((state) => ({
      grid: state.grid,
    }))
  );

  const tiles = grid.flatMap((row, rowIndex) =>
    row.map((tile, colIndex) => (
      <TileController
        key={tile.id}
        tile={tile}
        rowIndex={rowIndex}
        colIndex={colIndex}
        gridSize={grid.length}
      />
    ))
  );

  return (
    tiles.length > 0 && (
      <div className="w-full aspect-square grid grid-rows-8 grid-cols-8 border-8 border-slate-500 bg-slate-700 rounded-lg p-2">
        {tiles}
      </div>
    )
  );
};

type TileControllerProps = {
  rowIndex: number;
  colIndex: number;
  gridSize: number;
  tile: Tile;
};

const TileController = memo(function TileController({
  rowIndex,
  colIndex,
  gridSize,
  tile,
}: TileControllerProps) {
  const { findTile, moveTile, processMatches } = useGameStore(
    useShallow((state) => ({
      findTile: state.findTile,
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

  const availableDirections = useMemo<Direction[]>(() => {
    const availableDirections: Direction[] = [];

    if (rowIndex > 0) {
      availableDirections.push("up");
    }
    if (rowIndex < gridSize - 1) {
      availableDirections.push("down");
    }
    if (colIndex > 0) {
      availableDirections.push("left");
    }
    if (colIndex < gridSize - 1) {
      availableDirections.push("right");
    }

    return availableDirections;
  }, [colIndex, gridSize, rowIndex]);

  const handleSwipe = useCallback(
    (tile: Tile, direction: Direction) => {
      let secondTile: Tile | undefined;

      switch (direction) {
        case "up":
          secondTile = findTile(rowIndex - 1, colIndex);
          break;
        case "down":
          secondTile = findTile(rowIndex + 1, colIndex);
          break;
        case "left":
          secondTile = findTile(rowIndex, colIndex - 1);
          break;
        case "right":
          secondTile = findTile(rowIndex, colIndex + 1);
          break;
        default:
          throw new Error("Invalid direction");
      }

      if (secondTile) {
        handleSwap(tile, secondTile);
      }
    },
    [colIndex, findTile, handleSwap, rowIndex]
  );

  const handlePan = useCallback(
    (tile: Tile, x: number, y: number) => {
      const direction = getDirection(x, y);

      if (!availableDirections.includes(direction)) {
        return;
      }

      handleSwipe(tile, direction);
    },
    [availableDirections, handleSwipe]
  );

  return (
    <TileComponent
      key={tile.id}
      tile={tile}
      handlePan={(x, y) => handlePan(tile, x, y)}
    />
  );
});

function getDirection(x: number, y: number): Direction {
  let direction: Direction | null = null;

  if (Math.abs(x) > Math.abs(y)) {
    direction = x > 0 ? "right" : "left";
  } else {
    direction = y > 0 ? "down" : "up";
  }

  return direction;
}
