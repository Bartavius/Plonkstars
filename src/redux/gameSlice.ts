import api from "@/utils/api";
import { createSlice } from "@reduxjs/toolkit";
import { unstable_HistoryRouter } from "react-router-dom";

type GameState = {
  mapName: string|undefined;
  mapId: string|undefined;
  seconds: number|undefined; // in seconds
  rounds: number|undefined;
  NMPZ: boolean|undefined;
};

const initialState: GameState = {
  mapName: undefined,
  mapId: undefined,
  seconds: undefined,
  rounds: undefined,
  NMPZ: undefined,
};

// Fetch initial state asynchronously and dispatch to update the state
export const fetchInitialState = async (dispatch: any) => {
  const res = await api.get("/session/default");
  dispatch(
    setGameSettings({
      mapName: res.data.mapName,
      mapId: res.data.mapId,
      seconds: res.data.seconds,
      rounds: res.data.rounds,
      NMPZ: res.data.NMPZ,
    })
  );
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
