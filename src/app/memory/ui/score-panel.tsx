import { Button } from "@/components/ui/button";
import { ChartColumnBig, Gamepad2, RefreshCw } from "lucide-react";
import { GameState } from "../lib/game-logic";
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
  return (
    <Paper className="space-y-6">
      <h1 className="text-center text-2xl font-semibold text-gray-800 dark:text-white  flex items-center justify-center gap-2">
        <ChartColumnBig /> Статистика игры
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 text-gray-800 rounded-lg p-4 text-center">
          <div className="text-sm font-medium  mb-1">Очки</div>
          <div className="text-2xl font-bold ">
            {gameState.score.toLocaleString()}
          </div>
        </div>

        <div className="bg-gray-100 text-gray-800 rounded-lg p-4 text-center">
          <div className="text-sm font-medium  mb-1">Ходы</div>
          <div className="text-2xl font-bold ">{gameState.moves}</div>
        </div>
      </div>

      <div className="grid gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Размер поля</span>
          <span className="font-medium">
            {gridCols}×{gridRows}
          </span>
        </div>

        <div>
          <div className="flex justify-between   mb-2">
            <span className="text-gray-600 dark:text-gray-400">Прогресс</span>
            <span className="font-medium">
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
      </div>

      <Button
        onClick={onNewGame}
        className="pt-2 w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform  shadow-lg flex items-center justify-center gap-2"
        size="lg"
      >
        {isGameActive ? (
          <>
            <RefreshCw strokeWidth={2.5} /> Новая игра
          </>
        ) : (
          <>
            <Gamepad2 strokeWidth={2.5} /> Начать игру
          </>
        )}
      </Button>
    </Paper>
  );
}
