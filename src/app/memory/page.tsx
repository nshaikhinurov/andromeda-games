"use client";

import { createInitialGameState, GameState } from "@/app/memory/lib/game-logic";
import GameBoard from "@/app/memory/ui/game-board";
import GameOverModal from "@/app/memory/ui/game-over-modal";
import ScorePanel from "@/app/memory/ui/score-panel";

import { useEffect, useState } from "react";
import { DifficultyTabs } from "./ui/difficulty-tabs";
import { Title } from "./ui/title";

export default function MemoryGameHomePage() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState(4, 4)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <Title />

        {!gameStarted && (
          <DifficultyTabs onDifficultySelected={handleNewGame} />
        )}

        {/* Игровой интерфейс */}
        {gameStarted && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Панель счета (слева на десктопе, сверху на мобильных) */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <ScorePanel
                score={gameState.score}
                moves={gameState.moves}
                onNewGame={() => handleNewGame(gridCols, gridRows)}
                isGameActive={gameStarted && !gameState.isGameOver}
              />

              {/* Дополнительная информация */}
              <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h3 className="font-semibold mb-3 text-gray-800 dark:text-white">
                  📊 Статистика
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Размер поля:
                    </span>
                    <span className="font-medium">
                      {gridCols}×{gridRows}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Всего пар:
                    </span>
                    <span className="font-medium">
                      {gameState.cards.length / 2}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Найдено:
                    </span>
                    <span className="font-medium text-green-600">
                      {gameState.cards.filter((card) => card.isMatched).length /
                        2}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Осталось:
                    </span>
                    <span className="font-medium text-blue-600">
                      {(gameState.cards.length -
                        gameState.cards.filter((card) => card.isMatched)
                          .length) /
                        2}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Игровое поле (справа на десктопе, сверху на мобильных) */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <GameBoard
                gameState={gameState}
                onGameStateChange={handleGameStateChange}
                gridCols={gridCols}
                gridRows={gridRows}
              />
            </div>
          </div>
        )}

        {/* Модальное окно завершения игры */}
        <GameOverModal
          isOpen={showGameOverModal}
          score={gameState.score}
          moves={gameState.moves}
          onNewGame={() => handleNewGame(gridCols, gridRows)}
          onClose={handleCloseGameOverModal}
        />

        {/* Инструкции */}
        {!gameStarted && (
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                🎮 Как играть
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2 text-blue-600 dark:text-blue-300 font-bold text-sm w-8 h-8 flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Переворачивайте карты
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Кликайте по картам, чтобы увидеть их значение. За один
                        ход можно открыть только две карты.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 dark:bg-green-900 rounded-full p-2 text-green-600 dark:text-green-300 font-bold text-sm w-8 h-8 flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Находите пары
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Если две карты совпадают, они остаются открытыми и
                        исчезают с поля.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-2 text-yellow-600 dark:text-yellow-300 font-bold text-sm w-8 h-8 flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Набирайте очки
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        За каждую найденную пару получайте очки. Чем меньше
                        ходов, тем больше очков!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-2 text-purple-600 dark:text-purple-300 font-bold text-sm w-8 h-8 flex items-center justify-center flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Завершите игру
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Найдите все пары, чтобы выиграть и увидеть свой итоговый
                        результат.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
