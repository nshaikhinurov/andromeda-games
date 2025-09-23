import { Brain } from "lucide-react";

export const Title = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl uppercase  mb-4 flex items-center justify-center gap-2 text-gray-800 dark:text-white">
        <Brain className="size-9" strokeWidth="2px" /> Memory Game
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto text-balance">
        Тренируйте память, находя пары карт. Запоминайте позиции и набирайте
        очки!
      </p>
    </div>
  );
};
