import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

type GameState = {
  mapName: string;
  mapId: string;
  seconds: number; // in seconds
  rounds: number;
};

const initialState: GameState = {
  mapName: "World",
  mapId: "6de5dcca-72c2-4c5a-8984-bcff7f059ea0",
  seconds: 60, // in seconds
  rounds: 5,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameSettings(state, { payload: { mapName, mapId, seconds, rounds } }) {
      state.mapName = mapName;
      state.mapId = mapId;
      state.seconds = seconds;
      state.rounds = rounds;
      // Cookies.set("mapName", mapName);
      // Cookies.set("mapId", mapId);
      // Cookies.set("seconds", seconds);
      // Cookies.set("rounds", rounds);
    },

    setGameMap(state, { payload: { mapName, mapId } }) {
      state.mapName = mapName;
      state.mapId = mapId;
      // Cookies.set("mapName", mapName);
      // Cookies.set("mapId", mapId);
    }
    // initializeSettings(state) {
    //   const mapName = Cookies.get("mapName") || state.mapName;
    //   const mapId = Cookies.get("mapId") || state.mapId;
    //   const seconds = Cookies.get("seconds")
    //     ? parseInt(Cookies.get("seconds")!)
    //     : state.seconds;
    //   const rounds = Cookies.get("rounds")
    //     ? parseInt(Cookies.get("rounds")!)
    //     : state.rounds;

    //   state.mapName = mapName;
    //   state.mapId = mapId;
    //   state.seconds = seconds;
    //   state.rounds = rounds;
    // },
  },
});

export const { setGameSettings,setGameMap } = gameSlice.actions;

export default gameSlice.reducer;
