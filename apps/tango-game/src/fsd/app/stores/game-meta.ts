import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { isGameFinished, useGameStateStore } from "./game-state";

type GameMetaState = {
  gameStartedAt: number;
  gameFinishedAt: number;
  // Actions
  startGame: () => void;
  finishGame: () => void;
  resetMeta: () => void;
};

// Create the game meta store
export const useGameMetaStore = create<GameMetaState>()(
  immer((set) => ({
    gameStartedAt: Date.now(),
    gameFinishedAt: 0,

    startGame: () => {
      set({ gameStartedAt: Date.now(), gameFinishedAt: 0 });
    },

    finishGame: () => {
      set({ gameFinishedAt: Date.now() });
    },

    resetMeta: () => {
      set({ gameStartedAt: Date.now(), gameFinishedAt: 0 });
    },
  })),
);

// Set up subscription on first import
(function setupSubscription() {
  let prevFinished = false;

  useGameStateStore.subscribe((state) => {
    const finished = isGameFinished(state);
    const metaState = useGameMetaStore.getState();

    // Only update when the game transitions to finished state
    if (finished && !prevFinished && metaState.gameFinishedAt === 0) {
      metaState.finishGame();
    }

    prevFinished = finished;
  });
})();

// Selectors
export const getGameDuration = (state: GameMetaState) => {
  if (state.gameFinishedAt > 0) {
    return state.gameFinishedAt - state.gameStartedAt;
  }
  return Date.now() - state.gameStartedAt;
};

export const isGameActive = (state: GameMetaState) => {
  return state.gameFinishedAt === 0;
};

// Hook selectors
export const useGameStartedAt = () =>
  useGameMetaStore((state) => state.gameStartedAt);
export const useGameFinishedAt = () =>
  useGameMetaStore((state) => state.gameFinishedAt);
export const useGameDuration = () => useGameMetaStore(getGameDuration);
export const useIsGameActive = () => useGameMetaStore(isGameActive);
