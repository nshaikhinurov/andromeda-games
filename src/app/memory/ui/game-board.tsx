"use client";

import {
  GameState,
  cardsMatch,
  flipCard,
  resetFlippedCards,
} from "@/app/memory/lib/game-logic";
import { useCallback, useState } from "react";
import Card from "./card";
import { Paper } from "./paper";

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
    [gameState, onGameStateChange, isProcessing],
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
    <div className="flex grow flex-col items-center space-y-6">
      {/* Сетка карт */}
      <Paper
        className={`mx-auto grid w-full grid-cols-[repeat(auto-fit,minmax(112px,1fr))] justify-items-center gap-4`}
      >
        {gameState.cards.map((card, index) => (
          <Card
            card={card}
            onClick={handleCardClick}
            disabled={isCardDisabled(card.id)}
            key={card.id}
            className="appear-card"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          />
        ))}
      </Paper>

      {/* Состояние игры */}
      {isProcessing && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
            <span className="text-sm">Обрабатываем ход...</span>
          </div>
        </div>
      )}

      {gameState.isGameOver && (
        <div className="rounded-lg bg-green-100 p-4 text-center dark:bg-green-900">
          <div className="text-lg font-bold text-green-800 dark:text-green-200">
            🎉 Поздравляем! Игра завершена!
          </div>
          <div className="mt-1 text-sm text-green-600 dark:text-green-400">
            Все пары найдены за {gameState.moves} ходов
          </div>
        </div>
      )}
    </div>
  );
}
