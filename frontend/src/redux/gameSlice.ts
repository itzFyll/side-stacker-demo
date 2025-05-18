import { createSlice } from '@reduxjs/toolkit';
import { gameConstants } from '@constants/gameConstants';

const initialState = {
  board: Array(7)
    .fill(null)
    .map(() => Array(7).fill('_')),
  currentPlayer: gameConstants.PLAYER_ONE,
  status: 'waiting', // or 'playing', 'finished'
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {},
});

export default gameSlice.reducer;