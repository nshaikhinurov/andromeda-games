import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  Board,
  generateBoard,
  getNextValue,
  isValidSolution,
  solve,
} from "~/fsd/pages/game/model";

export type AppState = {
  boardHistory: {
    ids: number[];
    entities: Record<number, Board | undefined>;
  };
  gameStartedAt: number;
  gameFinishedAt: number;
  settings: {
    shouldDisplayTimer: boolean;
    shouldDisplayErrors: boolean;
  };
  // Actions
  cellClicked: (cellId: number) => void;
  cellRestored: () => void;
  boardCleared: () => void;
  boardSolved: () => void;
  gameRestarted: () => void;
};

const generateInitialState = () => {
  return {
    boardHistory: {
      ids: [1],
      entities: {
        1: generateBoard(),
      } as Record<number, Board | undefined>,
    },
    gameStartedAt: Date.now(),
    gameFinishedAt: 0,
    settings: {
      shouldDisplayTimer: true,
      shouldDisplayErrors: true,
    },
  };
};

export const useAppStore = create<AppState>()(
  immer((set) => ({
    ...generateInitialState(),

    cellClicked: (cellId: number) => {
      set((state) => {
        if (state.gameFinishedAt) {
          return;
        }

        const currentBoardId = state.boardHistory.ids.at(-1);
        const currentBoard = currentBoardSelector(state);

        if (!currentBoard || currentBoardId === undefined) {
          return;
        }

        const row = Math.floor(cellId / currentBoard.length);
        const col = cellId % currentBoard.length;

        const clickedCellValue = currentBoard[row][col];
        const nextCellValue = getNextValue(clickedCellValue);

        // With immer middleware, we can mutate the draft state directly
        state.boardHistory.ids.push(currentBoardId + 1);
        state.boardHistory.entities[currentBoardId + 1] = [...currentBoard];
        state.boardHistory.entities[currentBoardId + 1]![row][col] =
          nextCellValue;

        const newBoard = state.boardHistory.entities[currentBoardId + 1]!;

        if (
          newBoard.flat().every((cell) => cell !== null) &&
          isValidSolution(newBoard)
        ) {
          state.gameFinishedAt = Date.now();
        }
      });
    },

    cellRestored: () => {
      set((state) => {
        if (state.gameFinishedAt) {
          return;
        }

        const currentBoardId = state.boardHistory.ids.at(-1);

        if (currentBoardId !== undefined && currentBoardId > 1) {
          state.boardHistory.entities[currentBoardId] = undefined;
          state.boardHistory.ids.pop();
        }
      });
    },

    boardCleared: () => {
      set((state) => {
        if (state.gameFinishedAt) {
          return;
        }

        state.boardHistory.ids = [1];
        state.boardHistory.entities = {
          1: state.boardHistory.entities[1],
        };
      });
    },

    boardSolved: () => {
      set((state) => {
        if (state.gameFinishedAt) {
          return;
        }

        const currentBoardId = state.boardHistory.ids.at(-1);
        const initialBoard = state.boardHistory.entities[1];

        if (!initialBoard || currentBoardId === undefined) {
          return;
        }

        const [solvedBoard] = solve(initialBoard);
        state.boardHistory.ids.push(currentBoardId + 1);
        state.boardHistory.entities[currentBoardId + 1] = solvedBoard;

        if (
          solvedBoard.flat().every((cell) => cell !== null) &&
          isValidSolution(solvedBoard)
        ) {
          state.gameFinishedAt = Date.now();
        }
      });
    },

    gameRestarted: () => {
      set(generateInitialState());
    },
  })),
);

// Selectors
const currentBoardSelector = (state: AppState) => {
  const boardId = state.boardHistory.ids.at(-1);

  if (boardId) {
    return state.boardHistory.entities[boardId];
  }
  return undefined;
};

const currentCellSelector = (state: AppState, cellId: number) => {
  const currentBoard = currentBoardSelector(state);
  if (!currentBoard) return null;
  const row = Math.floor(cellId / currentBoard.length);
  const col = cellId % currentBoard.length;
  return currentBoard[row][col];
};

// Helper hooks to select specific parts of the state
export const useCurrentBoard = () => useAppStore(currentBoardSelector);
export const useCurrentCell = (cellId: number) =>
  useAppStore((state) => currentCellSelector(state, cellId));
export const useShouldDisplayTimer = () =>
  useAppStore((state) => state.settings.shouldDisplayTimer);
export const useGameStartedAt = () =>
  useAppStore((state) => state.gameStartedAt);
export const useGameFinishedAt = () =>
  useAppStore((state) => state.gameFinishedAt);
export const useSettings = () => useAppStore((state) => state.settings);
