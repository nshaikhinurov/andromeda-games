import { Gamepad2 } from "lucide-react";
import { Paper } from "./paper";

interface InstructionItemProps {
  title: string;
  description: string;
  colorScheme: "blue" | "green" | "yellow" | "purple";
}

const InstructionItem = ({
  title,
  description,
  colorScheme,
}: InstructionItemProps) => {
  const colorClasses = {
    green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300",
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300",
    purple:
      "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300",
    yellow:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300",
  };

  return (
    <li className="flex items-start space-x-5 [counter-increment:step-counter]">
      <div
        className={`${colorClasses[colorScheme]} flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full p-2 text-sm font-bold before:content-[counter(step-counter)]`}
      ></div>
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </li>
  );
};

const instructions = [
  {
    title: "Переворачивайте карты",
    description:
      "Кликайте по картам, чтобы увидеть их значение. За один ход можно открыть только две карты.",
    colorScheme: "green" as const,
  },
  {
    title: "Находите пары",
    description:
      "Если две карты совпадают, они остаются открытыми и исчезают с поля.",
    colorScheme: "blue" as const,
  },
  {
    title: "Набирайте очки",
    description:
      "За каждую найденную пару получайте очки. Чем меньше ходов, тем больше очков!",
    colorScheme: "purple" as const,
  },
  {
    title: "Завершите игру",
    description:
      "Найдите все пары, чтобы выиграть и увидеть свой итоговый результат.",
    colorScheme: "yellow" as const,
  },
];

export const GameInstructions = () => {
  return (
    <Paper className="mx-auto max-w-lg">
      <h2 className="mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold text-gray-800 dark:text-white">
        <Gamepad2 className="size-[1.5em]" /> Как играть
      </h2>

      <ol className="grid gap-6 [counter-reset:step-counter]">
        {instructions.map((instruction, index) => (
          <InstructionItem
            key={index}
            title={instruction.title}
            description={instruction.description}
            colorScheme={instruction.colorScheme}
          />
        ))}
      </ol>
    </Paper>
  );
};
