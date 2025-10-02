import { GameState } from "../lib/game-logic";
import GameBoard from "./game-board";
import { GameInstructions } from "./game-instructions";
import ScorePanel from "./score-panel";

export const GameContent = ({
  gameState,
  handleNewGame,
  handleGameStateChange,
  gridCols,
  gridRows,
  isPreviewActive,
}: {
  gameState: GameState;
  handleNewGame: (cols: number, rows: number) => void;
  handleGameStateChange: (newState: GameState) => void;
  gridCols: number;
  gridRows: number;
  isPreviewActive: boolean;
}) => {
  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-6">
      <GameBoard
        gameState={gameState}
        onGameStateChange={handleGameStateChange}
        maxGridCols={gridCols}
        isPreviewActive={isPreviewActive}
      />

      <div className="flex w-full max-w-lg shrink flex-col items-stretch gap-6">
        <ScorePanel
          onNewGame={() => handleNewGame(gridCols, gridRows)}
          isGameActive={!gameState.isGameOver}
          gameState={gameState}
          gridCols={gridCols}
          gridRows={gridRows}
        />

        <GameInstructions />
      </div>
    </div>
  );
};
