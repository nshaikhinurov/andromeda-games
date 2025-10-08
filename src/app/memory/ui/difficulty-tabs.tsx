import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { palette } from "./palette";
import { Paper } from "./paper";

const tabsConfig: Array<{
  title: string;
  description: string;
  rows: number;
  cols: number;
  difficulty: "easy" | "medium" | "hard";
}> = [
  {
    title: "Легкий уровень",
    description: "16 карт, 8 пар — отлично для начинающих",
    rows: 4,
    cols: 4,
    difficulty: "easy",
  },
  {
    title: "Средний уровень",
    description: "24 карты, 12 пар — классическая версия",
    rows: 4,
    cols: 6,
    difficulty: "medium",
  },
  {
    title: "Сложный уровень",
    description: "36 карт, 18 пар — для настоящих мастеров",
    rows: 6,
    cols: 6,
    difficulty: "hard",
  },
];

export const DifficultyTabs = ({
  onDifficultySelected: handleNewGame,
}: {
  onDifficultySelected: (cols: number, rows: number) => void;
}) => {
  return (
    <Tabs defaultValue="0" className="mx-auto w-full max-w-lg">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger
          className="text-base data-[state=active]:bg-[oklch(0.755_0.18_75)] data-[state=active]:text-white"
          value="0"
        >
          4×4
        </TabsTrigger>
        <TabsTrigger
          className="text-base data-[state=active]:bg-[oklch(0.625_0.18_15)] data-[state=active]:text-white"
          value="1"
        >
          6×4
        </TabsTrigger>
        <TabsTrigger
          className="text-base data-[state=active]:bg-[oklch(0.525_0.18_304)] data-[state=active]:text-white"
          value="2"
        >
          6×6
        </TabsTrigger>
      </TabsList>

      {tabsConfig.map((tab, index) => (
        <TabsContent key={index} value={index.toString()} className=" ">
          <Paper className="text-center">
            <h3 className="mb-3 text-xl font-semibold">{tab.title}</h3>
            <p className="mb-5 text-gray-600 dark:text-gray-400">
              {tab.description}
            </p>

            <Button
              size={"lg"}
              onClick={() => handleNewGame(tab.cols, tab.rows)}
              className={cn(
                `w-55 rounded-lg px-6 py-2 font-semibold text-white uppercase transition-colors`,
                {
                  [palette.yellowish]: tab.difficulty === "easy",
                  [palette.redish]: tab.difficulty === "medium",
                  [palette.purpleish]: tab.difficulty === "hard",
                },
              )}
            >
              Начать игру
            </Button>
          </Paper>
        </TabsContent>
      ))}
    </Tabs>
  );
};
