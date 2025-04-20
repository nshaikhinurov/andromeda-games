import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { produce } from "immer";
import { useDispatch, useSelector, useStore } from "react-redux";
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
  } satisfies AppState;
};

export const gameSlice = createSlice({
  name: "game",
  initialState: generateInitialState(),
  selectors: {
    shouldDisplayTimerSelector: (state: AppState) => {
      return state.settings.shouldDisplayTimer;
    },
  },
  reducers: {
    cellClicked: (state, action: PayloadAction<{ cellId: number }>) => {
      if (state.gameFinishedAt) {
        return;
      }

      const currentBoardId = state.boardHistory.ids.at(-1);
      const currentBoard = currentBoardSelector(state);

      if (!currentBoard || currentBoardId === undefined) {
        return;
      }

      const row = Math.floor(action.payload.cellId / currentBoard.length);
      const col = action.payload.cellId % currentBoard.length;

      const clickedCellValue = currentBoard[row][col];
      const nextCellValue = getNextValue(clickedCellValue);

      const newBoard = produce(currentBoard, (draft) => {
        draft[row][col] = nextCellValue;
      });

      state.boardHistory.ids.push(currentBoardId + 1);
      state.boardHistory.entities[currentBoardId + 1] = newBoard;

      if (
        newBoard.flat().every((cell) => cell !== null) &&
        isValidSolution(newBoard)
      ) {
        state.gameFinishedAt = Date.now();
      }
    },
    cellRestored: (state) => {
      if (state.gameFinishedAt) {
        return;
      }

      const currentBoardId = state.boardHistory.ids.at(-1);

      if (currentBoardId !== undefined && currentBoardId > 1) {
        state.boardHistory.entities[currentBoardId] = undefined;
        state.boardHistory.ids.pop();
      }
    },
    boardCleared: (state) => {
      if (state.gameFinishedAt) {
        return;
      }

      state.boardHistory.ids = [1];
      state.boardHistory.entities = {
        1: state.boardHistory.entities[1],
      };
    },
    boardSolved: (state) => {
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
    },
    gameRestarted: () => {
      return generateInitialState();
    },
  },
});

export const currentBoardSelector = (state: AppState) => {
  const boardId = state.boardHistory.ids.at(-1);

  if (boardId) {
    return state.boardHistory.entities[boardId];
  }
};

export const currentCellSelector = (state: AppState, cellId: number) => {
  const currentBoard = currentBoardSelector(state);
  if (!currentBoard) return null;
  const row = Math.floor(cellId / currentBoard.length);
  const col = cellId % currentBoard.length;
  return currentBoard[row][col];
};

export const shouldDisplayTimerSelector = (state: AppState) => {
  return state.settings.shouldDisplayTimer;
};

export const store = configureStore({
  reducer: gameSlice.reducer,
});

type AppStore = typeof store;
type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppStore = useStore.withTypes<AppStore>();
