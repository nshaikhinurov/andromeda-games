import { ScrollText } from "lucide-react";
import { Paper } from "./paper";

export const CollapsibleGameRules = () => {
  return (
    <Paper className="w-full ">
      <details>
        <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
          <ScrollText className="inline-block" /> Правила игры
        </summary>

        <ol className="mt-3 text-sm text-gray-500 dark:text-gray-400 space-y-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <li>Переворачивайте по две карты за ход</li>
          <li>При совпадении пары: +{42} × оставшиеся пары</li>
          <li>При несовпадении: -{42} × найденные пары</li>
          <li>Найдите все пары для победы!</li>
        </ol>
      </details>
    </Paper>
  );
};
