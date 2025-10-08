import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChartColumnBig, Gamepad2, RefreshCw } from "lucide-react";
import { GameState } from "../lib/game-logic";
import { palette } from "./palette";
import { Paper } from "./paper";

interface ScorePanelProps {
  onNewGame: () => void;
  isGameActive: boolean;
  gridCols: number;
  gridRows: number;
  gameState: GameState;
}

/**
 * Компонент панели с информацией об игре и управлением
 */
export default function ScorePanel({
  onNewGame,
  isGameActive,
  gridCols,
  gridRows,
  gameState,
}: ScorePanelProps) {
  const difficulty =
    gridCols * gridRows <= 16
      ? "easy"
      : gridCols * gridRows <= 24
        ? "medium"
        : "hard";

  return (
    <Paper className="space-y-6">
      <h1 className="flex items-center justify-center gap-2 text-center text-xl font-semibold text-gray-800 dark:text-white">
        <ChartColumnBig className="size-[1.5em]" /> Статистика игры
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-100 p-4 text-center text-gray-800">
          <div className="mb-1 font-medium">Очки</div>
          <div className="text-xl font-bold">
            {gameState.score.toLocaleString()}
          </div>
        </div>

        <div className="rounded-lg bg-gray-100 p-4 text-center text-gray-800">
          <div className="mb-1 font-medium">Ходы</div>
          <div className="text-xl font-bold">{gameState.moves}</div>
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Размер поля</span>
          <span className="font-bold">
            {gridCols}×{gridRows}
          </span>
        </div>

        <div>
          <div className="mb-2 flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Прогресс</span>
            <span className="font-bold">
              {gameState.cards.filter((card) => card.isMatched).length / 2} /{" "}
              {gameState.cards.length / 2} пар
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-500 ease-out",
                {
                  [palette.yellowish]: difficulty === "easy",
                  [palette.redish]: difficulty === "medium",
                  [palette.purpleish]: difficulty === "hard",
                },
              )}
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
      </div>

      <Button
        onClick={onNewGame}
        className={cn(
          "flex w-full transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r font-semibold text-white uppercase shadow-lg transition-colors duration-200",
          {
            [palette.yellowish]: difficulty === "easy",
            [palette.redish]: difficulty === "medium",
            [palette.purpleish]: difficulty === "hard",
          },
        )}
        size="lg"
      >
        {isGameActive ? (
          <>
            <RefreshCw strokeWidth={2.5} className="size-[1.5em]" /> Новая игра
          </>
        ) : (
          <>
            <Gamepad2 strokeWidth={2.5} className="size-[1.5em]" /> Начать игру
          </>
        )}
      </Button>
    </Paper>
  );
}
