import { createSlice } from "@reduxjs/toolkit";

type settingsState = {
  mapNumber: number;
  miniMapResolution: number;
};

const initialState: settingsState = {
  mapNumber: 0,
  miniMapResolution: 128,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setMapType(state, { payload: { mapNumber } }) {
      state.mapNumber = mapNumber;
    },
    setMiniMapResolution(state, { payload: { miniMapResolution } }) {
      state.miniMapResolution = miniMapResolution;
    },
  },
});

export const { setMapType,setMiniMapResolution } = settingsSlice.actions;

export default settingsSlice.reducer;
