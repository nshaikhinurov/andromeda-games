import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Gamepad2 } from "lucide-react";
import { useState } from "react";
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
    title: "Запомните начальное расположение карт",
    description:
      "В начале игры все карты открываются на несколько секунд. Постарайтесь запомнить их расположение.",
    colorScheme: "green" as const,
  },
  {
    title: "Находите пары",
    description:
      "Выберите две карты, чтобы перевернуть их. Если они совпадают, они исчезнут с поля. Если нет, они перевернутся обратно.",
    colorScheme: "blue" as const,
  },
  {
    title: "Набирайте очки",
    description:
      "За каждую найденную пару вы получаете очки. Чем меньше раскрытых пар на поле, тем больше очков вы получите! Будьте внимательны и стратегичны: в случае ошибки вы потеряете очки.",
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible className="w-full" open={isOpen} onOpenChange={setIsOpen}>
      <Paper className={`mx-auto flex max-w-lg flex-col`}>
        <CollapsibleTrigger asChild>
          <h2
            className={`flex cursor-pointer items-center justify-center gap-2 text-center text-xl ${isOpen ? "text-gray-800" : "text-gray-600"} font-bold transition-colors hover:text-gray-800`}
          >
            <Gamepad2 className="size-[1.5em]" />
            Как играть
            <ChevronDown
              className={`size-[1.5em] transition-transform duration-200 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </h2>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
          <ol className="mt-6 grid gap-6 [counter-reset:step-counter]">
            {instructions.map((instruction, index) => (
              <InstructionItem
                key={index}
                title={instruction.title}
                description={instruction.description}
                colorScheme={instruction.colorScheme}
              />
            ))}
          </ol>
        </CollapsibleContent>
      </Paper>
    </Collapsible>
  );
};
