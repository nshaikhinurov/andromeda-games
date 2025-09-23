import { ChartColumnBig } from "lucide-react";
import { GameState } from "../lib/game-logic";

export const GameStats = ({
  gridCols,
  gridRows,
  gameState,
}: {
  gridCols: number;
  gridRows: number;
  gameState: GameState;
}) => {
  return (
    <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg mx-auto">
      <h3 className="font-semibold mb-3 flex items-center  gap-1 text-gray-800 dark:text-white">
        <ChartColumnBig /> Статистика
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Размер поля:</span>
          <span className="font-medium">
            {gridCols}×{gridRows}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Всего пар:</span>
          <span className="font-medium">{gameState.cards.length / 2}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Найдено:</span>
          <span className="font-medium text-green-600">
            {gameState.cards.filter((card) => card.isMatched).length / 2}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Осталось:</span>
          <span className="font-medium text-blue-600">
            {(gameState.cards.length -
              gameState.cards.filter((card) => card.isMatched).length) /
              2}
          </span>
        </div>
      </div>
    </div>
  );
};
