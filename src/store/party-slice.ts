import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Party = {
  code: string|undefined;
};

const initialState: Party = {
  code: undefined
};

const partySlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setPartyCode(state, action: PayloadAction<string>) { 
      state.code = action.payload;
    },
    clearPartyCode(state) {
      state.code = undefined;
    },
}});

export const { setPartyCode,clearPartyCode } = partySlice.actions;

export default partySlice.reducer;
