import { createSlice } from "@reduxjs/toolkit";

type GameState = {
  mapName: string;
  mapId: string;
  seconds: number; // in seconds
  rounds: number;
  NMPZ: boolean;
};

const initialState: GameState = {
  mapName: "World",
  mapId: "6de5dcca-72c2-4c5a-8984-bcff7f059ea0",
  seconds: 60, // in seconds
  rounds: 5,
  NMPZ: false,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameSettings(state, { payload: { mapName, mapId, seconds, rounds, NMPZ } }) { 
      state.mapName = mapName;
      state.mapId = mapId;
      state.seconds = seconds;
      state.rounds = rounds;
      state.NMPZ = NMPZ;
    },
    setGameMap(state, { payload: { mapName, mapId } }) {
      state.mapName = mapName;
      state.mapId = mapId;
    },
}});

export const { setGameSettings,setGameMap } = gameSlice.actions;

export default gameSlice.reducer;
