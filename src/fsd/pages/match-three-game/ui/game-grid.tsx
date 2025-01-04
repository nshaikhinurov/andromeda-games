import { LayoutGroup, motion } from "motion/react";
import { FC, useCallback, useState } from "react";
import { GameGrid, Tile } from "../model/types";
import { TileComponent } from "./tile";

type TileSelection = {
  tile: Tile;
  position: {
    rowIndex: number;
    colIndex: number;
  };
};

type GameGridComponentProps = {
  initialGrid: GameGrid;
};

export const GameGridComponent: FC<GameGridComponentProps> = ({
  initialGrid,
}) => {
  const [grid, setGrid] = useState(initialGrid);
  const [tileSelections, setTileSelections] = useState<TileSelection[]>([]);
  console.log("🚀 ~ tileSelections:", tileSelections);

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

  const handleSelect = (tile: Tile, rowIndex: number, colIndex: number) => {
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
  };

  const handleSwap = (firstTile: Tile, secondTile: Tile) => {
    setGrid((grid) => {
      return grid.map((row) =>
        row.map((tile) => {
          if (tile.id === firstTile.id) {
            return secondTile;
          }

          if (tile.id === secondTile.id) {
            return firstTile;
          }

          return tile;
        })
      );
    });
  };

  const renderTile = useCallback(
    (tile: Tile, rowIndex: number, colIndex: number) => {
      const isSelected = tileSelections.some(
        (selection) => selection.tile.id === tile.id
      );

      if (isSelected) {
        console.log("🚀 ~ isSelected:", rowIndex, colIndex);
      }

      return (
        <TileComponent
          key={tile.id}
          tile={tile}
          isSelected={isSelected}
          onSelect={() => handleSelect(tile, rowIndex, colIndex)}
        />
      );
    },
    [tileSelections]
  );

  return (
    <div className="grid grid-rows-8 grid-cols-8 gap-1">
      {grid.flatMap((row, rowIndex) =>
        row.map((tile, colIndex) => renderTile(tile, rowIndex, colIndex))
      )}
    </div>
  );
};
