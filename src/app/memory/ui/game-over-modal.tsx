import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

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

  return (
    <div className="fixed inset-0 z-50 flex motion-preset-focus items-center justify-center bg-black/50 p-4 motion-duration-300">
      <div className="w-full max-w-lg motion-preset-compress rounded-2xl bg-white p-6 shadow-2xl motion-duration-300 dark:bg-gray-800">
        {/* Заголовок */}
        <div className="mb-6 flex items-center justify-center gap-2 text-2xl">
          <h2 className="font-bold text-gray-800 dark:text-white">
            Игра завершена!
          </h2>
        </div>

        {/* Результаты */}
        <div className="mb-6 space-y-4">
          {/* Счет */}
          <div className="rounded-lg bg-gradient-to-r from-green-50 to-green-100 p-4 text-center dark:from-green-900 dark:to-green-800">
            <div className="mb-1 text-sm font-medium text-green-700 dark:text-green-300">
              Итоговый счет
            </div>
            <div className="text-3xl font-bold text-green-800 dark:text-green-100">
              {score.toLocaleString()}
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900">
              <div className="mb-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                Ходов
              </div>
              <div className="text-xl font-bold text-blue-800 dark:text-blue-100">
                {moves}
              </div>
            </div>
          </div>

          {/* Оценка производительности */}
          <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-700">
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
            className="w-full transform rounded-lg bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-blue-700"
            size="lg"
          >
            🎮 Играть еще раз
          </Button>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full rounded-lg border-gray-300 px-6 py-2 text-gray-700 transition-all duration-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Закрыть
          </Button>
        </div>

        {/* Поделиться результатом */}
        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-600">
          <div className="flex items-center justify-center gap-2 text-center text-sm text-gray-500 dark:text-gray-400">
            <Lightbulb className="size-[1.2em] text-amber-400" /> Совет:
            Запоминайте позиции карт для лучшего результата!
          </div>
        </div>
      </div>
    </div>
  );
}
