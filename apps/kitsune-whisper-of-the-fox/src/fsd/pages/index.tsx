"use client";

import { Yusei_Magic } from "next/font/google";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { generateInitialGrid, useGameStore } from "./model/game-store";
import { GameGridComponent } from "./ui/game-grid";
import { GameOverScreen } from "./ui/game-over-screen";
import { LoadingScreen } from "./ui/loading-screen";
import { Score } from "./ui/score";
import { TimerBar } from "./ui/timer-bar";

const font = Yusei_Magic({
  weight: "400",
  subsets: ["latin"],
});

export const KitsuneGamePage = () => {
  const { isGridInitialized, setGrid, score, gemsCollected, isGameOver } =
    useGameStore(
      useShallow((state) => ({
        isGridInitialized: state.grid.length > 0,
        setGrid: state.setGrid,
        score: state.score,
        gemsCollected: state.gemsCollected,
        isGameOver: state.isGameOver,
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
      className={`flex flex-col items-center justify-center gap-6 ${font.className} text-white`}
    >
      <h1 className={`text-4xl text-center`}>
        Kitsune: Whisper of&nbsp;the Fox
      </h1>
      {isGameOver ? (
        <GameOverScreen />
      ) : (
        <>
          {!isGridInitialized && <LoadingScreen />}
          {isGridInitialized && (
            <>
              <div className="w-full grid grid-cols-[1fr,2fr,1fr] gap-8 items-center">
                <Score value={score} variant="masks" />
                <TimerBar />
                <Score value={gemsCollected} variant="gems" />
              </div>
              <GameGridComponent />
            </>
          )}
        </>
      )}
    </div>
  );
};
