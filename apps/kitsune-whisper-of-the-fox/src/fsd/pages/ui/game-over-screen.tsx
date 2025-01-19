import { useShallow } from "zustand/shallow";
import { useGameStore } from "../model/game-store";
import { Score } from "./score";
import { Button } from "~/fsd/shared/ui/button";

export const GameOverScreen = () => {
  const { score } = useGameStore(
    useShallow((state) => ({
      score: state.score,
    }))
  );

  const handleRestart = () => {
    window.location.reload(); // Перезапуск игры
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <h2 className="text-4xl text-white">Game over</h2>
      <Score value={score} />

      <Button preset="blue" onClick={handleRestart}>
        Start again
      </Button>
    </div>
  );
};
