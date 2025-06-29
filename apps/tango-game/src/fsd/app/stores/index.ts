import { useGameMetaStore } from "./game-meta";
import { useGameStateStore } from "./game-state";

// Re-export everything from individual store files
export * from "./game-meta";
export * from "./game-state";
export * from "./settings";

// Create a coordinator function to restart the game
export const restartGame = () => {
  const { resetGame } = useGameStateStore.getState();
  const { resetMeta } = useGameMetaStore.getState();

  resetGame();
  resetMeta();
};
