"use client";

import {
  GameState,
  cardsMatch,
  flipCard,
  resetFlippedCards,
} from "@/app/memory/lib/game-logic";
import { useCallback, useState } from "react";
import Card from "./card";

interface GameBoardProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
  gridCols: number;
}

/**
 * Главный компонент игрового поля
 */
export default function GameBoard({
  gameState,
  onGameStateChange,
  gridCols,
}: GameBoardProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCardClick = useCallback(
    async (cardId: string) => {
      if (isProcessing || gameState.isGameOver) return;

      // Не позволяем кликать если уже две карты перевернуты
      if (gameState.flippedCards.length >= 2) return;

      const newState = flipCard(gameState, cardId);
      onGameStateChange(newState);

      // Если это вторая карта в паре
      if (newState.flippedCards.length === 2) {
        setIsProcessing(true);

        const [firstCard, secondCard] = newState.flippedCards;
        const isMatch = cardsMatch(firstCard, secondCard);

        if (!isMatch) {
          // Ждем 1.5 секунды перед переворотом карт обратно
          setTimeout(() => {
            const resetState = resetFlippedCards(newState);
            onGameStateChange(resetState);
            setIsProcessing(false);
          }, 1500);
        } else {
          // Небольшая задержка для показа совпадения
          setTimeout(() => {
            setIsProcessing(false);
          }, 600);
        }
      }
    },
    [gameState, onGameStateChange, isProcessing]
  );

  /**
   * Проверяет, должна ли карта быть отключена
   */
  const isCardDisabled = (cardId: string) => {
    return (
      isProcessing ||
      gameState.isGameOver ||
      gameState.flippedCards.length >= 2 ||
      gameState.cards.find((card) => card.id === cardId)?.isMatched
    );
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Заголовок игрового поля */}
      {gameState.flippedCards.length === 2 && !isProcessing && (
        <div className="text-center">
          <div className="text-sm text-blue-600 dark:text-blue-400 animate-pulse">
            Проверяем совпадение...
          </div>
        </div>
      )}

      {/* Сетка карт */}
      <div
        className={`
          grid ${getGridClass(gridCols)} gap-2 sm:gap-4 lg:gap-6 
          p-4 sm:p-6 lg:p-8 
          bg-white 
          dark:from-gray-800 dark:to-gray-900 
          rounded-2xl shadow-inner
          max-w-fit mx-auto
        `}
      >
        {gameState.cards.map((card, index) => (
          <div
            key={card.id}
            className="appear-card"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <Card
              card={card}
              onClick={handleCardClick}
              disabled={isCardDisabled(card.id)}
            />
          </div>
        ))}
      </div>

      {/* Индикатор прогресса */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
          <span>Прогресс</span>
          <span>
            {gameState.cards.filter((card) => card.isMatched).length / 2} /{" "}
            {gameState.cards.length / 2} пар
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${
                (gameState.cards.filter((card) => card.isMatched).length /
                  gameState.cards.length) *
                100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Состояние игры */}
      {isProcessing && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            <span className="text-sm">Обрабатываем ход...</span>
          </div>
        </div>
      )}

      {gameState.isGameOver && (
        <div className="text-center p-4 bg-green-100 dark:bg-green-900 rounded-lg">
          <div className="text-green-800 dark:text-green-200 font-bold text-lg">
            🎉 Поздравляем! Игра завершена!
          </div>
          <div className="text-green-600 dark:text-green-400 text-sm mt-1">
            Все пары найдены за {gameState.moves} ходов
          </div>
        </div>
      )}
    </div>
  );
}

function getGridClass(gridCols: number) {
  switch (gridCols) {
    case 3:
      return "grid-cols-3";
    case 4:
      return "grid-cols-4";
    case 5:
      return "grid-cols-5";
    case 6:
      return "grid-cols-6";
    default:
      return "grid-cols-4";
  }
}
