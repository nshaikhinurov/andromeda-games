import { GameState } from "../lib/game-logic";
import { CollapsibleGameRules } from "./collapsible-game-rules";
import GameBoard from "./game-board";
import ScorePanel from "./score-panel";

export const GameContent = ({
  gameState,
  handleNewGame,
  handleGameStateChange,
  gridCols,
  gridRows,
}: {
  gameState: GameState;
  handleNewGame: (cols: number, rows: number) => void;
  handleGameStateChange: (newState: GameState) => void;
  gridCols: number;
  gridRows: number;
}) => {
  return (
    <div className="flex flex-wrap flex-row-reverse gap-6 justify-center ">
      <GameBoard
        gameState={gameState}
        onGameStateChange={handleGameStateChange}
        gridCols={gridCols}
      />

      <div className="w-full max-w-md flex flex-col gap-6 items-stretch">
        <ScorePanel
          onNewGame={() => handleNewGame(gridCols, gridRows)}
          isGameActive={!gameState.isGameOver}
          gameState={gameState}
          gridCols={gridCols}
          gridRows={gridRows}
        />

        <CollapsibleGameRules />
      </div>
    </div>
  );
};
