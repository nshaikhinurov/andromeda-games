import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabsConfig = [
  {
    title: "Легкий уровень",
    description: "16 карт, 8 пар - отлично для начинающих",
    rows: 4,
    cols: 4,
    className: "bg-green-600 hover:bg-green-700",
  },
  {
    title: "Средний уровень",
    description: "24 карты, 12 пар - классическая версия",
    rows: 4,
    cols: 6,
    className: "bg-blue-600 hover:bg-blue-700",
  },
  {
    title: "Сложный уровень",
    description: "36 карт, 18 пар - для настоящих мастеров",
    rows: 6,
    cols: 6,
    className: "bg-purple-600 hover:bg-purple-700",
  },
];

export const DifficultyTabs = ({
  onDifficultySelected: handleNewGame,
}: {
  onDifficultySelected: (cols: number, rows: number) => void;
}) => {
  return (
    <div className="mb-8 max-w-md mx-auto">
      <Tabs defaultValue="4" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="1">4×4</TabsTrigger>
          <TabsTrigger value="2">6×4</TabsTrigger>
          <TabsTrigger value="3">6×6</TabsTrigger>
        </TabsList>

        {tabsConfig.map((tab, index) => (
          <TabsContent
            key={index}
            value={(index + 1).toString()}
            className="mt-4"
          >
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">{tab.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {tab.description}
              </p>
              <button
                onClick={() => handleNewGame(tab.cols, tab.rows)}
                className={`text-white px-6 py-2 rounded-lg font-semibold transition-colors ${tab.className}`}
              >
                Начать игру {tab.cols}×{tab.rows}
              </button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
