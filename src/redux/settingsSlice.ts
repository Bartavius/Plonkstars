import { createSlice } from "@reduxjs/toolkit";

type settingsState = {
  mapNumber: number;
};

const initialState: settingsState = {
  mapNumber: 0,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setMapType(state, { payload: { mapNumber } }) {
      state.mapNumber = mapNumber;
    },
  },
});

export const { setMapType } = settingsSlice.actions;

export default settingsSlice.reducer;
