import api from "@/utils/api";
import { createSlice } from "@reduxjs/toolkit";

type timeState = {
  offset: number|undefined;
};

const initialState:timeState = {
  offset: undefined,
};


export async function calcOffset(dispatch:any){
    const start = Date.now();
    const res = await api.get("/time");
    const end = Date.now();
    const rtt = (end - start) / 2;
    const estimatedServerTime = new Date(res.data.time).getTime() + rtt;
    dispatch(setOffset({offset:estimatedServerTime - Date.now()}));
}

const timeSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setOffset(state, { payload: { offset } }) {
      state.offset = offset;
    },
  },
});

export const { setOffset } = timeSlice.actions;

export default timeSlice.reducer;
