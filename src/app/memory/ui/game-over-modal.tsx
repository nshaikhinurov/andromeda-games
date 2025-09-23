import { Button } from "@/components/ui/button";

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  moves: number;
  onNewGame: () => void;
  onClose: () => void;
}

/**
 * Модальное окно показа результатов игры
 */
export default function GameOverModal({
  isOpen,
  score,
  moves,
  onNewGame,
  onClose,
}: GameOverModalProps) {
  if (!isOpen) return null;

  /**
   * Определяет качество игры по количеству ходов
   */
  const getPerformanceRating = () => {
    const efficiency = score / (moves * 100);

    if (efficiency >= 0.8)
      return { text: "Превосходно!", color: "text-green-600", emoji: "🏆" };
    if (efficiency >= 0.6)
      return { text: "Отлично!", color: "text-blue-600", emoji: "🎯" };
    if (efficiency >= 0.4)
      return { text: "Хорошо!", color: "text-yellow-600", emoji: "👍" };
    return { text: "Неплохо!", color: "text-orange-600", emoji: "💪" };
  };

  const performance = getPerformanceRating();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-in fade-in-0 scale-in-95 duration-300">
        {/* Заголовок */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Игра завершена!
          </h2>
          <div className="h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto w-20" />
        </div>

        {/* Результаты */}
        <div className="space-y-4 mb-6">
          {/* Счет */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4 text-center">
            <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
              Итоговый счет
            </div>
            <div className="text-3xl font-bold text-green-800 dark:text-green-100">
              {score.toLocaleString()}
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-3 text-center">
              <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                Ходов
              </div>
              <div className="text-xl font-bold text-blue-800 dark:text-blue-100">
                {moves}
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-3 text-center">
              <div className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">
                Эффективность
              </div>
              <div className="text-xl font-bold text-purple-800 dark:text-purple-100">
                {Math.round((score / (moves * 100)) * 100)}%
              </div>
            </div>
          </div>

          {/* Оценка производительности */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">{performance.emoji}</div>
            <div className={`text-lg font-semibold ${performance.color} mb-1`}>
              {performance.text}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {score >= 500
                ? "Вы набрали отличный счет!"
                : score >= 300
                ? "Хороший результат!"
                : "Есть куда расти!"}
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-col space-y-3">
          <Button
            onClick={onNewGame}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            🎮 Играть еще раз
          </Button>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-6 rounded-lg transition-all duration-300"
          >
            Закрыть
          </Button>
        </div>

        {/* Поделиться результатом */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            💡 Совет: Запоминайте позиции карт для лучшего результата!
          </div>
        </div>
      </div>
    </div>
  );
}
