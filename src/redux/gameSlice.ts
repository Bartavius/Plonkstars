import { createSlice } from "@reduxjs/toolkit";

type GameState = {
  mapName: string|undefined;
  map_id: string|undefined;
  time: number|undefined; // in seconds
  rounds: number|undefined;
  nmpz: boolean|undefined;
};

const initialState: GameState = {
  mapName: undefined,
  map_id: undefined,
  time: undefined,
  rounds: undefined,
  nmpz: undefined,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameSettings(state, { payload: { mapName, map_id, time, rounds, nmpz } }) { 
      state.mapName = mapName;
      state.map_id = map_id;
      state.time = time;
      state.rounds = rounds;
      state.nmpz = nmpz;
    },
    setGameMap(state, { payload: { mapName, map_id } }) {
      state.mapName = mapName;
      state.map_id = map_id;
    },
}});

export const { setGameSettings,setGameMap } = gameSlice.actions;

export default gameSlice.reducer;
