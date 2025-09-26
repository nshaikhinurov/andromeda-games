"use client";

import { createInitialGameState, GameState } from "@/app/memory/lib/game-logic";
import GameOverModal from "@/app/memory/ui/game-over-modal";

import { useEffect, useState } from "react";
import { DifficultyTabs } from "./ui/difficulty-tabs";
import { GameContent } from "./ui/game-content";
import { GameInstructions } from "./ui/game-instructions";
import { Title } from "./ui/title";

export default function MemoryGameHomePage() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState(4, 4),
  );
  const [gridCols, setGridCols] = useState(4);
  const [gridRows, setGridRows] = useState(4);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Отслеживаем завершение игры
  useEffect(() => {
    if (gameState.isGameOver && !showGameOverModal && gameStarted) {
      // Небольшая задержка для показа финальной анимации
      setTimeout(() => {
        setShowGameOverModal(true);
      }, 1000);
    }
  }, [gameState.isGameOver, showGameOverModal, gameStarted]);

  /**
   * Начинает новую игру
   */
  const handleNewGame = (newGridCols: number, newGridRows: number) => {
    setGridCols(newGridCols);
    setGridRows(newGridRows);
    setGameState(createInitialGameState(newGridCols, newGridRows));
    setShowGameOverModal(false);
    setGameStarted(true);
  };

  /**
   * Обновляет состояние игры
   */
  const handleGameStateChange = (newState: GameState) => {
    setGameState(newState);
  };

  /**
   * Закрывает модальное окно завершения игры
   */
  const handleCloseGameOverModal = () => {
    setShowGameOverModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-300 p-4 md:p-6 xl:p-8 dark:from-stone-900 dark:to-stone-700">
      <div className="container mx-auto flex max-w-7xl flex-col items-center gap-4 sm:gap-6 xl:gap-8">
        <Title showSubtitle={!gameStarted} />

        {!gameStarted && <GameInstructions />}
        {!gameStarted && (
          <DifficultyTabs onDifficultySelected={handleNewGame} />
        )}

        {gameStarted && (
          <GameContent
            gameState={gameState}
            handleNewGame={handleNewGame}
            handleGameStateChange={handleGameStateChange}
            gridCols={gridCols}
            gridRows={gridRows}
          />
        )}

        <GameOverModal
          isOpen={showGameOverModal}
          score={gameState.score}
          moves={gameState.moves}
          onNewGame={() => handleNewGame(gridCols, gridRows)}
          onClose={handleCloseGameOverModal}
        />
      </div>
    </div>
  );
}
