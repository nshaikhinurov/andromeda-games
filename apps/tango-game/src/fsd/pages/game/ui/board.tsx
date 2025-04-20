import { useMemo } from "react";
import { currentBoardSelector, useAppSelector } from "~/fsd/app/store";
import { CellComponent } from "./cell-component";

export const Board = () => {
  const currentBoard = useAppSelector(currentBoardSelector);

  const cells = useMemo(() => {
    return (currentBoard || []).flat();
  }, [currentBoard]);

  return (
    <div className="grid aspect-square grid-cols-6 grid-rows-6 overflow-hidden rounded-sm bg-stone-300 outline-1 outline-stone-300 select-none">
      {cells.map((value, index) => (
        <CellComponent key={index} id={index} initialValue={value} />
      ))}
    </div>
  );
};
