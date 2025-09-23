import { Button } from "@/components/ui/button";

interface ScorePanelProps {
  score: number;
  moves: number;
  onNewGame: () => void;
  isGameActive: boolean;
}

/**
 * Компонент панели с информацией об игре и управлением
 */
export default function ScorePanel({
  score,
  moves,
  onNewGame,
  isGameActive,
}: ScorePanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
      {/* Заголовок */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Memory Game
        </h1>
        <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto w-24" />
      </div>

      {/* Статистика игры */}
      <div className="grid grid-cols-2 gap-4">
        {/* Счет */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4 text-center">
          <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
            Очки
          </div>
          <div className="text-2xl font-bold text-green-800 dark:text-green-100">
            {score.toLocaleString()}
          </div>
        </div>

        {/* Ходы */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4 text-center">
          <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
            Ходы
          </div>
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-100">
            {moves}
          </div>
        </div>
      </div>

      {/* Кнопка новой игры */}
      <div className="pt-2">
        <Button
          onClick={onNewGame}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          size="lg"
        >
          {isGameActive ? "🔄 Новая игра" : "🎮 Начать игру"}
        </Button>
      </div>

      {/* Правила игры (сворачиваемые) */}
      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
          📖 Правила игры
        </summary>
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 space-y-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p>• Переворачивайте по две карты за ход</p>
          <p>• При совпадении пары: +{42} × оставшиеся пары</p>
          <p>• При несовпадении: -{42} × найденные пары</p>
          <p>• Найдите все пары для победы!</p>
        </div>
      </details>

      {/* Индикатор эффективности */}
      {isGameActive && moves > 0 && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Эффективность
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, (score / (moves * 100)) * 100)
                  )}%`,
                }}
              />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {Math.round((score / (moves * 100)) * 100) || 0}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
