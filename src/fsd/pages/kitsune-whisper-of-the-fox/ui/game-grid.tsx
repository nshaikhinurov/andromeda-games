import { useCallback, useMemo, useState } from "react";
import { useGameStore } from "../model/grid-controller";
import { Tile } from "../model/types";
import { TileComponent } from "./tile";
import { useShallow } from "zustand/shallow";

type TileSelection = {
  tile: Tile;
  position: {
    rowIndex: number;
    colIndex: number;
  };
};

export const GameGridComponent = () => {
  const { grid, moveTile, processMatches } = useGameStore(
    useShallow((state) => ({
      grid: state.grid,
      moveTile: state.moveTile,
      processMatches: state.processMatches,
    }))
  );

  const [tileSelections, setTileSelections] = useState<TileSelection[]>([]);

  // const handleSwipe = (

  //   firstTile: Tile,
  //   direction: Direction,
  //   rowIndex: number,
  //   colIndex: number
  // ) => {
  //   console.log(`Swipe ${direction} on tile ${firstTile.id}`);

  //   let secondTile: Tile | null = null;
  //   switch (direction) {
  //     case "up":
  //       secondTile = grid[rowIndex - 1][colIndex];
  //       break;
  //     case "down":
  //       secondTile = grid[rowIndex + 1][colIndex];
  //       break;
  //     case "left":
  //       secondTile = grid[rowIndex][colIndex - 1];
  //       break;
  //     case "right":
  //       secondTile = grid[rowIndex][colIndex + 1];
  //       break;
  //     default:
  //       throw new Error("Invalid direction");
  //   }

  //   const newGrid = grid.map((row) =>
  //     row.map((tile) => {
  //       if (tile.id === firstTile.id) {
  //         return secondTile;
  //       }

  //       if (tile.id === secondTile.id) {
  //         return firstTile;
  //       }

  //       return tile;
  //     })
  //   );

  //   setGrid(newGrid);
  // };

  const handleSwap = useCallback(
    async (firstTile: Tile, secondTile: Tile) => {
      await moveTile(firstTile, secondTile);
      await processMatches();
    },
    [moveTile, processMatches]
  );

  const handleSelect = useCallback(
    (tile: Tile, rowIndex: number, colIndex: number) => {
      const isSelectionEmpty = tileSelections.length === 0;

      if (isSelectionEmpty) {
        setTileSelections([
          {
            tile,
            position: { rowIndex, colIndex },
          },
        ]);
        return;
      }

      const [firstSelection] = tileSelections;
      const isSameTile = firstSelection.tile.id === tile.id;

      if (isSameTile) {
        setTileSelections([]);
        return;
      }

      const isAdjacentTile =
        Math.abs(firstSelection.position.rowIndex - rowIndex) +
          Math.abs(firstSelection.position.colIndex - colIndex) ===
        1;

      if (!isAdjacentTile) {
        setTileSelections([
          {
            tile,
            position: { rowIndex, colIndex },
          },
        ]);
        return;
      }

      setTileSelections([]);
      handleSwap(tile, firstSelection.tile);
    },
    [handleSwap, tileSelections]
  );

  const tiles = useMemo(() => {
    const renderTile = (tile: Tile, rowIndex: number, colIndex: number) => {
      const isSelected = tileSelections.some(
        (selection) => selection.tile.id === tile.id
      );

      return (
        <TileComponent
          key={tile.id}
          tile={tile}
          isSelected={isSelected}
          onSelect={() => handleSelect(tile, rowIndex, colIndex)}
        />
      );
    };

    return grid.flatMap((row, rowIndex) =>
      row.map((tile, colIndex) => renderTile(tile, rowIndex, colIndex))
    );
  }, [grid, handleSelect, tileSelections]);

  return (
    tiles.length > 0 && (
      <div className="grid grid-rows-8 grid-cols-8 border-8 border-slate-500 bg-slate-700 rounded-lg p-2 gap-2">
        {tiles}
      </div>
    )
  );
};
