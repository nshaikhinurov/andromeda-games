"use client";
import React, { useCallback, useEffect, useRef } from "react";
import { Card } from "../model";

import { Button } from "~/fsd/shared/ui/button";
import { CardComponent } from "./card";
import clsx from "clsx";

interface GameScreenProps {
  cards: Card[];
  rerender: () => void;
  onRestart: () => void;
  onGameOver: (score: number) => void;
}

type GameState = {
  score: number;
  isPlaying: boolean;
};

export const GameScreen: React.FC<GameScreenProps> = ({
  cards,
  onRestart,
  onGameOver,
  rerender,
}) => {
  const card1 = useRef<Card | null>(null);
  const card2 = useRef<Card | null>(null);
  const openedPairs = useRef(0);

  const [state, updateState] = React.useReducer(
    (state: GameState, newState: Partial<GameState>): GameState => ({
      ...state,
      ...newState,
    }),
    {
      score: 0,
      isPlaying: false,
    }
  );

  const showAllCards = useCallback(() => {
    cards.forEach((card) => card.flip());
    rerender();
    setTimeout(() => {
      cards.forEach((card) => card.flip());
      rerender();
    }, 5600);
  }, [cards, rerender]);

  useEffect(
    function startGame() {
      showAllCards();
      openedPairs.current = 0;
      card1.current = null;
      card2.current = null;
      setTimeout(() => updateState({ score: 0, isPlaying: true }), 5600);
    },
    [showAllCards]
  );

  function handleCardClick(card: Card) {
    if (!state.isPlaying) return;
    if (card.isFacedUp) return;

    card.flip();
    rerender();
    // seems simpler to use timeouts instead of using transitionEnd events
    setTimeout(() => handleCardFlip(card), 600);
  }

  function handleCardFlip(card: Card) {
    if (!card1.current) {
      card1.current = card;
    } else {
      card2.current = card;

      if (Card.isPair(card1.current, card2.current)) {
        openedPairs.current++;
        if (openedPairs.current === 9) {
          return onGameOver(state.score);
        }
        card1.current.hide();
        card2.current.hide();
        updateState({ score: state.score + 42 * (9 - openedPairs.current) });
      } else {
        updateState({ score: state.score - 42 * openedPairs.current });

        card1.current.flip();
        card2.current.flip();
      }

      card1.current = null;
      card2.current = null;
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 p-[5vh] h-full ">
      <div
        className={clsx(
          "w-full flex justify-between items-center text-white transition-all duration-200 ease-in-out",
          state.isPlaying ? "opacity-100" : "opacity-0"
        )}
        style={{ visibility: state.isPlaying ? "visible" : "hidden" }}
      >
        <Button onClick={onRestart}>Restart game</Button>

        <div className="text-3xl uppercase">
          Score: <span>{state.score}</span>
        </div>
      </div>

      <div className="col-start-2 col-end--1 row-start-2 row-end--1 grid grid-cols-6 grid-rows-[repeat(auto-fill,auto)] gap-5">
        {cards.map((card, i) => (
          <CardComponent key={i} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
};
