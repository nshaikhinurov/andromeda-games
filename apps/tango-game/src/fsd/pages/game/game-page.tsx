"use client";

import {
  FaBolt,
  FaBroom,
  FaLightbulb,
  FaRotateLeft,
  FaBrain,
  FaShuffle,
} from "react-icons/fa6";
import {
  gameSlice,
  shouldDisplayTimerSelector,
  useAppDispatch,
  useAppSelector,
} from "~/fsd/app/store";
import { Button } from "~/fsd/shared/ui/button";
import { Board } from "./ui/board";
import { GameInstructions } from "./ui/game-instructions";
import { GameTitle } from "./ui/header";
import { SettingsMenu } from "./ui/settings-menu";
import { Timer } from "./ui/timer";
import { pickRandom } from "@andromeda-games/utils";
import { congratulations } from "./ui/congratulations";

export const GamePage = () => {
  const gameStartedAt = useAppSelector((state) => state.gameStartedAt);
  const gameStatus = useAppSelector((state) =>
    state.gameFinishedAt > 0 ? "finished" : "playing",
  );

  const shouldDisplayTimer = useAppSelector(shouldDisplayTimerSelector);
  const dispatch = useAppDispatch();
  const isUndoButtonDisabled = useAppSelector(
    (state) => state.boardHistory.ids.length < 2,
  );

  const handleClearClick = () => {
    dispatch(gameSlice.actions.boardCleared());
  };

  const handleUndoClick = () => {
    dispatch(gameSlice.actions.cellRestored());
  };

  const handleRestartClick = () => {
    dispatch(gameSlice.actions.gameRestarted());
  };

  const handleSolveClick = () => {
    dispatch(gameSlice.actions.boardSolved());
  };

  const randomCongratulation = pickRandom(congratulations);

  return (
    <main className="flex w-full max-w-[400px] flex-col items-stretch gap-4 rounded-md bg-stone-100 p-4 text-black sm:w-[452px]">
      <div className="relative">
        <GameTitle />
        <SettingsMenu triggerClassName="absolute top-0 right-0" />
      </div>

      <>
        <div className="grid grid-cols-3 grid-rows-1 items-center justify-center gap-2 font-semibold">
          <div className="text-center">Puzzle #976</div>
          <div className="flex items-center justify-center gap-2">
            {shouldDisplayTimer && <Timer key={gameStartedAt} />}
          </div>
          <Button onClick={handleRestartClick}>
            <FaShuffle /> Restart
          </Button>
        </div>

        <Board key={gameStartedAt} />

        {gameStatus === "playing" && (
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={handleUndoClick} disabled={isUndoButtonDisabled}>
              <FaRotateLeft />
              Undo
            </Button>
            <Button>
              <FaLightbulb /> Hint
            </Button>
            <Button onClick={handleClearClick} disabled={isUndoButtonDisabled}>
              <FaBroom /> Clear
            </Button>
            <Button onClick={handleSolveClick}>
              <FaBolt /> Solve
            </Button>
          </div>
        )}
      </>

      {gameStatus === "finished" && (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-2xl font-bold">{randomCongratulation.title}</h2>
          <p className="text-lg">{randomCongratulation.subtitle}</p>
          <Button onClick={() => dispatch(gameSlice.actions.gameRestarted())}>
            <FaBrain /> Play Again
          </Button>
        </div>
      )}

      <GameInstructions />
    </main>
  );
};
