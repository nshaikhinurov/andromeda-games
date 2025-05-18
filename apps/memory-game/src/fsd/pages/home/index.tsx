"use client";

import React, { useCallback, useRef, useState } from "react";

import { GameScreen } from "./ui/game-screen";
import { HeroScreen } from "./ui/hero-screen";
import { Card, prepareCards } from "./model";

type GameState = {
  screen: "start" | "game" | "end";
  cards: Card[];
};

export const HomePage = () => {
  const scoreRef = useRef(0);
  const [state, setState] = useState<GameState>({
    screen: "start",
    cards: [],
  });

  function restart() {
    setState((state) => ({
      ...state,
      screen: "game",
      cards: prepareCards(),
    }));
  }

  const cloneState = useCallback(function () {
    setState((state) => ({ ...state }));
  }, []);

  function handleGameOver(score: number) {
    scoreRef.current = score;
    setState((state) => ({ ...state, screen: "end" }));
  }

  return (
    <>
      {state.screen === "start" && (
        <HeroScreen
          type="start"
          headerContent="Memory game"
          buttonText="Start"
          onButtonClick={restart}
        />
      )}

      {state.screen === "game" && (
        <GameScreen
          onRestart={restart}
          cards={state.cards}
          onGameOver={handleGameOver}
          rerender={cloneState}
        />
      )}

      {state.screen === "end" && (
        <HeroScreen
          type="end"
          headerContent={
            <React.Fragment>
              Congrats!
              <br />
              Final score: {scoreRef.current}
            </React.Fragment>
          }
          buttonText="Play again"
          onButtonClick={restart}
        />
      )}
    </>
  );
};
