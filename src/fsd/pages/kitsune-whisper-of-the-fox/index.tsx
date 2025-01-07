"use client";

import { Yusei_Magic } from "next/font/google";
import { GameGridComponent } from "./ui/game-grid";
import { LoadingScreen } from "./ui/loading-screen";
import { generateInitialGrid, useGameStore } from "./model/grid-controller";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { TileComponent } from "./ui/tile";

const font = Yusei_Magic({
  weight: "400",
  subsets: ["latin"],
});

export const KitsuneGamePage = () => {
  const { isGridInitialized, setGrid, score } = useGameStore(
    useShallow((state) => ({
      isGridInitialized: state.grid.length > 0,
      setGrid: state.setGrid,
      score: state.score,
    }))
  );

  // Инициализация начальной сетки на клиенте
  useEffect(() => {
    if (!isGridInitialized) {
      setGrid(generateInitialGrid(8));
    }
  }, [isGridInitialized, setGrid]);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-y-6 ${font.className} text-white`}
    >
      <h1 className={`text-4xl`}>Kitsune: Whisper of the Fox</h1>
      {!isGridInitialized && <LoadingScreen />}
      {isGridInitialized && (
        <>
          <div className="flex justify-center items-center gap-x-2">
            <TileComponent
              tile={{ id: "score", type: "white", isRemoved: false }}
              className="w-10 h-10"
            />
            <span className="text-4xl">{score}</span>
          </div>
          <GameGridComponent />
        </>
      )}
    </div>
  );
};
