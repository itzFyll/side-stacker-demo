import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AiDifficulty, Game, GameMode } from 'models/types';

axios.defaults.baseURL = 'http://localhost:3001/api';
type Cell = 'x' | 'o' | null;
type Status = 'in_progress' | 'won' | 'draw';

interface GameState {
  id: string | null;
  board: Cell[][];
  currentPlayer: 'x' | 'o';
  status: Status;
  winner: 'x' | 'o' | null;
  loading: boolean;
  error: string | null;
}

const initialState: GameState = {
  id: null,
  board: Array.from({ length: 7 }, () => Array(7).fill(null)),
  currentPlayer: 'x',
  status: 'in_progress',
  winner: null,
  loading: false,
  error: null,
};

// Async thunks
export const createGame = createAsyncThunk(
  'game/createGame',
  async ({
    gameMode,
    ai1Difficulty,
    ai2Difficulty,
  }: {
    gameMode: GameMode;
    ai1Difficulty: AiDifficulty;
    ai2Difficulty: AiDifficulty;
  }) => {
    const res = await axios.post('/games', {
      gameMode,
      ai1Difficulty,
      ai2Difficulty,
    });
    return res.data;
  },
);

export const fetchGame = createAsyncThunk(
  'game/fetchGame',
  async (gameId: string) => {
    const res = await axios.get(`/games/${gameId}`);
    return res.data;
  },
);

export const makeMove = createAsyncThunk(
  'game/makeMove',
  async ({
    gameId,
    row,
    side,
  }: {
    gameId: string;
    row: number;
    side: 'L' | 'R';
  }) => {
    const res = await axios.post(`/games/${gameId}/move`, { row, side });
    return res.data;
  },
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGame.fulfilled, (state, action: PayloadAction<Game>) => {
        state.loading = false;
        state.id = action.payload.id;
        state.board = action.payload.board;
        state.currentPlayer = action.payload.currentPlayer;
        state.status = action.payload.status;
        state.winner = action.payload.winner;
      })
      .addCase(createGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create game';
      })
      .addCase(fetchGame.fulfilled, (state, action: PayloadAction<Game>) => {
        state.id = action.payload.id;
        state.board = action.payload.board;
        state.currentPlayer = action.payload.currentPlayer;
        state.status = action.payload.status;
        state.winner = action.payload.winner;
      })
      .addCase(makeMove.fulfilled, (state, action: PayloadAction<Game>) => {
        state.board = action.payload.board;
        state.currentPlayer = action.payload.currentPlayer;
        state.status = action.payload.status;
        state.winner = action.payload.winner;
      });
  },
});

export default gameSlice.reducer;
