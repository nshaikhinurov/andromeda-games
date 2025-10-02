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
  maxGridCols: number;
  isPreviewActive: boolean;
}

/**
 * Главный компонент игрового поля
 */
export default function GameBoard({
  gameState,
  onGameStateChange,
  maxGridCols,
  isPreviewActive,
}: GameBoardProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCardClick = useCallback(
    async (cardId: string) => {
      if (isProcessing || gameState.isGameOver || isPreviewActive) return;

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
          // Ждем 1 секунду перед переворотом карт обратно
          setTimeout(() => {
            const resetState = resetFlippedCards(newState);
            onGameStateChange(resetState);
            setIsProcessing(false);
          }, 1000);
        } else {
          // Небольшая задержка для показа совпадения
          setTimeout(() => {
            setIsProcessing(false);
          }, 600);
        }
      }
    },
    [gameState, onGameStateChange, isProcessing, isPreviewActive],
  );

  /**
   * Проверяет, должна ли карта быть отключена
   */
  const isCardDisabled = (cardId: string) => {
    return (
      isProcessing ||
      gameState.isGameOver ||
      isPreviewActive ||
      gameState.flippedCards.length >= 2 ||
      gameState.cards.find((card) => card.id === cardId)?.isMatched
    );
  };

  /**
   * Получает состояние карты с учетом режима предпросмотра
   */
  const getDisplayCard = (card: any) => {
    if (isPreviewActive && !card.isMatched) {
      return { ...card, isFlipped: true };
    }
    return card;
  };

  return (
    <div className="flex w-full min-w-[328px] flex-col items-center space-y-6">
      {/* Сетка карт */}
      <Paper
        className={`mx-auto grid w-full`}
        style={
          {
            // настройка максимального количества колонок при использовании auto-fit
            "--grid-max-col-count": maxGridCols,
            "--grid-min-col-size": "100px",
            "--grid-gap": "12px",
            "--grid-col-size-calc":
              "calc((100% - (var(--grid-gap) * (var(--grid-max-col-count) - 1))) / var(--grid-max-col-count))",
            "--grid-col-min-size-calc":
              "min(100%, max(var(--grid-min-col-size), var(--grid-col-size-calc)))",
            gap: "var(--grid-gap)",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(var(--grid-col-min-size-calc), 1fr))",
          } as React.CSSProperties
        }
      >
        {gameState.cards.map((card, index) => (
          <Card
            card={getDisplayCard(card)}
            onClick={handleCardClick}
            disabled={isCardDisabled(card.id)}
            key={card.id}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          />
        ))}
      </Paper>
    </div>
  );
}
