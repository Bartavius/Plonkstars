import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type GameState = {
    mapName: string | null;
    mapId: string | null;
    seconds: number | null; // in seconds
    rounds: number | null;
  }

const initialState: GameState = {
    mapName: null,
    mapId: null,
    seconds: null, // in seconds
    rounds: null,
  };
  
  const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameSettings(state, {payload: {mapName, mapId, seconds, rounds}}) {
            state.mapName = mapName;
            state.mapId = mapId;
            state.seconds = seconds;
            state.rounds = rounds;
        }
    },
  });
  
  export const { setGameSettings } = gameSlice.actions;
  
  export default gameSlice.reducer;